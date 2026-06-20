const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

const createTransaction = async (transactionData, userId) => {
  const { product: productId, type, quantity, remarks } = transactionData;
  const quantityNumber = Number(quantity);

  if (!['IN', 'OUT'].includes(type) || !Number.isInteger(quantityNumber) || quantityNumber < 1) {
    const error = new Error('Type must be IN or OUT and quantity must be a positive whole number');
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (type === 'OUT' && product.currentStock < quantityNumber) {
    throw new Error('Insufficient stock');
  }

  const transaction = await Transaction.create({
    product: productId,
    type,
    quantity: quantityNumber,
    remarks,
    user: userId,
  });

  if (type === 'IN') {
    product.currentStock += quantityNumber;
  } else if (type === 'OUT') {
    product.currentStock -= quantityNumber;
  }
  await product.save();

  return transaction;
};

const getTransactions = async (query) => {
  const { page = 1, limit = 10, type, productId } = query;
  const filter = {};

  if (type) {
    filter.type = type;
  }
  if (productId) {
    filter.product = productId;
  }

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(filter)
    .populate('product', 'name sku')
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(filter);

  return {
    transactions,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalTransactions: total,
  };
};

module.exports = {
  createTransaction,
  getTransactions,
};
