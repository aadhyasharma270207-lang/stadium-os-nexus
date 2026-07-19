/**
 * Chat Controller - Handles HTTP requests for Goalie AI chatbot with Fan Profile Memory
 */

const chatService = require('../services/chatService');
const { validateString } = require('../utils/security');

class ChatController {
  /**
   * POST /api/chat/query
   */
  async handleQuery(req, res) {
    const rawMsg = req.body.message;
    const rawStadiumId = req.body.stadiumId;
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    const userProfile = (typeof req.body.userProfile === 'object' && req.body.userProfile !== null) ? req.body.userProfile : {};

    const message = validateString(rawMsg, 1, 500);
    if (!message) {
      return res.status(400).json({ success: false, error: 'Please enter a valid message (1-500 characters).' });
    }

    const stadiumId = validateString(rawStadiumId, 1, 50) || 'metlife';
    const result = await chatService.processQuery(message, history, stadiumId, userProfile);

    res.json({ success: true, ...result });
  }
}

module.exports = new ChatController();
