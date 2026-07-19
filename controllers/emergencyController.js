/**
 * Emergency Controller - Handles HTTP requests for SOS emergency alerts, assistance protocols, and Lost & Found filing
 */

const emergencyService = require('../services/emergencyService');
const { validateString } = require('../utils/security');

class EmergencyController {
  /**
   * POST /api/emergency/sos
   */
  async triggerSos(req, res) {
    const section = validateString(req.body.section, 1, 20) || '104';
    const row = validateString(req.body.row, 1, 20) || '12';
    const seat = validateString(req.body.seat, 1, 20) || '8';

    const dispatch = emergencyService.dispatchSos(section, row, seat);
    res.json({
      success: true,
      message: '🚨 Emergency Paramedic & Security Dispatch Triggered!',
      data: dispatch
    });
  }

  /**
   * POST /api/emergency/assist
   */
  async getEmergencyAssist(req, res) {
    const emergencyType = validateString(req.body.emergencyType, 1, 30) || 'MEDICAL';
    const section = validateString(req.body.section, 1, 20) || '104';

    const protocol = emergencyService.processEmergencyProtocol(emergencyType, section);
    res.json({
      success: true,
      data: protocol
    });
  }

  // Alias for route compatibility
  async getEmergencyAssistance(req, res) {
    return this.getEmergencyAssist(req, res);
  }

  /**
   * POST /api/emergency/lost-found
   */
  async fileLostFound(req, res) {
    const description = validateString(req.body.description, 1, 200);
    const itemType = validateString(req.body.itemType, 1, 50) || 'Personal Belonging';
    const contactInfo = validateString(req.body.contactInfo, 1, 100) || 'Registered Fan';

    if (!description) {
      return res.status(400).json({ success: false, error: 'Item description cannot be empty.' });
    }

    const report = emergencyService.fileLostFoundReport(description, itemType, contactInfo);
    res.json({
      success: true,
      message: 'Lost & Found report filed successfully.',
      data: report
    });
  }
}

module.exports = new EmergencyController();
