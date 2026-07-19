/**
 * controllers/telemetry.js
 * 
 * Exposes route processors for stadium sensors data.
 */

const telemetryService = require("../services/telemetry");

/**
 * Serves stadium static and dynamic database metrics.
 */
function getTelemetry(req, res, next) {
  try {
    const data = telemetryService.getTelemetryData();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTelemetry };
