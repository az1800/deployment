const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');

// Create new transaction
router.post('/create', transactionController.createTransaction);

// Update transaction status
router.patch('/:transactionId/status', transactionController.updateTransactionStatus);

// Get transaction details
router.get('/:transactionId', transactionController.getTransaction);

module.exports = router;
