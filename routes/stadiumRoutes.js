/**
 * Stadium Routes - Maps venue metadata, match ticker, and AI accessibility plan endpoints
 */

const express = require('express');
const router = express.Router();
const stadiumController = require('../controllers/stadiumController');
const { asyncHandler } = require('../utils/security');

// GET /api/stadiums
router.get('/', asyncHandler(stadiumController.getStadiums.bind(stadiumController)));

// GET /api/stadiums/:id
router.get('/:id', asyncHandler(stadiumController.getStadiumById.bind(stadiumController)));

// POST /api/stadiums/accessibility-plan
router.post('/accessibility-plan', asyncHandler(stadiumController.getAccessibilityPlan.bind(stadiumController)));

module.exports = router;
