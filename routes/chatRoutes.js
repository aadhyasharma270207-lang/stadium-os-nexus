/**
 * Chat Routes - Router configuration for Goalie AI chatbot endpoints
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { asyncHandler } = require('../utils/security');
const { chatRateLimiter } = require('../middleware/rateLimiter');

// POST /api/chat/query
router.post('/query', chatRateLimiter, asyncHandler(chatController.handleQuery.bind(chatController)));

module.exports = router;
