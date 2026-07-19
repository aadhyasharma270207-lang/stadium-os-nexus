/**
 * Itinerary Controller - Handles HTTP requests for AI Matchday Itinerary Generation
 */

const itineraryService = require('../services/itineraryService');
const { validateString } = require('../utils/security');

class ItineraryController {
  /**
   * POST /api/itinerary/generate
   */
  async generateItinerary(req, res) {
    const section = validateString(req.body.section, 1, 20) || '104';
    const kickoffTime = validateString(req.body.kickoffTime, 1, 20) || '18:00';
    const partyType = validateString(req.body.partyType, 1, 30) || 'FAMILY';
    const parkingPreference = validateString(req.body.parkingPreference, 1, 30) || 'LOT_C';

    const result = itineraryService.generateItinerary({
      section,
      kickoffTime,
      partyType,
      parkingPreference
    });

    res.json({
      success: true,
      data: result
    });
  }
}

module.exports = new ItineraryController();
