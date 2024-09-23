const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Tour = require('../models/Tour');

// @route   POST api/tours
// @desc    Create a new tour
// @access  Private (Admin only)
router.post('/', [auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric(),
  check('duration', 'Duration is required').isNumeric(),
  check('maxGroupSize', 'Max group size is required').isNumeric(),
  check('difficulty', 'Difficulty is required').isIn(['easy', 'medium', 'difficult'])
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newTour = new Tour({
      ...req.body,
      createdBy: req.user.id
    });

    const tour = await newTour.save();
    res.json(tour);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tours
// @desc    Get all tours
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find().sort({ date: -1 });
    res.json(tours);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add more routes for updating and deleting tours

module.exports = router;