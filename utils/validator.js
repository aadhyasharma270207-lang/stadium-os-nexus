/**
 * utils/validator.js
 * 
 * Secure validators checking type alignments and message lengths.
 */

/**
 * Validates chatbot input variables.
 * @param {string} msg - The chat query message.
 * @returns {object} Validation result { valid, error }.
 */
function validateMessage(msg) {
  if (!msg || typeof msg !== "string" || msg.trim().length === 0) {
    return { valid: false, error: "Query message cannot be empty or invalid type." };
  }
  if (msg.length > 1000) {
    return { valid: false, error: "Query message exceeds safe length threshold (1000 chars)." };
  }
  return { valid: true };
}

module.exports = { validateMessage };
