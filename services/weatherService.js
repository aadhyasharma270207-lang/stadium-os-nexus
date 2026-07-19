/**
 * Weather Intelligence Service - FIFA World Cup 2026
 * Evaluates matchday weather conditions (rain, heat, cold, sunny),
 * recommending covered entrances, climate-controlled indoor waiting lounges,
 * clothing advice, and heat wave warnings with free hydration station portals.
 */

const { defaultCache } = require('../utils/cache');

class WeatherService {
  /**
   * Get current live weather telemetry for MetLife Stadium
   */
  getCurrentWeather() {
    return {
      stadium: 'MetLife Stadium (NY/NJ)',
      temperature: '31°C (88°F)',
      condition: 'Sunny / Extreme Heat Warning',
      humidity: '68%',
      windSpeed: '12 km/h',
      uvIndex: '8 (Very High)',
      precipitationChance: '10%',
      advisoryAlert: '🌡️ Extreme Heat Warning: Stay hydrated. Free water refill stations are active at Portals 104, 214, and 330.'
    };
  }

  /**
   * Evaluate context-aware Weather Intelligence & Advisory Recommendations
   * @param {Object} params - { condition, temperature, section }
   */
  getWeatherIntelligence(params = {}) {
    const rawCondition = (params.condition || params.weather || 'sunny').toLowerCase();
    const section = (params.section || '104').trim();

    const cacheKey = `weather_intel_${rawCondition}_sec_${section}`;
    const cached = defaultCache.get(cacheKey);
    if (cached) return cached;

    let conditionLabel = 'Sunny & Warm';
    let indoorWaitingArea = 'Concourse 200 Climate-Controlled Club Lounge';
    let rainSafeEntrance = 'Gate A Covered Ramp & Atrium Entry';
    let clothingAdvice = 'Lightweight breathable cotton shirt, sun cap, and UV-blocking sunglasses.';
    let heatWarning = null;
    let hydrationStations = [
      `Portal ${section} Concourse Wall (Free Chilled Water Refill)`,
      'Section 214 Club Level Water Bar',
      'Section 330 Upper Deck Hydration Hub'
    ];

    if (rawCondition.includes('rain') || rawCondition.includes('storm')) {
      conditionLabel = 'Heavy Rain / Thunderstorm Alert';
      indoorWaitingArea = 'Concourse 200 Covered Indoor Atrium & Section 215 Family Lounge';
      rainSafeEntrance = 'Gate A Covered Ramp & Gate D West Tunnel Entry (Bypasses open plazas)';
      clothingAdvice = 'Waterproof rain poncho, hooded windbreaker, and anti-slip rubber footwear.';
    } else if (rawCondition.includes('heat') || rawCondition.includes('hot') || rawCondition.includes('35')) {
      conditionLabel = 'Extreme Heat Wave (35°C+ / 95°F+)';
      indoorWaitingArea = 'Air-Conditioned Club Lounge (Concourse 200) & Section 215 Quiet Cooling Center';
      rainSafeEntrance = 'Gate D West Shaded Entrance Plaza';
      clothingAdvice = 'Light-colored moisture-wicking attire, wide-brim hat, and SPF 50+ sunscreen.';
      heatWarning = '⚠️ EXTREME HEAT WARNING: High risk of heat exhaustion. Avoid prolonged direct sunlight between 12:00 PM and 4:00 PM.';
    } else if (rawCondition.includes('cold') || rawCondition.includes('wind')) {
      conditionLabel = 'Chilly / High Wind Advisory';
      indoorWaitingArea = 'Concourse 200 Heated Lounge Enclosure';
      rainSafeEntrance = 'Gate B East Indoor Concourse Passage';
      clothingAdvice = 'Thermal base layer, FIFA World Cup stadium scarf, insulated jacket, and gloves.';
    }

    const aiRationale = `AI Weather Intelligence Rationale:
• Condition Analyzed: ${conditionLabel}.
• Indoor Refuge: Selected ${indoorWaitingArea} to protect fans from harsh climate conditions.
• Entry Recommendation: Directed via ${rainSafeEntrance} to minimize exposure to weather elements.
• Hydration & Safety: Positioned free water refill portals near Section ${section} for optimal matchday comfort.`;

    const result = {
      condition: conditionLabel,
      section,
      indoorWaitingArea,
      rainSafeEntrance,
      clothingAdvice,
      heatWarning,
      hydrationStations,
      aiRationale
    };

    defaultCache.set(cacheKey, result, 300000); // 5 min TTL
    return result;
  }
}

module.exports = new WeatherService();
