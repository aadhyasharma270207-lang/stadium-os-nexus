/**
 * routes/chat.js
 * 
 * Routing mapping for the AI Support Chatbot.
 */

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");

router.post("/", chatController.processChat);

module.exports = router;
