/**
 * config/gemini.js
 * 
 * Configures the Google Generative AI SDK client using environment variables.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
let geminiModel = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    geminiModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  } catch (err) {
    console.error("⚠️ Failed to configure Google GenAI SDK:", err.message);
  }
}

module.exports = { geminiModel };
