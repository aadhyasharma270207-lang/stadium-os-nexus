const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { sanitizeHtml, validateString, isValidEnum, asyncHandler } = require('../utils/security');

const stadiumsDataPath = path.join(__dirname, '../data/stadiums.json');

function getStadiums() {
  try {
    const raw = fs.readFileSync(stadiumsDataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// GET /api/stadiums
router.get('/stadiums', asyncHandler(async (req, res) => {
  const stadiums = getStadiums();
  res.json({ success: true, count: stadiums.length, data: stadiums });
}));

// GET /api/stadiums/:id
router.get('/stadiums/:id', asyncHandler(async (req, res) => {
  const stadiumId = validateString(req.params.id, 1, 50);
  if (!stadiumId) {
    return res.status(400).json({ success: false, error: 'Invalid stadium ID format' });
  }

  const stadiums = getStadiums();
  const stadium = stadiums.find(s => s.id === stadiumId);
  if (!stadium) {
    return res.status(404).json({ success: false, error: 'Stadium not found' });
  }
  res.json({ success: true, data: stadium });
}));

// GET /api/crowd/density
router.get('/crowd/density', asyncHandler(async (req, res) => {
  const timeOffset = Math.sin(Date.now() / 10000);
  const gateCVal = Math.min(95, Math.max(70, Math.round(85 + timeOffset * 10)));
  const gateAVal = Math.min(45, Math.max(15, Math.round(25 + timeOffset * 8)));

  const zones = [
    {
      id: "gate-a",
      name: "Gate A (MetLife North Plaza)",
      density: gateAVal,
      status: gateAVal > 75 ? "Critical" : gateAVal > 50 ? "Moderate" : "Low",
      waitTime: `${Math.round(gateAVal / 8)} mins`,
      baseWalkTime: "3 mins",
      adjustedWalkTime: `${Math.round(3 * (1 + gateAVal / 100))} mins`,
      recommended: true
    },
    {
      id: "gate-b",
      name: "Gate B (Verizon East Gate)",
      density: 55,
      status: "Moderate",
      waitTime: "12 mins",
      baseWalkTime: "5 mins",
      adjustedWalkTime: "8 mins",
      recommended: false
    },
    {
      id: "gate-c",
      name: "Gate C (Pepsi South Bottleneck)",
      density: gateCVal,
      status: gateCVal > 80 ? "Critical" : "High",
      waitTime: `${Math.round(gateCVal / 4)} mins`,
      baseWalkTime: "4 mins",
      adjustedWalkTime: `${Math.round(4 * (1 + gateCVal / 50))} mins`,
      recommended: false
    },
    {
      id: "gate-d",
      name: "Gate D (Bud Light West Fast-Track)",
      density: 20,
      status: "Low",
      waitTime: "3 mins",
      baseWalkTime: "4 mins",
      adjustedWalkTime: "4 mins",
      recommended: true
    },
    {
      id: "concourse-100",
      name: "Concourse 100 Level",
      density: 68,
      status: "Moderate",
      waitTime: "6 mins",
      baseWalkTime: "5 mins",
      adjustedWalkTime: "8 mins",
      recommended: false
    }
  ];

  const aiRecommendations = [
    `🚨 **Bottleneck Alert**: Gate C South Plaza is experiencing **${gateCVal}% Critical Congestion** (${Math.round(gateCVal / 4)}-min wait).`,
    `💡 **AI Reroute**: Proceed via **Concourse 200 to Gate D West** for **68% faster exit** (Save 14 mins).`,
    `♿ **ADA Exit**: Elevator Bank 3 (Gate A) has zero line queue for step-free access.`
  ];

  const nearestExits = [
    { name: "Emergency Exit Portal 108 (Gate A)", distance: "120m", crowdLevel: "Low (18%)", estTime: "2 mins" },
    { name: "West Exit Ramp (Gate D)", distance: "210m", crowdLevel: "Low (20%)", estTime: "4 mins" },
    { name: "North Plaza Stairs (Gate B)", distance: "340m", crowdLevel: "Moderate (55%)", estTime: "8 mins" }
  ];

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    stadium: "MetLife Stadium (NY/NJ)",
    zones,
    aiRecommendations,
    nearestExits
  });
}));

// POST /api/crowd/reroute
router.post('/crowd/reroute', asyncHandler(async (req, res) => {
  const currentSection = validateString(req.body.currentSection, 1, 50) || "104";
  const targetDestination = validateString(req.body.targetDestination, 1, 100) || "Main Gate Exit";

  const reroutePlan = {
    origin: `Section ${currentSection}`,
    destination: targetDestination,
    primaryRoute: {
      path: `Portal ${currentSection} ➔ Concourse 100 ➔ Gate C South Plaza`,
      status: "Congested",
      crowdDensity: "88% Heavy Traffic",
      estTime: "18 mins",
      warning: "Heavy Bottleneck detected at Gate C main corridor"
    },
    recommendedAlternativeRoute: {
      path: `Portal ${currentSection} ➔ Escalator 2 ➔ Concourse 200 ➔ Gate D West Fast-Track`,
      status: "Clear Flow",
      crowdDensity: "22% Low Traffic",
      estTime: "5 mins",
      timeSaved: "13 minutes faster"
    },
    stepByStepDirections: [
      `1. Exit Portal ${currentSection} and turn LEFT towards Escalator Bank 2.`,
      "2. Ascend to Concourse Level 200 (Bypasses Lower Level Bottleneck).",
      "3. Follow the GREEN illuminated overhead LED arrows towards Gate D.",
      "4. Exit smoothly through Gate D West Fast-Track turnstiles."
    ]
  };

  res.json({ success: true, reroutePlan });
}));

// POST /api/emergency/sos
router.post('/emergency/sos', asyncHandler(async (req, res) => {
  const type = validateString(req.body.type, 2, 100) || 'General Safety';
  const location = validateString(req.body.location, 2, 150) || 'Unknown Section';
  const userContact = validateString(req.body.userContact, 2, 100) || 'Anonymous Fan';
  const notes = validateString(req.body.notes, 0, 300) || 'No additional notes';

  const sosTicket = {
    ticketId: 'SOS-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    type,
    location,
    userContact,
    notes,
    status: 'DISPATCHED',
    etaMinutes: 2
  };

  console.log('🚨 EMERGENCY SOS TRIGGERED:', sosTicket);
  res.status(201).json({
    success: true,
    message: 'Emergency responders dispatched to your location!',
    ticket: sosTicket
  });
}));

// POST /api/emergency/lost-found
router.post('/emergency/lost-found', asyncHandler(async (req, res) => {
  const type = validateString(req.body.type, 2, 100) || 'Lost Item';
  const description = validateString(req.body.description, 2, 300);
  const location = validateString(req.body.location, 2, 150) || 'Section 104';
  const contact = validateString(req.body.contact, 2, 100) || 'Matchday Fan';

  if (!description) {
    return res.status(400).json({ success: false, error: 'Please provide a detailed description (min 2 characters)' });
  }

  const report = {
    ticketId: 'LF-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    type,
    description,
    location,
    contact,
    status: 'ACTIVE_SEARCH',
    matchingCenter: 'Gate A Lost & Found Command Hub'
  };

  console.log('🔍 LOST & FOUND REPORT SUBMITTED:', report);
  res.status(201).json({
    success: true,
    message: 'Lost & Found report filed successfully! Stadium staff have been notified.',
    report
  });
}));

// GET /api/emergency/instructions
router.get('/emergency/instructions', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    protocols: [
      {
        category: "🩺 Medical Assistance & First Aid",
        steps: [
          "1. Press the Red SOS Button or call Ext 911-MED.",
          "2. Do not move an injured person unless immediate danger is present.",
          "3. AED Defibrillators are located at Sections 104, 118, 214, 322 next to First Aid stations.",
          "4. Paramedic units will arrive within 2 minutes of SOS trigger."
        ]
      },
      {
        category: "🛡️ Security Help & Disturbance",
        steps: [
          "1. Report security incidents via the SOS button under 'Security Incident'.",
          "2. Contact Stadium stewards stationed at the top of every portal aisle.",
          "3. Maintain distance from active disturbances.",
          "4. FIFA Security Hub Direct Extension: Ext 911-SEC."
        ]
      },
      {
        category: "🏃 Emergency Exits & Evacuation",
        steps: [
          "1. Remain calm and listen to public address announcements.",
          "2. Follow illuminated GREEN exit signs above Gates A, B, C, D.",
          "3. Do NOT use elevators during fire evacuation; use stairwells and ramps.",
          "4. Proceed to Assembly Point North Plaza outside Gate A."
        ]
      },
      {
        category: "👶 Lost Child & Person Assistance",
        steps: [
          "1. File a Lost Child Alert immediately in the Lost & Found section below.",
          "2. Stadium public address system and security beacons will broadcast matching description.",
          "3. Lost children are safely escorted to the FIFA Guest Services Lounge at Gate A."
        ]
      }
    ]
  });
}));

// GET /api/match-ticker
router.get('/match-ticker', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    currentMatch: {
      title: "FIFA World Cup 2026 - Match 54",
      homeTeam: { name: "USA", flag: "🇺🇸", score: 2 },
      awayTeam: { name: "Mexico", flag: "🇲🇽", score: 1 },
      minute: "78'",
      venue: "MetLife Stadium, NY/NJ",
      status: "LIVE"
    },
    upcomingMatches: [
      { teams: "BRA 🇧🇷 vs ESP 🇪🇸", time: "Tomorrow 20:00 EST", venue: "SoFi Stadium, LA" },
      { teams: "ARG 🇦🇷 vs GER 🇩🇪", time: "Jul 22 18:00 CST", venue: "Estadio Azteca, CDMX" }
    ]
  });
}));

module.exports = router;
