/**
 * Weather Routes - Express Router for Weather Telemetry & AI Intelligence
 */

const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/current', (req, res) => weatherController.getCurrentWeather(req, res));
router.post('/intelligence', (req, res) => weatherController.getWeatherIntelligence(req, res));

module.exports = router;
