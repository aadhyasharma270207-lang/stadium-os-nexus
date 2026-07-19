/**
 * Standardized API Response Factory - FIFA World Cup 2026
 * Enforces unified JSON payload structures across all controllers.
 */

class ApiResponse {
  /**
   * Send a successful JSON response
   * @param {Object} res - Express response object
   * @param {any} data - Payload data
   * @param {number} statusCode - HTTP status code (default 200)
   * @param {Object} extraMeta - Additional metadata attributes
   */
  static success(res, data = {}, statusCode = 200, extraMeta = {}) {
    return res.status(statusCode).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        ...extraMeta
      }
    });
  }

  /**
   * Send a standardized error JSON response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default 400)
   */
  static error(res, message = 'Bad Request', statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  }
}

module.exports = ApiResponse;
