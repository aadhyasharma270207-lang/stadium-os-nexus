/**
 * Rate Limiting Middleware - FIFA World Cup 2026 Smart Stadium Assistant
 * In-memory sliding window rate limiter to protect sensitive API endpoints from abuse/DDoS.
 */

const requestCounts = new Map();

/**
 * Rate Limiter Factory
 * @param {number} windowMs - Time window in milliseconds (e.g. 60000ms = 1 min)
 * @param {number} maxRequests - Maximum allowed requests per IP in window
 * @returns {Function} Express middleware function
 */
function createRateLimiter(windowMs = 60000, maxRequests = 30) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter(time => now - time < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again in a minute.',
        retryAfterSeconds: Math.ceil(windowMs / 1000)
      });
    }

    next();
  };
}

module.exports = {
  chatRateLimiter: createRateLimiter(60000, 30),    // 30 chat queries per minute
  emergencyRateLimiter: createRateLimiter(60000, 10), // 10 emergency SOS calls per minute
  createRateLimiter
};
