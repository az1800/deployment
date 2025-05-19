const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userType: { type: String, enum: ["client", "firm"], required: true },
  text: { type: String, default: "" },
  file: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
