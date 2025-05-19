const express = require("express");

const clientController = require("../controllers/client");

const router = express.Router();
const { isAuthenticated, isClient } = require("../controllers/access_control");

router.get("/firmList", clientController.getAccountFirms);

router.get("/firmProfile", clientController.getAccountFirm);

router.post("/firmSearch", clientController.searchForAccountingFirm);

router.get("/firm-display-service", clientController.getServices);

router.post("/post-request", isAuthenticated,isClient,clientController.createRequest);

router.post("/display-user-request", clientController.getClientRequests);
router.post(
  "/post-request",
  isAuthenticated,
  isClient,
  clientController.createRequest
);

router.post(
  "/delete-request",
  isAuthenticated,
  isClient,
  clientController.deleteRequest
);

router.post("/search",clientController.getFilteredResults);
router.get("/filterCriteria", clientController.getFilterCriteria);

module.exports = router;
