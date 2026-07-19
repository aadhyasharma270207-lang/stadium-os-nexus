/**
 * Stadium Controller - Handles HTTP requests for stadium venue metadata, match tickers, and AI accessibility plans
 */

const stadiumService = require('../services/stadiumService');
const { validateString } = require('../utils/security');

class StadiumController {
  /**
   * GET /api/stadiums
   */
  async getStadiums(req, res) {
    const list = stadiumService.getStadiums();
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  }

  /**
   * GET /api/stadiums/:id
   */
  async getStadiumById(req, res) {
    const id = validateString(req.params.id, 1, 50);
    const stadium = stadiumService.getStadiumById(id);
    if (!stadium) {
      return res.status(404).json({ success: false, error: 'Stadium venue not found.' });
    }
    res.json({
      success: true,
      data: stadium
    });
  }

  /**
   * GET /api/match-ticker
   */
  async getMatchTicker(req, res) {
    const ticker = stadiumService.getMatchTicker();
    res.json({
      success: true,
      data: ticker
    });
  }

  /**
   * POST /api/stadiums/accessibility-plan
   */
  async getAccessibilityPlan(req, res) {
    const profileType = validateString(req.body.profileType, 1, 30) || 'WHEELCHAIR';
    const section = validateString(req.body.section, 1, 20) || '104';

    const plan = stadiumService.generateAccessibilityPlan(profileType, section);

    res.json({
      success: true,
      data: plan
    });
  }
}

module.exports = new StadiumController();
