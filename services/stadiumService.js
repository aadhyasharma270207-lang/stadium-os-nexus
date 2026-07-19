/**
 * Stadium Service - FIFA World Cup 2026
 * Manages host venue metadata, matchday tickers, and AI Accessibility & Family Assistant Plans for 5 Fan Profiles.
 */

const { readJsonData } = require('../utils/fileReader');
const { defaultCache } = require('../utils/cache');

class StadiumService {
  /**
   * Fetch list of all 4 host stadiums
   */
  getStadiums() {
    return readJsonData('stadiums.json', []);
  }

  /**
   * Get single stadium details by ID
   */
  getStadiumById(id = 'metlife') {
    const list = this.getStadiums();
    return list.find(s => s.id === id) || list[0];
  }

  /**
   * Get Live Match Ticker Data
   */
  getMatchTicker() {
    return {
      matchId: 'FWC-2026-M48',
      teams: {
        home: { code: 'USA', name: 'United States', flag: '🇺🇸', score: 2 },
        away: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', score: 1 }
      },
      minute: "74'",
      status: 'LIVE_SECOND_HALF',
      venue: 'MetLife Stadium (NY/NJ)',
      attendance: '82,500 (100% Capacity)'
    };
  }

  /**
   * AI Accessibility & Family Assistant Plan Generator for 5 Fan Profiles
   * Supports Wheelchair users, Elderly, Visually impaired, Hearing impaired, & Families with strollers.
   */
  generateAccessibilityPlan(profileType = 'WHEELCHAIR', section = '104') {
    const secNum = parseInt(section, 10) || 104;
    const cacheKey = `a11y_plan_profile_${profileType}_sec_${section}`;
    const cached = defaultCache.get(cacheKey);
    if (cached) return cached;

    let result = null;

    switch (profileType.toUpperCase()) {
      case 'WHEELCHAIR':
        result = {
          profile: 'Wheelchair & Barrier-Free Mobility',
          icon: '♿',
          section,
          recommendedRoute: [
            '1. Enter via Gate A North Plaza step-free ramp turnstiles.',
            '2. Take Elevator Bank 2 to Level 1 Concourse.',
            '3. Proceed via 3-meter wide step-free corridor to Portal ' + section + '.',
            '4. Accessible companion seating is reserved at row 12 portal entry.'
          ],
          nearestAmenities: {
            elevator: 'Elevator Bank 2 (Section ' + section + ')',
            restroom: 'Gender-Neutral ADA Restroom at Section ' + section,
            entryGate: 'Gate A North Plaza (Barrier-Free Ramps)'
          },
          tips: [
            'Priority wheelchair elevator passes available at Gate A Guest Lounge.',
            'In-seat concession delivery is enabled for your seat section.'
          ]
        };
        break;

      case 'ELDERLY':
        result = {
          profile: 'Elderly Visitors & Low Exertion',
          icon: '👵',
          section,
          recommendedRoute: [
            '1. Enter via Gate D West Plaza (Shortest walk, 3-min queue).',
            '2. Take Elevator Bank 2 directly to Concourse 200 Club Level.',
            '3. Follow the shaded inner concourse equipped with resting benches every 50 meters.',
            '4. Enter Section ' + section + ' via lower portal row 4.'
          ],
          nearestAmenities: {
            elevator: 'Elevator Bank 2 (Priority Senior Seating)',
            restroom: 'Club Level ADA Restroom at Section 210',
            restingBenches: 'Benches located outside Portals 104, 204, 304'
          },
          tips: [
            'Resting benches are provided outside every main portal.',
            'Senior assistance Golf Cart shuttles operate between Lot E and Gate D.'
          ]
        };
        break;

      case 'VISUAL':
        result = {
          profile: 'Visually Impaired & Audio Assistance',
          icon: '👁️',
          section,
          recommendedRoute: [
            '1. Enter via Gate A North Plaza tactile floor guidance path.',
            '2. Follow textured tactile concourse strip to Portal ' + section + '.',
            '3. Connect to the FIFA Stadium Wi-Fi to activate live audio-described match commentary.'
          ],
          nearestAmenities: {
            audioStream: 'Live Audio-Described Commentary Channel (Accessibility Tab)',
            tactilePath: 'Tactile floor strip running from Gate A to Section ' + section,
            assistanceLounge: 'FIFA Guest Services at Gate A Plaza'
          },
          tips: [
            'Enable High Contrast Vision Mode in the top header controls.',
            'Use Web Speech TTS voice output in the Goalie AI Chatbot for hands-free queries.'
          ]
        };
        break;

      case 'HEARING':
        result = {
          profile: 'Hearing Impaired & Visual Captions',
          icon: '🦻',
          section,
          recommendedRoute: [
            '1. Enter via Gate B East Plaza.',
            '2. Proceed to Section ' + section + ' (Direct line-of-sight to Stadium LED Screen 1).',
            '3. Live PA announcements are displayed in real-time on concourse visual text displays.'
          ],
          nearestAmenities: {
            visualCaptions: 'Live PA Text Screen at Section ' + section + ' Portal',
            signLanguage: 'International Sign Language Guide at Gate A Lounge',
            flashingAlerts: 'Visual Strobe Emergency Alert Lights installed at all portals'
          },
          tips: [
            'Live PA announcement captions stream directly inside the Goalie AI Chatbot.',
            'Visual flashing strobe lights indicate emergency alerts.'
          ]
        };
        break;

      case 'STROLLER':
      default:
        result = {
          profile: 'Families with Strollers & Children',
          icon: '👶',
          section,
          recommendedRoute: [
            '1. Enter via Gate A North Plaza wide stroller lanes.',
            '2. Take Elevator Bank 1 to Concourse 200.',
            '3. Walk via Wide Family Concourse passing Section 215 Quiet Lounge and Family Restrooms.',
            '4. Stroller parking is available right inside Portal ' + section + '.'
          ],
          nearestAmenities: {
            familyRestroom: 'Family Restrooms with Changing Tables at Section 215',
            sensoryRoom: 'Quiet Sensory Relief Lounge & Private Nursing Pods at Section 215',
            strollerParking: 'Secured Stroller Parking at Portal ' + section,
            kidFood: 'Junior Champion Combo ($7.99) at Section 104'
          },
          tips: [
            'Free noise-canceling headphones for infants are available at Section 215 Lounge.',
            'Kid-friendly meals are served at Section 104 & 210 Concessions.'
          ]
        };
        break;
    }

    defaultCache.set(cacheKey, result, 300000); // 5 min TTL
    return result;
  }
}

module.exports = new StadiumService();
