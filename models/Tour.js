const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  price: Number,
  image: String,
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Tour', tourSchema);