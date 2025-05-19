const AccountingFirm = require("../models/accounting_firm");
const Rating = require("../models/rating");
const Request = require("../models/request");
const mongoose = require("mongoose");

exports.submitRating = async (req, res) => {
  try {
    const { firmId } = req.params;
    const userId = req.session.user._id;
    const { serviceQuality, communication, timeliness, valueForMoney, comment } = req.body;

    // Validate if user has completed a service with this firm
    const hasCompletedService = await Request.findOne({
      sender: userId,
      receiver: firmId,
      status: "accepted"
    });
// Check if user has already rated
const existingRating = await Rating.findOne({ firm: firmId, user: userId });
if (existingRating) {
  return res.status(403).json({
    message: "You have already rated this firm"
  });
}
    if (!hasCompletedService) {
      return res.status(403).json({
        message: "You can only rate firms after completing a service with them"
      });
    }

    // Create or update rating
    const ratingData = {
      firm: firmId,
      user: userId,
      serviceQuality,
      communication,
      timeliness,
      valueForMoney,
      comment
    };

    await Rating.findOneAndUpdate(
      { firm: firmId, user: userId },
      ratingData,
      { upsert: true, new: true }
    );

    // Calculate new average ratings
    const aggregatedRatings = await Rating.aggregate([
      { $match: { firm: new mongoose.Types.ObjectId(firmId) } },
      {
        $group: {
          _id: null,
          serviceQuality: { $avg: "$serviceQuality" },
          communication: { $avg: "$communication" },
          timeliness: { $avg: "$timeliness" },
          valueForMoney: { $avg: "$valueForMoney" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (aggregatedRatings.length > 0) {
      const avg = aggregatedRatings[0];
      const overall = (avg.serviceQuality + avg.communication + avg.timeliness + avg.valueForMoney) / 4;
      
      await AccountingFirm.findByIdAndUpdate(firmId, {
        rating: overall
      });

      return res.status(201).json({
        message: "Rating submitted successfully",
        rating: overall
      });
    }

    res.status(201).json({
      message: "Rating submitted successfully"
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({
      message: "Failed to submit rating",
      error: error.message
    });
  }
};

exports.getFirmRatings = async (req, res) => {
  try {
    const { firmId } = req.params;

    const [ratings, aggregatedRatings] = await Promise.all([
      Rating.find({ firm: firmId })
        .populate('user', 'name email')
        .sort('-createdAt'),
      Rating.aggregate([
        { $match: { firm: new mongoose.Types.ObjectId(firmId) } },
        {
          $group: {
            _id: null,
            serviceQuality: { $avg: "$serviceQuality" },
            communication: { $avg: "$communication" },
            timeliness: { $avg: "$timeliness" },
            valueForMoney: { $avg: "$valueForMoney" },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const averageRatings = aggregatedRatings.length > 0 ? {
      overall: (
        aggregatedRatings[0].serviceQuality +
        aggregatedRatings[0].communication +
        aggregatedRatings[0].timeliness +
        aggregatedRatings[0].valueForMoney
      ) / 4,
      ...aggregatedRatings[0]
    } : null;

    res.status(200).json({
      ratings,
      averageRatings,
      totalRatings: ratings.length
    });

  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({
      message: "Failed to fetch ratings",
      error: error.message
    });
  }
};


exports.getRequestDetails = async (req, res) => {
  try {
    const { requestId } = req.params;


    const request = await Request.findById(requestId)
      .populate('sender', 'name email')
      .populate('receiver', 'name email ')
      .populate('service', 'name')
      .lean();

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }


    const responseData = {
      firmName: request.receiver,
      serviceName: request.service.name,
      issueDate: request.createdAt,
      budget: request.budget,
      
    };
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Get request details error:', error);
    res.status(500).json({
      message: "Failed to fetch request details",
      error: error.message
    });
  }
};