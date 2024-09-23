const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [auth, [
  check('tour', 'Tour is required').not().isEmpty(),
  check('tourDate', 'Tour date is required').isISO8601()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { tour: tourId, tourDate } = req.body;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ msg: 'Tour not found' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      tour: tourId,
      tourDate,
      totalPrice: tour.price
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('tour', 'name');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add more routes for updating and cancelling bookings

module.exports = router;