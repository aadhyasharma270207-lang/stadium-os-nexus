/**
 * controllers/translate.js
 * 
 * Exposes route processors for announcement translations.
 */

const { sanitizeString } = require("../utils/sanitizer");
const translateService = require("../services/translate");

/**
 * Validates and processes text translations.
 */
async function processTranslation(req, res, next) {
  try {
    const { text, targetLang } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Text string to translate is required." });
    }
    if (!targetLang || !["es", "fr", "ar", "en"].includes(targetLang)) {
      return res.status(400).json({ success: false, error: "Valid target language code is required (es, fr, ar, en)." });
    }

    const cleanText = sanitizeString(text);
    const result = await translateService.handleTranslation(cleanText, targetLang);

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { processTranslation };
