const express = require("express");
const router = express.Router();
const multer = require("multer");
const directChatController = require("../controllers/direct_chat");
const { isAuthenticated, isAccountingFirm, isFirmOwner } = require("../controllers/access_control");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure the uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({ fileUrl });
});


router.post("/CLIENT/List-Conversation", directChatController.getUserConversation);
router.post("/FIRM/List-Conversation", directChatController.getFirmConversation);
router.get("/messages/:conversationId", directChatController.getConversationMessages);
router.post("/conversation", directChatController.createOrGetConversation);


router.post("/send-watermarked-message", isAuthenticated, (req, res, next) => {
  upload.single("chatFile")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, directChatController.sendWatermarkedMessage);

router.get("/conversation/:conversationId", directChatController.getRequestByConversationId);

module.exports = router;
