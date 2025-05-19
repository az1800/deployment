const Service = require("../models/service")



exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized: Please log in." });
    }
    next();
  };
  
  exports.isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.userType !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required." });
    }
    next();
  };
  
  exports.isAccountingFirm = (req, res, next) => {
    if (!req.session.user || req.session.user.userType !== "firm") {
        return res.status(403).json({ message: "Forbidden: Accounting firm access required." });
    }
    next();
  };
  
  exports.isClient = (req, res, next) => {
    if (!req.session.user || req.session.user.userType !== "client") {
        return res.status(403).json({ message: "Forbidden: Client access required." });
    }
    next();
  };
  
  exports.isFirmOwner = async (req, res, next) => {
    const loggedInFirmId = req.session.user.accountingFirm; 
    const requestedFirmId = req.body.AccountFirmId; 

        if (loggedInFirmId.toString() !== requestedFirmId.toString()) {
        return res.status(403).json({ message: "Access denied. You can only edit your own firm profile." });
    }

    next(); 
      
};

  