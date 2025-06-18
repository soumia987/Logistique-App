const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  departureLocation: {
    type: String,
    required: true,
  },
  stops: {
    type: [String], // intermediate stops
    default: [],
  },
  destination: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  goodsType: {
    type: String,
    enum: ['food', 'fragile', 'liquid', 'electronics', 'other'],
    required: true,
  },
  maxDimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  maxWeight: {
    type: Number, // in kg
    required: true,
  },
  availableCapacity: {
    type: Number, // in kg
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'canceled'],
    default: 'active',
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Trajet', trajetSchema);
