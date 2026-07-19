/**
 * Weather Controller - Handles HTTP requests for weather telemetry and AI weather intelligence
 */

const weatherService = require('../services/weatherService');
const { validateString } = require('../utils/security');

class WeatherController {
  /**
   * GET /api/weather/current
   */
  async getCurrentWeather(req, res) {
    const data = weatherService.getCurrentWeather();
    res.json({
      success: true,
      data
    });
  }

  /**
   * POST /api/weather/intelligence
   */
  async getWeatherIntelligence(req, res) {
    const condition = validateString(req.body.condition || req.body.weather, 1, 50) || 'sunny';
    const section = validateString(req.body.section, 1, 20) || '104';

    const result = weatherService.getWeatherIntelligence({ condition, section });

    res.json({
      success: true,
      data: result
    });
  }
}

module.exports = new WeatherController();
