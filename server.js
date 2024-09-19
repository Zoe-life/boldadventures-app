const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const User = require('./models/User');
const Tour = require('./models/Tour');

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const helmet = require('helmet');
const csrf = require('csurf');

const app = express();

// Initialize Sentry (add this near the top of the file)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Add helmet middleware (add this near the top of your middleware stack)
app.use(helmet());

// Add CSRF protection (add this after your session middleware)
app.use(csrf({ cookie: true }));

// Add Sentry middleware (add this before your routes)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/api/user', (req, res) => {
  res.json(req.user || null);
});

app.get('/api/tours', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tours' });
  }
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/tours/save', csrf(), ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const tourId = req.body.tourId;
    if (!user.savedTours.includes(tourId)) {
      user.savedTours.push(tourId);
      await user.save();
    }
    res.json({ message: 'Tour saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving tour' });
  }
});

app.get('/api/user/saved-tours', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedTours');
    res.json(user.savedTours);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching saved tours' });
  }
});

// Add Sentry error handler (add this after your routes, before other error handlers)
app.use(Sentry.Handlers.errorHandler());

// Update your general error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  Sentry.captureException(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/api/tours/:id/review', csrf(), ensureAuthenticated, async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    const newReview = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    };
    
    tour.reviews.push(newReview);
    await tour.save();
    
    res.json({ message: 'Review added successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Error adding review' });
  }
});