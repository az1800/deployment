const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  firm: { type: mongoose.Schema.Types.ObjectId, ref: "AccountingFirm", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceQuality: { type: Number, required: true, min: 1, max: 5 },
  communication: { type: Number, required: true, min: 1, max: 5 },
  timeliness: { type: Number, required: true, min: 1, max: 5 },
  valueForMoney: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxLength: 500 }
}, { timestamps: true });

// Compound index to ensure one rating per user per firm
RatingSchema.index({ firm: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);