const Product = require('../models/Product');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

const getDashboardStats = async () => {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();

  const lowStockProducts = await Product.find({
    $expr: { $lte: ['$currentStock', '$lowStockThreshold'] }
  });
  const lowStockCount = lowStockProducts.length;

  const recentTransactions = await Transaction.find()
    .populate('product', 'name sku')
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

  return {
    totalProducts,
    totalCategories,
    lowStockCount,
    lowStockProducts,
    recentTransactions,
  };
};

module.exports = {
  getDashboardStats,
};
