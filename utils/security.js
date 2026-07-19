/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Security Utilities
 * Handles input sanitization, XSS prevention, payload validation, and string bounds.
 */

/**
 * Escape HTML special characters to prevent Cross-Site Scripting (XSS)
 * @param {string} str - Raw user input string
 * @returns {string} Sanitized string safe for rendering in HTML/DOM
 */
function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate and clean a string payload
 * @param {any} input - Raw input value
 * @param {number} minLen - Minimum required length
 * @param {number} maxLen - Maximum allowed length
 * @returns {string|null} Cleaned string or null if invalid
 */
function validateString(input, minLen = 1, maxLen = 500) {
  if (typeof input !== 'string') return null;
  const cleaned = sanitizeHtml(input);
  if (cleaned.length < minLen || cleaned.length > maxLen) return null;
  return cleaned;
}

/**
 * Validate enumerated option values
 * @param {string} input - Raw input string
 * @param {string[]} allowedValues - Array of valid enum choices
 * @returns {boolean} True if input is in allowed list
 */
function isValidEnum(input, allowedValues = []) {
  if (typeof input !== 'string') return false;
  return allowedValues.includes(input.trim());
}

/**
 * Async Handler Wrapper for Express routes to catch unhandled promises
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  sanitizeHtml,
  validateString,
  isValidEnum,
  asyncHandler
};
