/**
 * Central Router Index - FIFA World Cup 2026 Smart Stadium Assistant
 * Combines all modular routes under the /api namespace.
 */

const express = require('express');
const router = express.Router();

const stadiumRoutes = require('./stadiumRoutes');
const chatRoutes = require('./chatRoutes');
const serviceRoutes = require('./serviceRoutes');
const crowdRoutes = require('./crowdRoutes');
const emergencyRoutes = require('./emergencyRoutes');
const stadiumController = require('../controllers/stadiumController');
const { asyncHandler } = require('../utils/security');

// Mount sub-routers
router.use('/stadiums', stadiumRoutes);
router.use('/chat', chatRoutes);
router.use('/services', serviceRoutes);
router.use('/crowd', crowdRoutes);
router.use('/emergency', emergencyRoutes);

// Direct Ticker endpoint
router.get('/match-ticker', asyncHandler(stadiumController.getMatchTicker.bind(stadiumController)));

module.exports = router;
