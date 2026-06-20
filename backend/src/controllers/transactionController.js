const transactionService = require('../services/transactionService');

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.user.id);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const data = await transactionService.getTransactions(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
