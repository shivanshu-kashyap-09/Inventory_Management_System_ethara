const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  remarks: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
