const Product = require('../models/Product');

const createProduct = async (productData, userId) => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
  });
  return product;
};

const getProducts = async (query) => {
  const { search, category, page = 1, limit = 10 } = query;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }

  const skip = (pageNumber - 1) * pageSize;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .skip(skip)
    .limit(pageSize);

  const total = await Product.countDocuments(filter);

  return {
    products,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    currentPage: pageNumber,
    totalProducts: total,
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  await product.deleteOne();
  return { message: 'Product removed' };
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
