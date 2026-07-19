/**
 * Itinerary Routes - Express Router for AI Matchday Itinerary Planner
 */

const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

router.post('/generate', (req, res) => itineraryController.generateItinerary(req, res));

module.exports = router;
