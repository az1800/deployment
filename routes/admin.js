// const express = require("express");
// const router = express.Router();
// const admin = require("../controllers/admin");

// const { isAuthenticated, isAdmin } = require("../controllers/access_control");

// // auth after finishing the admin panel
// //router.use(isAuthenticated, isAdmin);

// // Accounting Firm Management
// router.get("/accounting-firms", admin.getAllAccountingFirms);
// router.patch("/accounting-firms/:id/status", admin.updateFirmStatus);
// router.get("/accounting-firms/:id", admin.getFirmDetails);
// router.put("/accounting-firms/:id", admin.updateFirmDetails);

// // Objection Tickets Management
// router.get("/objection-tickets", admin.getAllObjectionTickets);
// router.get("/objection-tickets/:id", admin.getTicketDetails);
// router.patch("/objection-tickets/:id/status", admin.updateTicketStatus);

// // Client Management
// router.get("/clients", admin.getAllClients);
// router.get("/clients/:id", admin.getClientDetails);
// router.delete("/clients/:id", admin.deleteClient);
// module.exports = router;
const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const { isAuthenticated, isAdmin } = require("../controllers/access_control");

// Authentication middleware - To be uncommented when admin panel is finished
//router.use(isAuthenticated, isAdmin);

// Accounting Firm Management
router.get("/accounting-firms", admin.getAllAccountingFirms);
router.patch("/accounting-firms/:id/status", admin.updateFirmStatus);
router.get("/accounting-firms/:id", admin.getFirmDetails);
router.put("/accounting-firms/:id", admin.updateFirmDetails);

// Objection Tickets Management
router.get("/objection-tickets", admin.getAllObjectionTickets);
router.get("/objection-tickets/:id", admin.getTicketDetails);
router.patch("/objection-tickets/:id/status", admin.updateTicketStatus);

// Client Management
router.get("/clients", admin.getAllClients);
router.get("/clients/:id", admin.getClientDetails);
router.delete("/clients/:id", admin.deleteClient);

module.exports = router;
