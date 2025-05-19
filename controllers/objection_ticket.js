const ObjectionTicket = require("../models/objection_ticket");

const objectionTicket = {
  // Get all objection tickets
  getAllTickets: async (req, res) => {
    try {
      const tickets = await ObjectionTicket.find();

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get tickets by client ID
  getClientTickets: async (req, res) => {
    try {
      const tickets = await ObjectionTicket.find({
        clientID: req.params.clientId,
      })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("service")
        .populate("requestId");
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single ticket by ID
  getTicketById: async (req, res) => {
    try {
      const ticket = await ObjectionTicket.findById(req.params.id)
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("service")
        .populate("requestId");
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new objection ticket
  createTicket: async (req, res) => {
    try {
      const newTicket = new ObjectionTicket(req.body);
      const savedTicket = await newTicket.save();
      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update ticket status
  updateTicketStatus: async (req, res) => {
    try {
      const updatedTicket = await ObjectionTicket.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.status(200).json(updatedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = objectionTicket;
