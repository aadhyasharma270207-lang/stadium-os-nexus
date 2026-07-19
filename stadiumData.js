/**
 * stadiumData.js
 * 
 * Business logic and static mock database for the FIFA World Cup 2026 Smart Stadium Assistant.
 * Serves as the backend data layer and holds the offline NLP chatbot simulation routines.
 */

// ----------------------------------------------------
// Mock Databases
// ----------------------------------------------------

/**
 * Fixture schedule for FIFA World Cup 2026 matches.
 */
const MATCH_SCHEDULE = [
  {
    id: "match-1",
    homeTeam: "USA",
    awayTeam: "Mexico",
    time: "2026-07-18T18:00:00",
    status: "Upcoming",
    stage: "Group A",
    stadium: "MetLife Stadium",
    homeFlag: "🇺🇸",
    awayFlag: "🇲🇽"
  },
  {
    id: "match-2",
    homeTeam: "Canada",
    awayTeam: "Argentina",
    time: "2026-07-18T21:00:00",
    status: "Upcoming",
    stage: "Group B",
    stadium: "MetLife Stadium",
    homeFlag: "🇨🇦",
    awayFlag: "🇦🇷"
  },
  {
    id: "match-3",
    homeTeam: "Brazil",
    awayTeam: "Spain",
    time: "2026-07-19T17:00:00",
    status: "Upcoming",
    stage: "Group C",
    stadium: "MetLife Stadium",
    homeFlag: "🇧🇷",
    awayFlag: "🇪🇸"
  },
  {
    id: "match-4",
    homeTeam: "England",
    awayTeam: "France",
    time: "2026-07-17T20:00:00",
    status: "Live - Min 72",
    stage: "Quarter-Finals",
    stadium: "MetLife Stadium",
    homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayFlag: "🇫🇷"
  }
];

/**
 * Live Parking lot occupancy telemetry.
 */
const PARKING_LOTS = [
  {
    id: "lot-a",
    name: "Lot A (North Gate)",
    totalSpaces: 500,
    occupiedSpaces: 475,
    pricing: "$50",
    features: ["VIP Reservation", "EV Charging Station", "Wheelchair Accessible Access"],
    congestion: "High" // Color-blind friendly text tag
  },
  {
    id: "lot-b",
    name: "Lot B (East Gate)",
    totalSpaces: 1200,
    occupiedSpaces: 1020,
    pricing: "$35",
    features: ["General Parking", "Standard Shuttles"],
    congestion: "High"
  },
  {
    id: "lot-c",
    name: "Lot C (South Gate)",
    totalSpaces: 800,
    occupiedSpaces: 240,
    pricing: "$25",
    features: ["Pre-booked transit connections", "Bicycle Racks"],
    congestion: "Low"
  },
  {
    id: "lot-d",
    name: "Lot D (West Gate)",
    totalSpaces: 600,
    occupiedSpaces: 180,
    pricing: "$40",
    features: ["Rideshare drop-off zone", "Accessible Parking Lanes"],
    congestion: "Low"
  }
];

/**
 * Concession food stalls with live wait times and crowd indicators.
 */
const FOOD_STALLS = [
  {
    id: "stall-1",
    name: "Stadium Street Tacos",
    location: "North Concourse (Near Gate A)",
    cuisine: "Mexican",
    waitTime: 25, // in minutes
    crowdLevel: "High", // High / Moderate / Low
    features: ["Vegetarian Options", "Wheelchair Accessible counter"]
  },
  {
    id: "stall-2",
    name: "International Grill & Burgers",
    location: "East Concourse (Near Gate B)",
    cuisine: "American / Grill",
    waitTime: 18,
    crowdLevel: "Moderate",
    features: ["Gluten-free Buns"]
  },
  {
    id: "stall-3",
    name: "South Side Pizza & Pasta",
    location: "South Concourse (Near Gate C)",
    cuisine: "Italian",
    waitTime: 5,
    crowdLevel: "Low",
    features: ["Halal Ingredients", "Tactile menu available"]
  },
  {
    id: "stall-4",
    name: "Green Bite Salad Bar",
    location: "West Concourse (Near Gate D)",
    cuisine: "Healthy / Salads / Vegan",
    waitTime: 3,
    crowdLevel: "Low",
    features: ["100% Vegan Options", "Low Counters"]
  }
];

/**
 * Live alerts regarding stadium crowd congestion and delays.
 */
const CROWD_ALERTS = [
  {
    id: "alert-1",
    location: "Gate B (East Stand)",
    status: "Critical Congestion",
    severity: "High", // High (Red), Warning (Yellow), Low (Green)
    message: "Security queues at Gate B are averaging 35 minutes due to peak arrival. Fans are recommended to reroute.",
    alternateAction: "Use Gate C (South Stand) which has a wait time under 5 minutes."
  },
  {
    id: "alert-2",
    location: "Concourse North Transit",
    status: "Moderate Traffic",
    severity: "Warning",
    message: "High walking traffic near Food Court North.",
    alternateAction: "Avoid North passageway, use the lower level service corridors instead."
  }
];

/**
 * Emergency and medical response details.
 */
const SAFETY_DIRECTORY = {
  contacts: [
    { label: "Stadium Safety & Security", phone: "+1 (800) 555-7233", readable: "1 800 555 SAFE" },
    { label: "Medical First-Aid Dispatch", phone: "+1 (800) 555-6331", readable: "1 800 555 MED 1" },
    { label: "Public Police Services", phone: "911", readable: "9 1 1" },
    { label: "Public Fire Services", phone: "911", readable: "9 1 1" }
  ],
  locations: {
    medical: [
      { name: "First-Aid Room North (Main)", nearestGate: "Gate A", details: "Behind Section 101, open 24/7 during events." },
      { name: "First-Aid Station South", nearestGate: "Gate C", details: "Next to Section 125, medical professionals on duty." }
    ],
    security: [
      { name: "Command Center North", nearestGate: "Gate A", details: "Adjacent to Ticket Office." },
      { name: "Security Desk East", nearestGate: "Gate B", details: "Next to general transit checkpoint." },
      { name: "Security Desk West", nearestGate: "Gate D", details: "Adjacent to accessibility gate." }
    ]
  },
  instructions: [
    {
      title: "Evacuation Protocol",
      steps: [
        "Remain calm and listen to the overhead stadium speaker announcements.",
        "Locate the nearest emergency exit indicator (marked with glowing arrows). Do not use elevators.",
        "Follow directions from security wardens (wearing high-visibility orange jackets).",
        "Move completely clear of the outer stadium gates to the designated assembly zones."
      ]
    },
    {
      title: "Medical Emergencies",
      steps: [
        "Press the red SOS button to request stadium dispatch immediately.",
        "Indicate your Stand, Section, Row, and Seat number to the helper.",
        "If safe to do so, proceed to the nearest Medical Center (Gate A or Gate C).",
        "Do not move severely injured fans unless there is immediate danger (e.g. fire)."
      ]
    }
  ],
  lostAndFound: {
    deskLocation: "Guest Services Center North (Gate A, Behind Section 101)",
    reportingPhone: "+1 (800) 555-7233",
    items: [
      { id: "item-1", name: "Black leather wallet", foundAt: "East Stand Sec 102", status: "Claimed" },
      { id: "item-2", name: "Set of keys with FIFA keychain", foundAt: "Gate C entrance", status: "Unclaimed" },
      { id: "item-3", name: "iPhone 15 (Yellow case)", foundAt: "Food Court North", status: "Unclaimed" }
    ]
  }
};

// ----------------------------------------------------
// Gemini System Prompts
// ----------------------------------------------------

/**
 * Comprehensive prompt explaining the stadium configuration.
 * Seeding Gemini AI with spatial navigation, seats, parking, safety, and transit.
 */
const GEMINI_SYSTEM_INSTRUCTION = `
You are the official Smart Stadium Assistant for the FIFA World Cup 2026 matches held at the MetLife Stadium.
Your primary role is to assist fans with directions, safety, parking, food concessions, schedule, accessibility, and emergency support.
Maintain a polite, welcoming, professional, and clear tone.

STADIUM GEOGRAPHY CONTEXT:
- The stadium is divided into 4 stands: North, East, South, and West.
- Gate A is in the North stand (Main entrance, next to first-aid).
- Gate B is in the East stand (Connects to Lot B general parking).
- Gate C is in the South stand (Connects to Shuttle hubs and Lot C).
- Gate D is in the West stand (Connects to Lot D rideshare and accessible parking).

SEATING PATHWAYS:
- Seat B12 is specifically located in the East Stand, Section 102, Row B, Seat 12.
- To reach Seat B12: Fans should enter through Gate B (East). Walk inside the main concourse to Section 102 (located just next to Gate B corridor). Head down Row B to seat 12. Estimated walking time from entrance Gate B is 4 minutes.
- If Gate B is congested, advise using Gate C (South), walking up the South-East inner pathway to Section 102 (estimated walking time 7 minutes, but bypasses queues).

WASHROOM LOCATIONS:
- Washrooms are positioned on all stand concourses:
  - Next to Section 101 (near Gate A)
  - Next to Section 112 (near Gate B)
  - Next to Section 125 (near Gate C)
  - Next to Section 136 (near Gate D)
- All washrooms include wheelchair-accessible stalls, diaper changing decks, and braille indicators.

PARKING ZONES:
- Lot A (North): Reserved for VIP, staff, and EV charging points.
- Lot B (East): General public parking. Highly crowded today.
- Lot C (South): Transit link, bus shuttle station, and pre-booked rides. Low congestion.
- Lot D (West): General rideshare (Uber/Lyft) zone, accessible parking, and bicycle ranks. Low congestion.

FOOD STALL QUEUES:
- "Stadium Street Tacos" (Gate A): Mexican. Very crowded (25-minute wait).
- "International Grill" (Gate B): Burgers. Moderately crowded (18-minute wait).
- "South Side Pizza" (Gate C): Italian. Very quiet (5-minute wait). RECOMMENDED.
- "Green Bite Salad Bar" (Gate D): Healthy/Vegan. Very quiet (3-minute wait). RECOMMENDED.

SAFETY & MEDICAL EMERGENCIES:
- First-Aid rooms are located behind Section 101 (Gate A) and Section 125 (Gate C).
- Security Command Centers are situated at Gate A, Gate B, and Gate D.
- Hotlines: Stadium Safety is 1-800-555-SAFE (+1 800-555-7233). Emergency First-Aid is 1-800-555-MED1 (+1 800-555-6331).
- EVACUATION: Emergency exit pathways are marked with neon exit signage. Head to Gate A, B, C, or D exits calmly. Do not use elevators.

RULES FOR CHATBOT RESPONSES:
1. If the user asks for Gate A, B, C, D, washrooms, seat B12, parking lots, or food stands, answer strictly using the details above.
2. If the user asks about an emergency (SOS, hurt, injured, fire, panic, call security), provide contact numbers and direct them to the nearest aid station immediately.
3. Estimate walking times when asked (e.g. Section 102 to Gate B is 4 minutes, Section 102 to Gate C is 7 minutes).
4. Recommend alternate routes: if they ask about crowded areas (like Gate B or Stadium Street Tacos), politely suggest Gate C or Green Bite Salad Bar/South Side Pizza to save time.
5. If the user asks an irrelevant or invalid question (e.g. cooking recipes, capital cities, math equations, software coding), respond politely: "I apologize, but as the Smart Stadium Assistant, I can only assist with tournament matches, navigation inside the stadium, parking guidance, safety, concession food queues, and accessibility requests. How can I help you find your seat or gate today?"
`;

// ----------------------------------------------------
// Offline NLP Fallback Solver
// ----------------------------------------------------

/**
 * Simulates a smart, context-aware chatbot response using regular expression matches.
 * Activates when the Gemini API key is missing or encounters a network error.
 * 
 * @param {string} userQuery - The input message from the user.
 * @returns {string} - The context-driven simulated AI response.
 */
function resolveLocalChat(userQuery) {
  const query = userQuery.toLowerCase().trim();

  // Basic empty checks
  if (!query) {
    return "Please enter a question so I can assist you.";
  }

  // 1a. Emergency Exits
  if (query.includes("exit") || query.includes("evacuate") || query.includes("stairwell")) {
    return "🚶 **Emergency Exits:** Primary evacuation routes are through Gates A, B, C, and D, marked with glowing green signs. Each stand corner also features dedicated emergency exit stairwells leading directly to the outer stadium boundary. Do not use elevators during emergencies. Follow stadium wardens in orange vests.";
  }

  // 1b. Wheelchair Entrances / Accessibility entry
  if ((query.includes("wheelchair") && (query.includes("entrance") || query.includes("entry") || query.includes("gate") || query.includes("access")))) {
    return "♿ **Wheelchair & Accessible Entrances:** **Gate D (West Stand)** is the designated accessibility entrance, featuring low-barrier wide turnstiles and flat ramp interfaces. It is closest to Lot D (Accessible Parking). Gate A (North) and Gate C (South) also support wheelchair-accessible entries and connect directly to concourse elevators.";
  }

  // 1d. Lost & Found
  if (query.includes("lost") || query.includes("found") || query.includes("missing") || query.includes("wallet") || query.includes("keys") || query.includes("phone")) {
    return "🔍 **Lost & Found Services:** The primary Guest Services & Lost and Found office is located in the **North Concourse (Gate A, behind Section 101)**.\n\n" +
           "- **To Report/Claim an Item:** Head to the desk in person or call Stadium Safety at **+1 (800) 555-7233**.\n" +
           "- **Recent items turned in today:**\n" +
           "  1. Black leather wallet (Claimed)\n" +
           "  2. Set of keys with FIFA keychain (Unclaimed)\n" +
           "  3. iPhone 15 with yellow case (Unclaimed)\n\n" +
           "Rest assured, all items are cataloged and kept in a secure vault for up to 30 days.";
  }

  // 1c. Emergency keywords
  if (query.includes("sos") || query.includes("emergency") || query.includes("fire") || query.includes("hurt") || query.includes("injured") || query.includes("police") || query.includes("doctor")) {
    return "🚨 **Emergency Protocol Activated:** If you or someone near you needs medical care or security assistance, please press the RED **SOS Help** button in the dashboard or call Stadium Safety immediately at **+1 (800) 555-7233** or First-Aid at **+1 (800) 555-6331**. Medical centers are fully operational at **Gate A (Section 101)** and **Gate C (Section 125)**.";
  }

  // 2. Gate A
  if (query.includes("gate a")) {
    return "🚶 **Gate A Navigation:** Gate A is situated in the **North Stand**. It serves as the primary entrance checkpoint and is located right next to the main First-Aid Room. Estimated walking time from Section 101 is less than 1 minute.";
  }

  // 3. Gate B or Seating B12
  if (query.includes("gate b") || query.includes("b12") || query.includes("seat b12")) {
    return "🏟️ **Seat B12 Navigation & Routes:** Seat B12 is located in the **East Stand (Section 102, Row B, Seat 12)**.\n\n" +
           "- **Primary Route:** Enter via **Gate B (East Stand)**. Section 102 is adjacent to the gate corridor. Row B, Seat 12 is a **4-minute walk** from Gate B.\n" +
           "- **Alternate Route (Recommended due to congestion):** If Gate B is crowded, enter via **Gate C (South Stand)** and take the inner lower walkway toward Section 102. This route takes **7 minutes** but bypasses the security queues.";
  }

  // 4. Gate C
  if (query.includes("gate c")) {
    return "🚶 **Gate C Navigation:** Gate C is in the **South Stand**. It provides direct access to the bus shuttle hub, bicycle ranks, and Lot C transit parking. It is currently operating with very low queue wait times (under 5 minutes).";
  }

  // 5. Gate D
  if (query.includes("gate d")) {
    return "🚶 **Gate D Navigation:** Gate D is in the **West Stand**. It connects directly to Lot D accessible parking, bicycle ranks, and the main rideshare drop-off and pickup zone. Transition gates here are equipped with low-barrier wheelchair turnstiles.";
  }

  // 6. Washrooms / Toilet
  if (query.includes("washroom") || query.includes("toilet") || query.includes("restroom") || query.includes("bathroom")) {
    return "🚻 **Washroom Locations:** Accessible restrooms with diaper changing decks and braille markings are located next to:\n" +
           "- **Section 101** (North Stand, near Gate A)\n" +
           "- **Section 112** (East Stand, near Gate B)\n" +
           "- **Section 125** (South Stand, near Gate C)\n" +
           "- **Section 136** (West Stand, near Gate D)\n\n" +
           "All restrooms are fully accessible and support wheelchair entries.";
  }

  // 7. Parking / Lot
  if (query.includes("park") || query.includes("parking") || query.includes("lot")) {
    return "🚗 **Parking & Transit Guide:**\n" +
           "- **Lot A (North Gate):** Reserved for VIPs, staff, and EV charging points. Currently high occupancy.\n" +
           "- **Lot B (East Gate):** General public parking. Capacity is **85% full** (wait times are high).\n" +
           "- **Lot C (South Gate - Transit Hub):** Low congestion (30% occupancy). Ideal for shuttle transit.\n" +
           "- **Lot D (West Gate - Rideshare):** Low congestion. Designated drop-off zone and accessible parking lines.\n\n" +
           "**Recommendation:** We strongly recommend parking in **Lot C** or using public shuttles to avoid traffic delays near Lot B.";
  }

  // 8. Food / Eat / Snack / Hungry / Concessions / Stalls
  if (query.includes("food") || query.includes("eat") || query.includes("hungry") || query.includes("concession") || query.includes("stall") || query.includes("taco") || query.includes("burger") || query.includes("pizza") || query.includes("vegan")) {
    return "🍔 **Food stalls & Queue times:**\n" +
           "- **Stadium Street Tacos** (Gate A, North): Mexican cuisine. Wait time is **25 minutes** (High crowd).\n" +
           "- **International Grill** (Gate B, East): Burger/Grill. Wait time is **18 minutes** (Moderate crowd).\n" +
           "- **South Side Pizza** (Gate C, South): Pizza. Wait time is **5 minutes** (Low crowd). *Highly Recommended!*\n" +
           "- **Green Bite Salad Bar** (Gate D, West): Vegan/Healthy options. Wait time is **3 minutes** (Low crowd). *Highly Recommended!*\n\n" +
           "**AI Tip:** Skip the lines at the East concourse and head to the South or West concourses (Pizza or Salad Bar) to order, saving you over 15 minutes of waiting!";
  }

  // 9. Schedule / Match / Time / Fixture
  if (query.includes("schedule") || query.includes("match") || query.includes("game") || query.includes("play") || query.includes("teams")) {
    return "📅 **FIFA World Cup 2026 Fixtures at MetLife Stadium:**\n" +
           "- 🇺🇸 USA vs. 🇲🇽 Mexico | July 18, 18:00 (Group A)\n" +
           "- 🇨🇦 Canada vs. 🇦🇷 Argentina | July 18, 21:00 (Group B)\n" +
           "- 🇧🇷 Brazil vs. 🇪🇸 Spain | July 19, 17:00 (Group C)\n" +
           "- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England vs. 🇫🇷 France | Live now (72nd minute, Quarter-Finals)\n\n" +
           "Would you like to search directions to the gate for any of these matches?";
  }

  // 10. Accessibility / Disabled / Wheelchair
  if (query.includes("accessibility") || query.includes("disabled") || query.includes("wheelchair") || query.includes("braille") || query.includes("elevator") || query.includes("lift")) {
    return "♿ **Accessibility & Inclusivity Support:**\n" +
           "- **Elevators:** Available inside Gate A (North) and Gate C (South) concourse lobbies.\n" +
           "- **Seating:** Accessible wheelchair seating platforms are situated at the Section 100 level, Row W.\n" +
           "- **Bathrooms:** Every restroom zone includes extra-wide accessible stalls.\n" +
           "- **Services:** Assistive listening devices and tactile stadium layout booklets are available at the Guest Services booth near Gate A.\n" +
           "Toggle **High Contrast Mode** or **Font Size Adjustment** using the controls in the top navigation bar.";
  }

  // 11. Hello / Greetings
  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greetings") || query.includes("welcome")) {
    return "👋 **Hello! Welcome to MetLife Stadium for the FIFA World Cup 2026.** I am your Smart Stadium Assistant.\n\n" +
           "I can help you find your seat (like Seat B12), guide you to the nearest washrooms, check parking lots, recommend less-crowded food stalls, provide walking time estimates, or detail emergency and accessibility protocols. What can I do for you today?";
  }

  // 12. Invalid or Out-of-Context Queries
  return "🤖 **Smart Stadium Assistant:** I apologize, but I am programmed to assist exclusively with MetLife Stadium navigation, match schedules, seating maps (e.g. Seat B12), parking lot spaces, food concourse queues, accessibility support, and emergency safety guidelines.\n\n" +
         "For other queries, please refer to the official FIFA World Cup website. Let me know if you need help finding restrooms, gates, or medical rooms!";
}

module.exports = {
  MATCH_SCHEDULE,
  PARKING_LOTS,
  FOOD_STALLS,
  CROWD_ALERTS,
  SAFETY_DIRECTORY,
  GEMINI_SYSTEM_INSTRUCTION,
  resolveLocalChat
};
