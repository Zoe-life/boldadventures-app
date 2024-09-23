const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   POST api/booking
// @desc    Create a new booking
// @access  Private
router.post('/', auth, (req, res) => {
  // Implement booking logic here
  res.json({ msg: 'Booking created successfully' });
});

module.exports = router;