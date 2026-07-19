/**
 * controllers/chat.js
 * 
 * Exposes route processors for the AI Support Chatbot.
 */

const { validateMessage } = require("../utils/validator");
const { sanitizeString } = require("../utils/sanitizer");
const chatService = require("../services/chat");

/**
 * Validates, sanitizes, and processes chat prompts.
 */
async function processChat(req, res, next) {
  try {
    const { message } = req.body;
    const validation = validateMessage(message);

    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const sanitized = sanitizeString(message);
    const result = await chatService.handleChat(sanitized);

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { processChat };
