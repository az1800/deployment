const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/access_control');
const escrowController = require('../controllers/escrow');

// Only keep routes that have implemented controller functions
router.post('/create', escrowController.createEscrowTransaction);
router.post('/webhook', escrowController.handleWebhook);

module.exports = router;