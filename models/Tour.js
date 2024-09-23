const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  maxGroupSize: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'difficult'], required: true },
  startDates: [{ type: Date }],
  images: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tour', TourSchema);