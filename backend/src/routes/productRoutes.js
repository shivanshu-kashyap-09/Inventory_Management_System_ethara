const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Product' } }
 *       401:
 *         description: Not authorized / No token
 */
router.route('/')
  .get(authMiddleware, productController.getProducts)
  /**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - currentStock
 *               - category
 *               - sku
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               currentStock: { type: number }
 *               lowStockThreshold: { type: number }
 *               category: { type: string }
 *               sku: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized / No token
 *       403:
 *         description: Forbidden - Not admin
 */
  .post(authMiddleware, authorize('admin'), upload.single('image'), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       401:
 *         description: Not authorized / No token
 *       404:
 *         description: Product not found
 */
router.route('/:id')
  .get(authMiddleware, productController.getProduct)
  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Update a product
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name: { type: string }
   *               description: { type: string }
   *               price: { type: number }
   *               currentStock: { type: number }
   *               lowStockThreshold: { type: number }
   *               category: { type: string }
   *               sku: { type: string }
   *               image: { type: string }
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data: { $ref: '#/components/schemas/Product' }
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Not authorized / No token
   *       403:
   *         description: Forbidden - Not admin
   *       404:
   *         description: Product not found
   */
  .put(authMiddleware, authorize('admin'), upload.single('image'), productController.updateProduct)
  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           description: Product ID
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 message: { type: string }
   *       401:
   *         description: Not authorized / No token
   *       403:
   *         description: Forbidden - Not admin
   *       404:
   *         description: Product not found
   */
  .delete(authMiddleware, authorize('admin'), productController.deleteProduct);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Product:
   *       type: object
   *       properties:
   *         _id: { type: string, description: The auto-generated ID }  # Added _id which Mongoose adds
   *         name: { type: string }
   *         description: { type: string }
   *         price: { type: number }
   *         currentStock: { type: number }
   *         lowStockThreshold: { type: number }
   *         category: { type: string }
   *         sku: { type: string }
   *         image: { type: string }
   */
module.exports = router;
