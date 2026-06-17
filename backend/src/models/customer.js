const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  totalPurchases: {
    type: Number,
    required: true
  },
  lastActiveDays: {
    type: Number,
    required: true
  },
  satisfactionScore: {
    type: Number,
    required: true
  },
  churnRisk: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', customerSchema);
