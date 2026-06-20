const productService = require('../services/productService');

const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.imageUrl = req.file.path; // from cloudinary multer
    }

    const product = await productService.createProduct(productData, req.user.id);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const data = await productService.getProducts(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    const product = await productService.updateProduct(req.params.id, updateData);
    res.json(product);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const response = await productService.deleteProduct(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
