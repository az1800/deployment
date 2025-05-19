const mongoose = require("mongoose");
const AccountingFirm = require("../models/accounting_firm");
const ObjectionTicket = require("../models/objection_ticket");
const User = require("../models/user");
const ClientDeletion = require("../models/client_deletion");

const admin = {
  getAllAccountingFirms: async (req, res) => {
    try {
      const firms = await AccountingFirm.find()
        .select({
          firmName: 1,
          status: 1,
          industrySpecialization: 1,
          firmSize: 1,
          rating: 1,
          services: 1,
          address: 1,
          certificationDetails: 1,
          commercialRegister: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort({ createdAt: -1 });

      const formattedFirms = firms.map((firm) => ({
        firmName: firm.firmName,
        status: firm.status || "pending",
        industrySpecialization: firm.industrySpecialization || "General",
        firmSize: firm.firmSize || 0,
        rating: firm.rating || 0,
        services: firm.services || [],
        address: firm.address || "Not provided",
        certificationDetails:
          firm.certificationDetails || "Pending verification",
        commercialRegister: firm.commercialRegister || "Not provided",
        description: firm.description || "No description available",
        image: firm.image || "/uploads/profile-images/DefualtUserPicture.jpg",
        _id: firm._id,
        createdAt: firm.createdAt,
        updatedAt: firm.updatedAt,
      }));

      res.status(200).json({
        success: true,
        count: formattedFirms.length,
        data: formattedFirms,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching accounting firms",
        error: error.message,
      });
    }
  },

  updateFirmStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["verified", "pending", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const firm = await AccountingFirm.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!firm) {
        return res.status(404).json({
          success: false,
          message: "Accounting firm not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `Firm status updated to ${status}`,
        data: firm,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating firm status",
        error: error.message,
      });
    }
  },

  getFirmDetails: async (req, res) => {
    try {
      const firm = await AccountingFirm.findById(req.params.id).select({
        firmName: 1,
        status: 1,
        industrySpecialization: 1,
        firmSize: 1,
        rating: 1,
        services: 1,
        address: 1,
        certificationDetails: 1,
        commercialRegister: 1,
        description: 1,
        image: 1,
        createdAt: 1,
        updatedAt: 1,
      });

      if (!firm) {
        return res.status(404).json({
          success: false,
          message: "Accounting firm not found",
        });
      }

      const firmDetails = {
        id: firm._id,
        firmDetails: {
          name: firm.firmName,
          status: firm.status,
          industry: firm.industrySpecialization || "Not specified",
          size: firm.firmSize || "Not specified",
          rating: firm.rating,
          location: firm.address || "Not specified",
        },
        certification: {
          details: firm.certificationDetails || "Not provided",
          commercialRegister: firm.commercialRegister || "Not provided",
        },
        profile: {
          description: firm.description,
          image: firm.image,
          servicesOffered: firm.services.length,
        },
        timestamps: {
          created: firm.createdAt,
          lastUpdated: firm.updatedAt,
        },
      };

      res.status(200).json({
        success: true,
        data: firmDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching firm details",
        error: error.message,
      });
    }
  },

  updateFirmDetails: async (req, res) => {
    try {
      const allowedUpdates = [
        "firmName",
        "status",
        "industrySpecialization",
        "firmSize",
        "rating",
        "services",
        "address",
        "certificationDetails",
        "commercialRegister",
        "description",
        "image",
      ];

      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const updatedFirm = await AccountingFirm.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
          select: "-__v",
        }
      );

      if (!updatedFirm) {
        return res.status(404).json({
          success: false,
          message: "Accounting firm not found",
        });
      }

      const formattedFirm = {
        id: updatedFirm._id,
        firmDetails: {
          name: updatedFirm.firmName,
          status: updatedFirm.status,
          industry: updatedFirm.industrySpecialization || "Not specified",
          size: updatedFirm.firmSize || "Not specified",
          rating: updatedFirm.rating,
          location: updatedFirm.address || "Not specified",
        },
        certification: {
          details: updatedFirm.certificationDetails || "Not provided",
          commercialRegister: updatedFirm.commercialRegister || "Not provided",
        },
        profile: {
          description: updatedFirm.description,
          image: updatedFirm.image,
          servicesOffered: updatedFirm.services.length,
        },
        timestamps: {
          created: updatedFirm.createdAt,
          lastUpdated: updatedFirm.updatedAt,
        },
      };

      res.status(200).json({
        success: true,
        message: "Firm details updated successfully",
        data: formattedFirm,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error updating firm details",
        error: error.message,
      });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      const tickets = await ObjectionTicket.find();

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllObjectionTickets: async (req, res) => {
    try {
      const tickets = await ObjectionTicket.find()
        .populate("clientID", "name email")
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("service", "serviceName price")
        .select("-__v")
        .sort({ createdAt: -1 });

      const formattedTickets = tickets.map((ticket) => ({
        id: ticket._id,
        ticketDetails: {
          client: ticket.clientID,
          sender: ticket.sender,
          receiver: ticket.receiver,
          service: ticket.service,
          issueTitle: ticket.issueTitle,
          status: ticket.status,
        },
        issue: {
          description: ticket.issueDescription,
          attachments: ticket.attachments,
          resolution: ticket.resolution,
        },
        timestamps: {
          created: ticket.createdAt,
          updated: ticket.updatedAt,
          submittedAt: ticket.timestamp,
        },
      }));

      console.log("Formatted tickets:", formattedTickets);
      res.status(200).json({
        success: true,
        count: formattedTickets.length,
        data: formattedTickets,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching objection tickets",
        error: error.message,
      });
    }
  },

  getAllClients: async (req, res) => {
    try {
      const clients = await User.find({ userType: "client" })
        .select("-password -__v")
        .sort({ createdAt: -1 });

      const formattedClients = clients.map((client) => ({
        id: client._id,
        clientDetails: {
          name: client.name || "N/A",
          email: client.email,
          phoneNumber: client.phoneNumber || "N/A",
        },
        transactions: client.transactions || [],
        timestamps: {
          created: client.createdAt,
          updated: client.updatedAt,
        },
      }));

      res.status(200).json({
        success: true,
        count: formattedClients.length,
        data: formattedClients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching clients",
        error: error.message,
      });
    }
  },

  getTicketDetails: async (req, res) => {
    try {
      const ticket = await ObjectionTicket.findById(req.params.id)
        .populate("clientID", "name email")
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("service", "name price");

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      const formattedTicket = {
        id: ticket._id,
        ticketDetails: {
          client: ticket.clientID,
          sender: ticket.sender,
          receiver: ticket.receiver,
          service: ticket.service,
          issueTitle: ticket.issueTitle,
          customIssueTitle: ticket.customIssueTitle,
          status: ticket.status,
        },
        issue: {
          description: ticket.issueDescription,
          attachments: ticket.attachments,
          resolution: ticket.resolution,
          budget: ticket.budget,
          originalDescription: ticket.originalDescription,
        },
        timestamps: {
          created: ticket.createdAt,
          updated: ticket.updatedAt,
          submittedAt: ticket.timestamp,
        },
      };
      console.log(ticket);

      res.status(200).json({
        success: true,
        data: formattedTicket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching ticket details",
        error: error.message,
      });
    }
  },

  updateTicketStatus: async (req, res) => {
    try {
      const { status } = req.body;

      // Validate status
      const validStatuses = ["pending", "under-review", "resolved"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const ticket = await ObjectionTicket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      ticket.status = status;
      await ticket.save();

      res.status(200).json({
        success: true,
        message: "Ticket status updated successfully",
        data: {
          id: ticket._id,
          status: ticket.status,
          updatedAt: ticket.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating ticket status",
        error: error.message,
      });
    }
  },

  getClientDetails: async (req, res) => {
    try {
      const client = await User.findOne({
        _id: req.params.id,
        userType: "client",
      })
        .select("-password -__v")
        .populate("transactions")
        .populate("accountingFirm");

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      const formattedClient = {
        id: client._id,
        personalInfo: {
          name: client.name,
          email: client.email,
          phoneNumber: client.phoneNumber || "Not provided",
        },
        accountDetails: {
          accountingFirm: client.accountingFirm,
          transactionsCount: client.transactions.length,
          recentTransactions: client.transactions.slice(0, 5), // Last 5 transactions
        },
        timestamps: {
          memberSince: client.createdAt,
          lastUpdated: client.updatedAt,
        },
      };

      res.status(200).json({
        success: true,
        data: formattedClient,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching client details",
        error: error.message,
      });
    }
  },

  // Modified deleteClient function that works with or without authentication
  deleteClient: async (req, res) => {
    try {
      const { reason, additionalNotes } = req.body;

      // Validate deletion reason
      const validReasons = [
        "account_inactive",
        "violation_of_terms",
        "user_requested",
        "fraudulent_activity",
        "duplicate_account",
        "other",
      ];

      if (!reason || !validReasons.includes(reason)) {
        return res.status(400).json({
          success: false,
          message: "Valid deletion reason is required",
          validReasons,
        });
      }

      // Find the client
      const client = await User.findOne({
        _id: req.params.id,
        userType: "client",
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      // Create deletion record with safeguard for auth
      const deletionRecord = new ClientDeletion({
        clientId: client._id,
        clientEmail: client.email,
        reason,
        additionalNotes,
        // If req.user exists, use the ID; otherwise use a temporary ObjectId
        deletedBy: req.user ? req.user._id : new mongoose.Types.ObjectId(),
        clientData: {
          name: client.name,
          phoneNumber: client.phoneNumber,
          transactions: client.transactions,
          accountingFirm: client.accountingFirm,
        },
      });

      await deletionRecord.save();

      // Delete the client
      await User.deleteOne({ _id: client._id });

      res.status(200).json({
        success: true,
        message: "Client deleted successfully",
        deletionRecord: {
          id: deletionRecord._id,
          reason: deletionRecord.reason,
          timestamp: deletionRecord.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting client",
        error: error.message,
      });
    }
  },
};

module.exports = admin;
