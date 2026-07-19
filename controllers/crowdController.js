/**
 * Crowd Controller - Handles HTTP requests for real-time crowd density, smart route calculation, and AI crowd prediction
 */

const crowdService = require('../services/crowdService');
const { validateString } = require('../utils/security');

class CrowdController {
  /**
   * GET /api/crowd/density
   */
  async getDensity(req, res) {
    const data = crowdService.getCrowdDensity();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  /**
   * POST /api/crowd/reroute
   */
  async getReroute(req, res) {
    const currentSection = validateString(req.body.currentSection, 1, 50) || '104';
    const targetDestination = validateString(req.body.targetDestination, 1, 50) || 'Main Gate Exit';

    const routePlan = crowdService.calculateSmartRoute({
      gate: 'Gate B',
      section: currentSection
    });

    const reroutePlan = {
      primaryRoute: {
        path: `Gate B East -> Concourse 100 -> Section ${currentSection}`,
        estTime: '18 mins',
        warning: 'High Gate B turnstile queue delay (35 mins)'
      },
      recommendedAlternativeRoute: {
        path: `Gate D West -> Concourse 200 -> Section ${currentSection}`,
        estTime: '5 mins',
        timeSaved: 'Save 13 minutes!',
        crowdDensity: 'LOW (Clear Path)'
      },
      stepByStepDirections: routePlan.routeSteps
    };

    res.json({
      success: true,
      reroutePlan
    });
  }

  /**
   * POST /api/crowd/smart-route
   */
  async calculateSmartRoute(req, res) {
    const gate = validateString(req.body.gate, 1, 50) || 'Gate A';
    const section = validateString(req.body.section, 1, 20) || '104';
    const row = validateString(req.body.row, 1, 20) || '12';
    const seat = validateString(req.body.seat, 1, 20) || '8';
    const weather = validateString(req.body.weather, 1, 30) || 'sunny';
    const accessibility = Boolean(req.body.accessibility);
    const isElderly = Boolean(req.body.isElderly);
    const hasChildren = Boolean(req.body.hasChildren);
    const distancePreference = validateString(req.body.distancePreference, 1, 30) || 'SHORTEST';

    const routePlan = crowdService.calculateSmartRoute({
      gate,
      section,
      row,
      seat,
      weather,
      accessibility,
      isElderly,
      hasChildren,
      distancePreference
    });

    res.json({
      success: true,
      data: routePlan
    });
  }

  /**
   * POST /api/crowd/predict
   */
  async predictCrowd(req, res) {
    const matchTime = validateString(req.body.matchTime, 1, 30) || 'T-60';
    const gateId = validateString(req.body.gateId, 1, 50) || 'Gate A';
    const parkingOccupancy = parseInt(req.body.parkingOccupancy, 10) || 85;

    const prediction = crowdService.predictCrowdConditions({
      matchTime,
      gateId,
      parkingOccupancy
    });

    res.json({
      success: true,
      data: prediction
    });
  }
}

module.exports = new CrowdController();
