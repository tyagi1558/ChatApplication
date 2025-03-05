const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/send-message", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, getChatHistory);
module.exports = router;