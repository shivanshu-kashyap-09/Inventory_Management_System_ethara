const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Transaction' } }
 *       401:
 *         description: Not authorized / No token
 */
router.route('/')
  .get(authMiddleware, transactionController.getTransactions)
  /**
   * @swagger
   * /api/transactions:
   *   post:
   *     summary: Create a new transaction
   *     tags:
   *       - Transactions
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - amount
   *               - product
   *               - paymentMethod
   *               - customerName
   *               - customerPhone
   *             properties:
   *               type: { type: string }
   *               amount: { type: number }
   *               product: { type: string }
   *               paymentMethod: { type: string }
   *               customerName: { type: string }
   *               customerPhone: { type: string }
   *     responses:
   *       201:
   *         description: Transaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data: { $ref: '#/components/schemas/Transaction' }
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Not authorized / No token
   */
  .post(authMiddleware, transactionController.createTransaction); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *         - paymentMethod
 *         - customerName
 *         - customerPhone
 *       properties:
 *         id: { type: string, description: The auto-generated ID of the transaction }
 *         type: { type: string, enum: [ 'Sale', 'Expense' ], description: Transaction type }
 *         amount: { type: number, description: Transaction amount }
 *         product: { type: string, description: Product ID (if applicable) }
 *         paymentMethod: { type: string, enum: [ 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other' ], description: Payment method }
 *         customerName: { type: string, description: Customer name }
 *         customerPhone: { type: string, description: Customer phone number }
 *         user: { type: string, description: User ID of the creator }
 *         createdAt: { type: string, format: date, description: Date of creation }
 *         updatedAt: { type: string, format: date, description: Date of update }
 */
module.exports = router;
