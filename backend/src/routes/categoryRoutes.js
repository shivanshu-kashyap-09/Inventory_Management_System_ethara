const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Category' } }
 *       401:
 *         description: Not authorized / No token
 */
router.route('/')
  .get(authMiddleware, categoryController.getCategories)
  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     tags:
   *       - Categories
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
   *             properties:
   *               name: { type: string }
   *               description: { type: string }
   *               image: { type: string }
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data: { $ref: '#/components/schemas/Category' }
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Not authorized / No token
   *       403:
   *         description: Forbidden - Not admin
   */
  .post(authMiddleware, authorize('admin'), categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       401:
 *         description: Not authorized / No token
 *       404:
 *         description: Category not found
 */
router.route('/:id')
  .get(authMiddleware, categoryController.getCategory)
  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update a category
   *     tags:
   *       - Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           description: Category ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name: { type: string }
   *               description: { type: string }
   *               image: { type: string }
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data: { $ref: '#/components/schemas/Category' }
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Not authorized / No token
   *       403:
   *         description: Forbidden - Not admin
   *       404:
   *         description: Category not found
   */
  .put(authMiddleware, authorize('admin'), categoryController.updateCategory)
  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     tags:
   *       - Categories
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           description: Category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
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
   *         description: Category not found
   */
  .delete(authMiddleware, authorize('admin'), categoryController.deleteCategory);
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id: { type: string, description: The auto-generated ID of the category }
 *         name: { type: string, description: Category name }
 *         description: { type: string, description: Category description }
 *         image: { type: string, description: Category image URL }
 *         user: { type: string, description: User ID of the creator }
 *         createdAt: { type: string, format: date, description: Date of creation }
 *         updatedAt: { type: string, format: date, description: Date of update }
 */
module.exports = router;
