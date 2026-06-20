const Category = require('../models/Category');
const Product = require('../models/Product');

const createCategory = async (categoryData, userId) => {
  const category = await Category.create({
    ...categoryData,
    createdBy: userId,
  });
  return category;
};

const getCategories = async () => {
  const categories = await Category.find().populate('createdBy', 'name email');
  return categories;
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }
  const productCount = await Product.countDocuments({ category: id });
  if (productCount) {
    const error = new Error('This category cannot be deleted while products are assigned to it');
    error.statusCode = 409;
    throw error;
  }
  return category;
};

const updateCategory = async (id, updateData) => {
  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }
  await category.deleteOne();
  return { message: 'Category removed' };
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
