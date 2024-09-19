const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  profilePicture: String,
  savedTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }]
});

module.exports = mongoose.model('User', userSchema);