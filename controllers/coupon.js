const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, requestId } = req.body;

    const coupon = await Coupon.findOne({ 
      code,
      isActive: true,
      validUntil: { $gt: new Date() },
      validFrom: { $lt: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Invalid or expired coupon' 
      });
    }

    // Check usage limits
    if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({
        valid: false,
        message: 'Coupon usage limit reached'
      });
    }

    // Increment usage counter
    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { currentUses: 1 }
    });

    res.json({
      valid: true,
      discountPercentage: coupon.discountPercentage
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ 
      valid: false, 
      message: 'Error validating coupon' 
    });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create coupon' });
  }
};

exports.listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete coupon' });
  } 
};