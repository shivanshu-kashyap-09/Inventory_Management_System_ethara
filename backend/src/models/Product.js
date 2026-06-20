const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'Please add an SKU'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

productSchema.index({ name: 'text', sku: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
