# 🏟️ FIFA World Cup 2026 - Smart Stadium Assistant (MetLife Stadium Host Nexus)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-blue.svg)](https://expressjs.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-purple.svg)](https://deepmind.google/technologies/gemini/)
[![W3C WCAG](https://img.shields.io/badge/WCAG-2.1_AA_Compliant-brightgreen.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-grade, multi-agent AI platform and real-time telemetry dashboard engineered for football fans attending the FIFA World Cup 2026 at **MetLife Stadium (NY/NJ)**. Built with a modular Node.js/Express architecture, Google Gemini 1.5 Flash AI SDK, 2D HTML5 Pitch Canvas Engine, and W3C WCAG 2.1 AA compliant accessibility controls.

---

## 📌 1. Project Overview

Attending mega-events like the FIFA World Cup poses severe spatial, operational, and communication challenges:
- **Gridlock & Bottlenecks**: Over 80,000 fans navigating 4 stadium quadrants leads to massive turnstile queues and concourse choke points.
- **Language Barriers**: Loudspeaker announcements in English leave global fans uninformed during delays or security alerts.
- **Dietary & Accessibility Blindspots**: Fans with wheelchairs, strollers, seniors, or strict allergen/vegan needs struggle to find step-free paths or suitable food stalls.
- **Emergency Hazards**: Panic situations require zero-hallucination medical and evacuation instructions with exact first-aid locations and AED defibrillator portals.

**The Solution**: The *Smart Stadium Assistant* unifies real-time sensor telemetry with multi-agent Gemini AI engines to deliver multi-factor navigation, personalized food recommendations, zero-hallucination emergency support, weather advisories, 8-step matchday itineraries, and predictive crowd analytics.

---

## 🏗️ 2. System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                 FRONTEND LAYER                                    |
|   Single-Page Web Interface (HTML5, Vanilla CSS Glassmorphism, 2D Pitch Canvas)   |
|   WCAG 2.1 AA Controls (Screen Reader Announcer, High Contrast, Font Scaler)     |
+----------------------------------------+------------------------------------------+
                                         | REST API (HTTP / JSON)
                                         v
+-----------------------------------------------------------------------------------+
|                              EXPRESS.JS BACKEND ENGINE                            |
|   Security Headers (X-Frame-Options, X-Content-Type-Options)                      |
|   In-Memory TTL/LRU Response Cache (utils/cache.js - Sub-10ms Latency)            |
+--------+---------------+------------------+-------------------+-------------------+
         |               |                  |                   |
         v               v                  v                   v
  [Crowd Engine]  [Food Engine]     [Emergency Engine]   [Accessibility Engine]
  Multi-Factor    9-Criteria        Zero-Hallucination   5 Specialized
  Smart Routes    Gemini Dining     Medical / SOS        Fan Profiles
         |               |                  |                   |
         +---------------+------------------+-------------------+
                         |
                         v
+-----------------------------------------------------------------------------------+
|                              GOOGLE GEMINI AI PLATFORM                            |
|   Model: gemini-1.5-flash (@google/generative-ai)                                |
|   Multi-Signal System Instruction & Active Conversation Session Memory Reuse      |
|   Hidden Step-by-Step Reasoning & Contextual "WHY" Rationale Enforcement         |
+-----------------------------------------------------------------------------------+
```

---

## 🤖 3. Core AI Features

1. **Intelligent Stadium Navigation Engine**: Multi-factor route planner evaluating starting gate, seat details (section, row, seat), live crowd density, accessibility needs, weather, walking distance, elderly visitors, and families with strollers. Outputs step-by-step directions and a dedicated **AI Route Rationale Card** explaining *why* the specific route was chosen.
2. **Gemini AI Personalized Food Recommendation Engine**: Concessions engine processing 9 criteria (seat location, budget, vegetarian, vegan, gluten-free, nut allergies, kids, wait time, crowd level) to generate personalized natural language advice explaining *why* each dish/stall matches constraints.
3. **Upgraded Zero-Hallucination Emergency System**: Understands Medical, Security, Evacuation, Fire, and Lost Child emergencies. Delivers calm guidance, recommends verified nearest First Aid stations (Sections 128, 214, 330) and Exits (Gate D, Gate A, Stairwells 1-4), prioritizes medical emergencies (`HIGHEST_CRITICAL`, 1-2 min paramedic ETA, AED portal locations), and provides instant Lost Child reunion protocols.
4. **Accessibility AI Assistant**: Specialized AI assistant supporting Wheelchair users, Elderly, Visually impaired (TTS audio guidance/audio commentary), Hearing impaired (visual strobe alerts/captions), and Families with strollers (kid food, baby care pods, family restrooms, quiet sensory lounges).
5. **AI Crowd Prediction Engine**: Estimates future turnstile congestion using Match Timing (`T-120`, `T-60`, `T-15`, `POST_MATCH`), Gate Popularity, Parking Occupancy (50%-95%), and Historical Congestion curves, recommending alternative entrances with AI reasoning.
6. **Weather Intelligence Module**: Context-aware weather engine evaluating real-time conditions (Heavy Rain, Extreme Heat, Cold/Windy, Sunny)—recommending climate-controlled indoor waiting lounges, rain-safe covered entrances, clothing advice, and extreme heat safety warnings with free hydration station locators.
7. **AI Matchday Itinerary Planner**: Personalized timeline engine generating a complete 8-step stadium visit plan optimized for crowd avoidance (Arrival Time, Parking Lot, Entrance Gate, Food Stop, Merchandise Shopping, Seat Arrival, Halftime Plan, Exit Strategy).
8. **Family-Focused AI Assistant**: Specialized family & child assistant recommending Kid-friendly food (Junior Champion Combo), Baby care & nursing pods, Family seating, Safe stroller routes, Quiet rest areas, and Lost child assistance.
9. **Reasoning-Driven Gemini Prompts & Zero-Generic Responses**: Every recommendation explicitly details **WHY** it was selected based on user context, completely eliminating generic template filler.
10. **Advanced Multi-Signal Prompting**: Multi-signal detection for intent, urgency, frustration, accessibility, and family travel. Instructs Gemini to think step-by-step internally while keeping raw thinking logs hidden from final user output.
11. **High-Performance AI Backend Optimization**: In-memory response caching (`utils/cache.js`) for sub-10ms response times and active Gemini conversation session reuse (`Map<sessionId, chatSession>`).
12. **Exhaustive Automated Test Suite**: 100% passing automated test suite (`test/app.test.js`) verifying all 12 backend services, security headers, rate limiters, caching layers, and accessibility assertions.

---

## 💻 4. Technologies

- **Core & Runtime**: Node.js (v18+), Express.js (v4.19)
- **AI & LLM**: Google Gemini AI SDK (`@google/generative-ai`, `gemini-1.5-flash`)
- **Frontend**: Semantic HTML5, Vanilla CSS Design System (Custom Glassmorphism, CSS Custom Tokens), ES6 JavaScript
- **Graphics & Visualization**: HTML5 Canvas 2D Pitch Engine, Vector SVG Seating Plan Map
- **Accessibility (A11y)**: W3C WCAG 2.1 AA Standards, Web Speech API (TTS Text-to-Speech Engine), ARIA Live Announcer
- **Caching & Utilities**: Custom In-Memory TTL/LRU Response Cache (`utils/cache.js`), Security Sanitizers & Input Validators

---

## ⚙️ 5. Installation & Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) installed.

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/aadhyasharma270207-lang/stadium-os-nexus.git
cd stadium-os-nexus
npm install
```

### 3. Environment Configuration
Create a `.env` file at the root of the project:
```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:
```properties
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is omitted or empty, the platform automatically activates an offline intelligent NLP solver so all features remain 100% operational.*

### 4. Run the Application
Start in production mode:
```bash
npm start
```
Or start in development mode with hot reloading:
```bash
npm run dev
```

### 5. Access Dashboard
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 6. Environment Variables

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | Optional | `3000` | Port number on which the Express server listens. |
| `GEMINI_API_KEY` | Optional | `""` | Google Generative AI API key for Gemini 1.5 Flash. |
| `NODE_ENV` | Optional | `"development"` | Application environment (`development` or `production`). |

---

## 📸 7. Screenshots & UI Showcase

```text
+-----------------------------------------------------------------------------------+
|  🏆 FIFA 2026 Stadium Nexus Header                     [A-] [A] [A+] [◑] [EN] [🚨 SOS] |
+-----------------------------------------------------------------------------------+
|  [🎯 Calculate Intelligent Route]       |   [🏟️ Stadium 2D Interactive Pitch Map] |
|  Gate: [Gate B ▼] Section: [104]        |   +---------------------------------+   |
|  Weather: [Heavy Rain ▼]                |   |        (Gate A - North)         |   |
|  [x] Wheelchair  [x] Senior  [x] Family |   |      /                   \      |   |
|  [Find Intelligent Smart Route 🚀]      |   | (Gate D) [  PITCH  ] (Gate B) |   |
|                                         |   |      \                   /      |   |
|  🤖 AI Route Selection Rationale:        |   |        (Gate C - South)         |   |
|  • Rerouted from Gate B (35m wait).     |   +---------------------------------+   |
|  • Selected Gate D (2m wait, step-free).|   | 🟢 Gate A  🔴 Gate B  🔵 Gate D |   |
+-----------------------------------------+-----------------------------------------+
|  🍔 Gemini AI Personalized Food Finder  |   📅 AI Matchday Itinerary Planner      |
|  Section: [104] Budget: [$15]           |   Group: [Family with Children]         |
|  [x] Vegan  [x] Gluten-Free  [x] Nut-Free|   [Generate Matchday Itinerary 📅]      |
|  Recommended: Green Pitch Vegan Bowl   |   T-105m: Arrive at Lot C               |
|  WHY: Fits $15 budget, 2m wait, Sec 112 |   T-90m:  Enter Gate D West Fast-Track  |
+-----------------------------------------+-----------------------------------------+
```

---

## 🚀 8. Deployment Guide

### Deployment on Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root directory.
3. Configure `GEMINI_API_KEY` in the Vercel Project Environment Settings.

### Deployment on Render / Railway
1. Create a new **Web Service** pointing to your repository.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add `GEMINI_API_KEY` under Environment Variables.

### Deployment with Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

---

## 🔮 9. Future Scope

1. **🎫 NFC & Mobile Pass Integration**: Automatically load digital match tickets to extract seat numbers and draw walking paths instantly upon entry.
2. **🛰️ Ultra-Wideband (UWB) Indoor Positioning**: 10cm-accurate indoor positioning rendering moving location dots inside concourses.
3. **🍕 Express Mobile Order & Pay**: In-seat concession ordering with push pings when food is ready for pick-up.
4. **🕶️ WebAR Corridors Navigation**: Augmented reality camera view overlaying green directional arrows onto physical stadium corridors.

---

## 🎯 10. Prompt Engineering Strategy

The Smart Stadium Assistant utilizes an advanced multi-signal prompt engineering strategy engineered specifically for Google Gemini 1.5 Flash:

### 1. Ground-Truth Data Binding
To prevent hallucinations during high-stress stadium visits, system instructions bind Gemini directly to verified stadium telemetry (gate names, wait times, exact food pricing, section numbers, emergency phone extensions `Ext 911-MED` / `Ext 911-SEC` / `Ext 404-LOST`).

### 2. Multi-Signal Detection & Behavioral Directives
- **Urgency Signal**: Detects medical distress, injury, cardiac arrest, fire, or panic, instantly switching to a calm, step-by-step emergency protocol prioritizing 1-2 min paramedic dispatch and AED defibrillator locations.
- **Frustration Signal**: Detects fan annoyance regarding turnstile queues or traffic delays, providing immediate empathy and low-queue bypass recommendations.
- **Accessibility Signal**: Intercepts wheelchair, senior, visual, or hearing cues, tailoring step-free routes, audio commentary streams, and visual text screen guidance.
- **Family Travel Signal**: Intercepts stroller, infant, or child cues, recommending wide concourse lanes, quiet sensory rooms (Section 215), and Junior Kid Combos.

### 3. Hidden Step-by-Step Internal Reasoning
System prompts instruct Gemini to execute internal step-by-step chain-of-thought reasoning before outputting final answers, while strictly stripping raw thinking tags (`<think>`) from user-facing responses.

### 4. Explicit "WHY" Rationale Enforcement
System prompts mandate that every recommendation state the exact **WHY** reasoning (e.g. *"I recommend Gate A because turnstile wait queue is currently 4 minutes (bypassing Gate B's 35-minute delay) and connects directly to your Lot A parking spot"*), completely eliminating generic template responses.

---

## 📄 License

This project is licensed under the **MIT License**. Created for the FIFA World Cup 2026 MetLife Stadium Host Venue.
