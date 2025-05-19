const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/reset_password");


router.post("/validateEmail", resetPasswordController.sendOTP);

router.post("/validateOTP", resetPasswordController.verifyOtp);

router.post("/storePassword", resetPasswordController.resetPassword);

module.exports = router;
