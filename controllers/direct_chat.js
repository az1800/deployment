const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");
const AccountingFirm = require("../models/accounting_firm");
const Service = require("../models/service");
const Request = require("../models/request");
const path = require('path');


// Get conversations for client
exports.getUserConversation = async (req, res) => {
  try{
    const userID = req.session.user._id
    if(!userID){
        return res.status(400).json({ message: "there is a problome with the session." });
    }

    const conversations = await Conversation.find({client:userID})
    .populate({
      path: "firm",
      select: "name userType accountingFirm",
      populate: {
        path: "accountingFirm",
        select: "image"
      }
    });

    console.log(conversations)

    return res.status(200).json({ message: "the conversations can been accessed with data", data:conversations });

}catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred. Please try again." });
}
};

// Get conversations for firm
exports.getFirmConversation = async (req, res) => {
  try{
  const userID = req.session.user._id
  if(!userID){
      return res.status(400).json({ message: "there is a problome with the session." });
  }

  const conversations = await Conversation.find({firm:userID})
  .populate("client", "name userType image")

  console.log(conversations)

  return res.status(200).json({ message: "the conversations can been accessed with data", data:conversations });

}catch (err) {
  console.error(err);
  return res.status(500).json({ message: "An error occurred. Please try again." });
}
};

// Get all messages in a conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching messages" });
  }
};

// Create or get existing conversation
exports.createOrGetConversation = async (req, res) => {
  const { clientId, firmId, requestId } = req.body;
  try {
    let conversation = await Conversation.findOne({ client: clientId, firm: firmId, request: requestId });

    if (!conversation) {
      conversation = await Conversation.create({
        client: clientId,
        firm: firmId,
        firmID: firmId,
        request: requestId
      });
    }

    return res.status(200).json({ conversation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not create/get conversation" });
  }
};










exports.sendWatermarkedMessage = async (req, res) => {console.log("i am here");
  try {
    const { conversationID } = req.body;
    const senderID = req.session.user._id;
    const userType = req.session.user.userType;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const originalPath = path.join(__dirname, '..', req.file.path);
    const outputPath = path.join(__dirname, '..', 'uploads', 'watermarked-' + req.file.filename);


    const { addTextWatermark } = require('../utils/pdfWatermark'); // import the watermark function
    await addTextWatermark(originalPath, outputPath, 'AccountLink Confidential');

    const message = new Message({
      conversation: conversationID,
      sender: senderID,
      userType,
      text: null,
      file: `/uploads/watermarked-${req.file.filename}`
    });

    await message.save();

    await Conversation.findByIdAndUpdate(conversationID, {
      lastMessage: 'Sent a watermarked file'
    });

    return res.status(200).json({ message: "Watermarked message sent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred while sending the watermarked message." });
  }
};


exports.getRequestByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log("Fetching conversation:", conversationId);

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'request',
        populate: [
          { path: 'sender', select: 'name email' },
          { path: 'receiver', select: 'name email' },
          { path: 'service', select: 'name description price' }
        ]
      });

    if (!conversation) {
      console.log("Conversation not found");
      return res.status(404).json({ message: "Conversation not found." });
    }

    if (!conversation.request) {
      console.log("Request not found in conversation");
      return res.status(404).json({ message: "Request not found for this conversation." });
    }

    console.log("Found request:", conversation.request);
    return res.status(200).json(conversation.request);
  } catch (err) {
    console.error("Error fetching request by conversationId:", err);
    return res.status(500).json({ message: "An error occurred while fetching the request." });
  }
};