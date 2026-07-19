/**
 * Service Routes - Maps food concessions, merch, in-seat orders, and AI food recommendation endpoints
 */

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { asyncHandler } = require('../utils/security');

// GET /api/services
router.get('/', asyncHandler(serviceController.getAllServices.bind(serviceController)));

// POST /api/services/recommend-food
router.post('/recommend-food', asyncHandler(serviceController.recommendFood.bind(serviceController)));

// POST /api/services/order
router.post('/order', asyncHandler(serviceController.placeOrder.bind(serviceController)));

module.exports = router;
