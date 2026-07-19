/**
 * Emergency Routes - Maps SOS dispatch, emergency assistance, and Lost & Found endpoints
 */

const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { asyncHandler } = require('../utils/security');
const { emergencyRateLimiter } = require('../middleware/rateLimiter');

// POST /api/emergency/sos
router.post('/sos', emergencyRateLimiter, asyncHandler(emergencyController.triggerSos.bind(emergencyController)));

// POST /api/emergency/assist
router.post('/assist', asyncHandler(emergencyController.getEmergencyAssistance.bind(emergencyController)));

// POST /api/emergency/lost-found
router.post('/lost-found', asyncHandler(emergencyController.fileLostFound.bind(emergencyController)));

module.exports = router;
