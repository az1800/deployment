const Transaction = require('../models/transaction');
const Request = require('../models/request');
const User = require('../models/user');
const axios = require('axios');

const ESCROW_API_KEY = '4357_IgFay5YAVyfk8d73gEPOxS9D4NioO9LMnYDPcKjeWCgsgY9PCgBkkAaCCvNk5vy2';
const ESCROW_API_URL = 'https://api.escrow.com/2017-09-01';

exports.createEscrowTransaction = async (req, res) => {
  try {
    const { amount, requestId } = req.body;

    if (!amount || !requestId) {
      return res.status(400).json({ message: "Amount and Request ID are required" });
    }

    // Create a simple escrow transaction
    const escrowPayload = {
      currency: "USD",
      amount,
      description: `Service Payment for Request #${requestId}`,
      parties: [
        {
          role: "buyer",
          customer: "buyer@example.com", // Use default test values
          first_name: "Test",
          last_name: "Buyer",
        },
        {
          role: "seller",
          customer: "seller@example.com", // Use default test values
          first_name: "Test",
          last_name: "Seller",
        },
      ],
      inspection_period: 259200,
      agreed_terms: "Service will be delivered as specified in the request",
    };

    const escrowResponse = await axios.post(
      `${ESCROW_API_URL}/transaction`,
      escrowPayload,
      {
        headers: {
          Authorization: `Bearer ${ESCROW_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Store minimal transaction details
    const transaction = new Transaction({
      escrowId: escrowResponse.data.id,
      requestId,
      amount,
      status: 'pending'
    });
    await transaction.save();

    res.json({
      transactionId: transaction._id,
      escrowId: escrowResponse.data.id,
      redirectUrl: escrowResponse.data.landing_page_url,
    });
  } catch (error) {
    console.error("Escrow creation error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to create escrow transaction",
      error: error.message,
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    console.log('Received webhook:', req.body);
    const { transaction_id, status } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ message: 'Missing transaction_id' });
    }

    const transaction = await Transaction.findOne({ escrowId: transaction_id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = status;
    await transaction.save();

    console.log('Updated transaction status:', {
      id: transaction._id,
      status: status
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      message: 'Webhook processing failed', 
      error: error.message 
    });
  }
};