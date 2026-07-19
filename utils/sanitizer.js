/**
 * utils/sanitizer.js
 * 
 * Secure text utilities to cleanse raw user strings and prevent XSS scripts.
 */

/**
 * Escapes HTML characters in a string to prevent tag execution.
 * @param {string} str - Unsafe user string.
 * @returns {string} Clean sanitized string.
 */
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { sanitizeString };
