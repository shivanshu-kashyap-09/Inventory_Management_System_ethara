const categoryService = require('../services/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body, req.user.id);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const response = await categoryService.deleteCategory(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
