const Transaction = require('../models/transaction');

exports.createTransaction = async (req, res) => {
  try {
    const { requestId, amount, paymentMethod, status, sellerId } = req.body;

    const transaction = new Transaction({
      requestId,
      amount,
      status: status || 'pending',
      buyer: req.user._id, // Assuming user is authenticated
      seller: sellerId,
      paymentMethod
    });

    const savedTransaction = await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transactionId: savedTransaction._id
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated', transaction });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId)
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};
