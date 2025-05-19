const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firm: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firmID: { type: mongoose.Schema.Types.ObjectId, ref: "AccountingFirm" },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  lastMessage: { type: String, default: "" },
  unreadCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
