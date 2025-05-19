const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/access_control');
const couponController = require('../controllers/coupon');

router.post('/validate', isAuthenticated, couponController.validateCoupon);
router.post('/create', isAuthenticated, couponController.createCoupon);
router.get('/list', isAuthenticated, couponController.listCoupons);
router.delete('/:id', isAuthenticated, couponController.deleteCoupon);

module.exports = router;