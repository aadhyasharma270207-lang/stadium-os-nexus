/**
 * services/chat.js
 * 
 * Manages chatbot resolutions by linking to the Gemini SDK model or falling back
 * to the offline regex-based parser.
 */

const stadiumData = require("../stadiumData");
const { geminiModel } = require("../config/gemini");

/**
 * Handles chat prompt and routes to AI or offline NLP simulator.
 * @param {string} message - User text query.
 * @returns {Promise<object>} Resolved chat reply and provider tag.
 */
async function handleChat(message) {
  // Always compute offline reply as standard fallback
  const offlineReply = stadiumData.resolveLocalChat(message);

  if (geminiModel) {
    try {
      const prompt = `You are a polite FIFA World Cup 2026 Smart Stadium Assistant for MetLife Stadium. Use these stadium guidelines, schedules, food concessions, safety directories, and lost & found context to answer the user's questions:

STADIUM DATA / SCHEDULING / AMENITIES:
${JSON.stringify(stadiumData.SAFETY_DIRECTORY)}

DIRECTIONS RULES:
- Section 102 stand is located at (cx=270, cy=160). Entry via Gate B (Path: M 360 200 Q 320 180 270 160).
- Alternate route entry via Gate C (Path: M 200 360 Q 280 320 270 160).
- Gate D is the accessibility entrance.

If the user's prompt is completely unrelated to stadium navigation, food options, parking, emergency help, accessibility, or World Cup schedules, respond politely stating you can only assist with MetLife Stadium matches and events.

User question: "${message}"`;

      const result = await geminiModel.generateContent(prompt);
      return { reply: result.response.text().trim(), source: "gemini-ai" };
    } catch (err) {
      console.warn("⚠️ Gemini AI error, fallback to offline resolver:", err.message);
    }
  }

  return { reply: offlineReply, source: "offline-nlp" };
}

module.exports = { handleChat };
