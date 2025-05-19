const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    budget: Number,
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, 
    description: String,
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    rejectionMessage: { type: String, default: null }, // Optional rejection message
    deadline: { type: Date, default: null } // Optional deadline for completion
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);