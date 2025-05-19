const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");
const { isAuthenticated } = require("../controllers/access_control");

// Submit a new rating
router.post(
  "/firms/:firmId/rate",
  isAuthenticated,
  ratingController.submitRating
);

// Get firm ratings
router.get(
  "/firms/:firmId/ratings",
  
  ratingController.getFirmRatings
);


router.get(
  "/request/:requestId",
  
  ratingController.getRequestDetails
);

module.exports = router;

