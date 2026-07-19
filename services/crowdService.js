/**
 * Crowd Service - FIFA World Cup 2026
 * Real-time crowd density simulation, AI alternative path rerouting,
 * Context-Aware Smart Navigation Engine (8 factors), and AI Crowd Prediction Engine (4 factors).
 */

const { defaultCache } = require('../utils/cache');

class CrowdService {
  constructor() {
    this.zones = [
      { id: 'zone-gate-a', name: 'Gate A (North Plaza)', density: 25, status: 'LOW', waitTime: '4 mins', baseWalkTime: '3 mins', adjustedWalkTime: '4 mins' },
      { id: 'zone-gate-b', name: 'Gate B (East Plaza)', density: 85, status: 'CRITICAL', waitTime: '35 mins', baseWalkTime: '4 mins', adjustedWalkTime: '18 mins' },
      { id: 'zone-gate-c', name: 'Gate C (South Plaza)', density: 30, status: 'LOW', waitTime: '4 mins', baseWalkTime: '3 mins', adjustedWalkTime: '4 mins' },
      { id: 'zone-gate-d', name: 'Gate D (West Plaza)', density: 20, status: 'LOW', waitTime: '2 mins', baseWalkTime: '2 mins', adjustedWalkTime: '3 mins' },
      { id: 'zone-concourse-100', name: 'Concourse 100 Lower Level', density: 45, status: 'MODERATE', waitTime: '3 mins', baseWalkTime: '3 mins', adjustedWalkTime: '5 mins' },
      { id: 'zone-concourse-200', name: 'Concourse 200 Club Level', density: 30, status: 'LOW', waitTime: '2 mins', baseWalkTime: '3 mins', adjustedWalkTime: '4 mins' },
      { id: 'zone-concourse-300', name: 'Concourse 300 Upper Level', density: 70, status: 'HIGH', waitTime: '8 mins', baseWalkTime: '5 mins', adjustedWalkTime: '12 mins' }
    ];
  }

  /**
   * Get current live crowd density
   */
  getCrowdDensity() {
    const aiRecommendations = [
      "Bypass Gate B East Stand due to 85% congestion (35-min delay). Enter via Gate C or Gate D West Fast-Track.",
      "Use Concourse 200 Indoor Club Level to avoid outdoor sun exposure and concourse choke points.",
      "Post-match egress: Exit via Gate D West to Lot D rideshare hub to save 25 minutes of egress gridlock."
    ];

    const nearestExits = [
      { name: "Gate D West Fast-Track Exit", distance: "120m", estTime: "2 mins", crowdLevel: "LOW (Clear Path)" },
      { name: "Gate C South Exit", distance: "180m", estTime: "4 mins", crowdLevel: "LOW (Clear Path)" },
      { name: "Gate A North Exit", distance: "240m", estTime: "6 mins", crowdLevel: "CLEAR" },
      { name: "Gate B East Exit", distance: "310m", estTime: "18 mins", crowdLevel: "CONGESTED" }
    ];

    return {
      zones: this.zones,
      aiRecommendations,
      nearestExits
    };
  }

  /**
   * AI Predictive Crowd Analytics Engine (4 Factors: Match timing, Gate popularity, Parking occupancy, Historical congestion)
   */
  predictCrowdConditions(params = {}) {
    const matchTime = params.matchTime || 'T-60';
    const gateId = params.gateId || 'Gate A';
    const parkingOccupancy = parseInt(params.parkingOccupancy, 10) || 85;

    const cacheKey = `predict_gate_${gateId}_time_${matchTime}_park_${parkingOccupancy}`;
    const cached = defaultCache.get(cacheKey);
    if (cached) return cached;

    let baseWaitMins = 5;
    let timingMultiplier = 1.0;
    let popularityFactor = 1.0;
    let reasoning = [];

    // 1. Match Timing Factor
    if (matchTime === 'T-60') {
      timingMultiplier = 2.2;
      reasoning.push(`Match Timing (T-60 mins): Represents the peak turnstile entry rush prior to kickoff.`);
    } else if (matchTime === 'T-15') {
      timingMultiplier = 1.8;
      reasoning.push(`Match Timing (T-15 mins): Pre-kickoff anthem rush creating secondary concourse spikes.`);
    } else if (matchTime === 'T-120') {
      timingMultiplier = 0.6;
      reasoning.push(`Match Timing (T-120 mins): Early gate opening window with light steady inflow.`);
    } else if (matchTime === 'POST_MATCH') {
      timingMultiplier = 2.5;
      reasoning.push(`Match Timing (Post-Match): Final whistle exit egress generating heavy pedestrian traffic towards transit hubs.`);
    }

    // 2. Gate Popularity Factor
    if (gateId.includes('A')) {
      popularityFactor = 1.3;
      reasoning.push(`Gate Popularity (Gate A North): Connects directly to Metro station & Shuttle drop-off (65% fan preference).`);
    } else if (gateId.includes('B')) {
      popularityFactor = 1.9;
      reasoning.push(`Gate Popularity (Gate B East): Direct entry from Lot B general parking deck (85% occupancy).`);
    } else if (gateId.includes('C')) {
      popularityFactor = 1.2;
      reasoning.push(`Gate Popularity (Gate C South): Connects to shuttle hub with moderate steady throughput.`);
    } else if (gateId.includes('D')) {
      popularityFactor = 0.5;
      reasoning.push(`Gate Popularity (Gate D West): Fast-track plaza with low crowd throughput.`);
    }

    // 3. Parking Occupancy Factor
    if (parkingOccupancy >= 80) {
      baseWaitMins += 5;
      reasoning.push(`Parking Deck Occupancy (${parkingOccupancy}%): High deck fill rate increases turnstile inflow by +5 minutes.`);
    }

    // 4. Calculate Final Predictive Metrics
    const predictedWaitMins = Math.round(baseWaitMins * timingMultiplier * popularityFactor);
    let status = 'LOW';
    let altGate = 'Gate D West Fast-Track';

    if (predictedWaitMins >= 18) {
      status = 'CRITICAL_BOTTLENECK';
      altGate = 'Gate D (West Plaza) - Save 15+ mins!';
    } else if (predictedWaitMins >= 10) {
      status = 'MODERATE_QUEUE';
      altGate = 'Gate A (North Plaza) or Gate D (West Plaza)';
    }

    const aiReasoning = `AI Predictive Rationale:\n• ` + reasoning.join('\n• ');

    const result = {
      matchTime,
      gateId,
      parkingOccupancy: `${parkingOccupancy}%`,
      predictedWaitMins: `${predictedWaitMins} mins`,
      congestionLevel: status,
      recommendedAlternativeEntrance: altGate,
      aiReasoning,
      historicalTrend: 'FWC 2026 Quarterfinal Predictive Curve Model'
    };

    defaultCache.set(cacheKey, result, 60000); // 1 min TTL
    return result;
  }

  /**
   * Context-Aware Smart Navigation Engine (8 Factors: Gate, Seat, Crowd, Accessibility, Weather, Distance, Elderly, Families)
   */
  calculateSmartRoute(params = {}) {
    const gate = params.gate || 'Gate A';
    const section = params.section || '104';
    const row = params.row || '12';
    const seat = params.seat || '8';
    const weather = (params.weather || 'sunny').toLowerCase();
    const isWheelchair = Boolean(params.accessibility);
    const isElderly = Boolean(params.isElderly);
    const hasChildren = Boolean(params.hasChildren);
    const distancePref = params.distancePreference || 'SHORTEST';

    const cacheKey = `smart_route_${gate}_sec_${section}_w_${weather}_a_${isWheelchair}_e_${isElderly}_f_${hasChildren}`;
    const cached = defaultCache.get(cacheKey);
    if (cached) return cached;

    let routeSteps = [];
    let distanceMeters = 320;
    let baseMins = 4;
    let rationale = [];

    // 1. User's Gate & Crowd Density Analysis
    if (gate.includes('B')) {
      routeSteps.push(`⚠️ Gate B East is experiencing 85% critical crowd congestion (~35-minute security queue).`);
      routeSteps.push(`🔀 AI Reroute: Bypass Gate B by walking 100m South to Gate C or Gate D West Fast-Track.`);
      distanceMeters += 90;
      baseMins += 3;
      rationale.push(`Rerouted from Gate B East because it currently has a 35-minute security wait; Gate D West has under 3 minutes wait time.`);
    } else {
      routeSteps.push(`🚪 Enter via ${gate} Turnstiles (Current wait time: ~4 mins).`);
      rationale.push(`Selected ${gate} turnstiles because current entry queue is clear (4 minutes wait).`);
    }

    // 2. Weather Conditions
    if (weather.includes('rain')) {
      routeSteps.push(`🌧️ Rain-Safe Route: Transition immediately to Covered Indoor Concourse 200.`);
      distanceMeters += 40;
      rationale.push(`Selected indoor covered Concourse 200 passages to shield you from heavy rain.`);
    } else if (weather.includes('heat')) {
      routeSteps.push(`🌡️ Climate Control Route: Walk through Air-Conditioned Club Lounge at Concourse 200.`);
      rationale.push(`Selected air-conditioned indoor corridors to avoid 35°C extreme heat and high UV exposure.`);
    } else {
      routeSteps.push(`☀️ Clear Weather: Proceed down main North Promenade directly.`);
      rationale.push(`Selected direct outdoor promenade under clear, pleasant weather conditions.`);
    }

    // 3. Accessibility Needs & Elderly Visitors
    if (isWheelchair || isElderly) {
      routeSteps.push(`♿ Barrier-Free Route: Take Elevator Bank 2 (Section 104/204) - Zero stairs required.`);
      baseMins += 2;
      if (isWheelchair) {
        rationale.push(`Enforced 100% barrier-free step-free ramp and elevator access for wheelchair mobility.`);
      }
      if (isElderly) {
        rationale.push(`Prioritized Elevator Bank 2 and resting bench portals to minimize physical stair exertion for elderly visitors.`);
      }
    } else {
      routeSteps.push(`🚶 Standard Route: Take Escalator 4 directly to Section Portal.`);
    }

    // 4. Families with Children
    if (hasChildren) {
      routeSteps.push(`👶 Family Fast-Track: Walk via Wide Stroller Concourse 200 (Passes Section 215 Family Restrooms & Quiet Lounge).`);
      distanceMeters += 30;
      rationale.push(`Selected wide stroller-friendly concourse passing Family Restrooms & Section 215 Quiet Lounge for children.`);
    }

    // 5. Seat Arrival Target
    routeSteps.push(`📍 Arrive at Section ${section}, Row ${row}, Seat ${seat}.`);

    const aiExplanation = `AI Route Selection Rationale:\n• ` + rationale.join('\n• ');

    const result = {
      gate,
      section,
      row,
      seat,
      weather,
      distanceMeters: `${distanceMeters}m`,
      walkingTimeMins: `${baseMins} mins`,
      routeSteps,
      aiExplanation,
      recommendedAlternativeRoute: `Bypass Gate B -> Gate D West -> Elevator Bank 2 -> Section ${section}`
    };

    defaultCache.set(cacheKey, result, 60000); // 1 min TTL
    return result;
  }
}

module.exports = new CrowdService();
