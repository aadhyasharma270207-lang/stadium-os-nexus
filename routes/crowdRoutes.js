/**
 * Crowd Routes - Maps crowd density simulation, smart routes, and AI predictive analytics endpoints
 */

const express = require('express');
const router = express.Router();
const crowdController = require('../controllers/crowdController');
const { asyncHandler } = require('../utils/security');

// GET /api/crowd/density
router.get('/density', asyncHandler(crowdController.getDensity.bind(crowdController)));

// POST /api/crowd/reroute
router.post('/reroute', asyncHandler(crowdController.getReroute.bind(crowdController)));

// POST /api/crowd/smart-route
router.post('/smart-route', asyncHandler(crowdController.calculateSmartRoute.bind(crowdController)));

// POST /api/crowd/predict
router.post('/predict', asyncHandler(crowdController.predictCrowd.bind(crowdController)));

module.exports = router;
