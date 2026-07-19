/**
 * services/telemetry.js
 * 
 * Provides telemetry operations compiled from the static stadium database.
 */

const stadiumData = require("../stadiumData");

/**
 * Retreives full telemetry status cache.
 * @returns {object} Full database states.
 */
function getTelemetryData() {
  return {
    schedule: stadiumData.MATCH_SCHEDULE,
    parking: stadiumData.PARKING_LOTS,
    foodStalls: stadiumData.FOOD_STALLS,
    alerts: stadiumData.CROWD_ALERTS,
    safety: stadiumData.SAFETY_DIRECTORY
  };
}

module.exports = { getTelemetryData };
