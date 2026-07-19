/**
 * Service Controller - Handles HTTP requests for stadium concessions, orders, and AI food recommendations
 */

const stadiumServicesData = require('../services/stadiumServicesData');
const { validateString } = require('../utils/security');

class ServiceController {
  /**
   * GET /api/services
   */
  async getAllServices(req, res) {
    const data = stadiumServicesData.getAllServices();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data
    });
  }

  /**
   * POST /api/services/recommend-food
   */
  async recommendFood(req, res) {
    const section = validateString(req.body.section, 1, 20) || '104';
    const maxBudget = parseFloat(req.body.maxBudget) || 20.00;
    const isVegetarian = Boolean(req.body.isVegetarian);
    const isVegan = Boolean(req.body.isVegan);
    const isGlutenFree = Boolean(req.body.isGlutenFree);
    const isNutFree = Boolean(req.body.isNutFree);
    const isKids = Boolean(req.body.isKids);
    const maxWaitMins = parseInt(req.body.maxWaitMins, 10) || 10;
    const crowdLevel = validateString(req.body.crowdLevel, 1, 20) || 'ANY';

    const result = stadiumServicesData.getPersonalizedFoodRecommendations({
      section,
      maxBudget,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isNutFree,
      isKids,
      maxWaitMins,
      crowdLevel
    });

    res.json({
      success: true,
      data: result
    });
  }

  /**
   * POST /api/services/order
   */
  async placeOrder(req, res) {
    const cart = req.body.cart;
    const seatInfo = validateString(req.body.seatInfo, 1, 100) || 'Section 104, Row 12, Seat 8';
    const paymentMethod = validateString(req.body.paymentMethod, 1, 50) || 'FIFA Card / Apple Pay';

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart cannot be empty.' });
    }

    const receipt = stadiumServicesData.processOrder(cart, seatInfo, paymentMethod);
    res.json({
      success: true,
      message: 'In-seat express order placed successfully!',
      receipt
    });
  }
}

module.exports = new ServiceController();
