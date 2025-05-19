const express = require("express");
const router = express.Router();
const objectionTicketController = require("../controllers/objection_ticket");

// Get all objection tickets
router.get("/", objectionTicketController.getAllTickets);

// Get tickets by client ID
router.get("/client/:clientId", objectionTicketController.getClientTickets);

// Get single ticket
router.get("/:id", objectionTicketController.getTicketById);

// Create new ticket
router.post("/", objectionTicketController.createTicket);

// Update ticket status
router.patch("/:id/status", objectionTicketController.updateTicketStatus);

module.exports = router;
