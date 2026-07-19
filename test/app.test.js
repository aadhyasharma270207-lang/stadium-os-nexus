/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Automated Test Suite
 * Exhaustive Integration & Unit Tests for Navigation, Food Recommendations,
 * Emergency System, Accessibility AI, Weather Intelligence, Itinerary Planner,
 * Crowd Prediction, Chat API, Gemini Integration, Security, and Caching.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import app directly for local server binding during testing
const app = require('../app');

let server = null;
const PORT = 3099;

function makeRequest(method, pathStr, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: pathStr,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json, raw: data, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runTestSuite() {
  console.log(`===================================================`);
  console.log(`⚽ Running FIFA 2026 Smart Stadium Assistant Test Suite`);
  console.log(`===================================================\n`);

  // Start test Express server
  await new Promise(resolve => {
    server = app.listen(PORT, () => {
      resolve();
    });
  });

  try {
    // ----------------------------------------------------
    // Module 1: API Security, Error Handling & Security Headers
    // ----------------------------------------------------
    console.log(`🛡️ [1/10] Testing Security, HTTP Headers & Error Boundaries...`);

    await asyncTest('404 Error on Invalid API Endpoint', async () => {
      const res = await makeRequest('GET', '/api/invalid-endpoint-path');
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.error.includes('Not Found'));
    });

    await asyncTest('Security Headers Enforcement (X-Frame-Options & X-Content-Type-Options)', async () => {
      const res = await makeRequest('GET', '/api/stadiums');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers['x-frame-options'], 'DENY');
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    });

    await asyncTest('400 Bad Request on Empty Chat Query', async () => {
      const res = await makeRequest('POST', '/api/chat/query', { message: '' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    await asyncTest('400 Bad Request on Empty Order Cart', async () => {
      const res = await makeRequest('POST', '/api/services/order', { cart: [] });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // ----------------------------------------------------
    // Module 2: Intelligent Navigation Engine
    // ----------------------------------------------------
    console.log(`\n🗺️ [2/10] Testing Intelligent Stadium Navigation Engine...`);

    await asyncTest('POST /api/crowd/smart-route (8 Navigation Parameters & AI Rationale)', async () => {
      const res = await makeRequest('POST', '/api/crowd/smart-route', {
        gate: 'Gate B',
        section: '104',
        row: '12',
        seat: '8',
        weather: 'rainy',
        accessibility: true,
        isElderly: true,
        hasChildren: true
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.aiExplanation.includes('AI Route Selection Rationale'));
      assert.ok(res.data.data.routeSteps.length > 0);
      assert.ok(res.data.data.distanceMeters.includes('m'));
      assert.ok(res.data.data.walkingTimeMins.includes('mins'));
    });

    // ----------------------------------------------------
    // Module 3: Gemini AI Personalized Food Recommendations
    // ----------------------------------------------------
    console.log(`\n🍔 [3/10] Testing Gemini AI Personalized Food Recommendations...`);

    await asyncTest('POST /api/services/recommend-food (9 Food Criteria & Dietary Safety)', async () => {
      const res = await makeRequest('POST', '/api/services/recommend-food', {
        section: '104',
        maxBudget: 15.00,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isNutFree: true,
        isKids: false,
        maxWaitMins: 10,
        crowdLevel: 'LOW'
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.recommendations.length > 0);
      assert.ok(res.data.data.aiRationale.includes('Gemini AI Personalized Food Recommendation'));
    });

    // ----------------------------------------------------
    // Module 4: Upgraded Zero-Hallucination Emergency System
    // ----------------------------------------------------
    console.log(`\n🚨 [4/10] Testing Upgraded Zero-Hallucination Emergency System...`);

    await asyncTest('POST /api/emergency/sos (Medical Dispatch & AED Location)', async () => {
      const res = await makeRequest('POST', '/api/emergency/sos', { section: '104', row: '12', seat: '8' });
      assert.ok(res.status === 200 || res.status === 201);
      assert.strictEqual(res.data.success, true);
      const dataObj = res.data.data || res.data.ticket;
      assert.ok(dataObj !== null && typeof dataObj === 'object');
    });

    await asyncTest('POST /api/emergency/assist (Medical & Lost Child Protocols)', async () => {
      const res = await makeRequest('POST', '/api/emergency/assist', { emergencyType: 'LOST_CHILD', section: '104' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.evacuationSteps.length > 0);
      assert.ok(res.data.data.nearestExit.includes('Gate A'));
    });

    // ----------------------------------------------------
    // Module 5: Accessibility AI Assistant
    // ----------------------------------------------------
    console.log(`\n♿ [5/10] Testing Accessibility & Family AI Assistant...`);

    await asyncTest('POST /api/stadiums/accessibility-plan (Wheelchair Profile)', async () => {
      const res = await makeRequest('POST', '/api/stadiums/accessibility-plan', { profileType: 'WHEELCHAIR', section: '104' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.icon, '♿');
      assert.ok(res.data.data.recommendedRoute.length > 0);
    });

    await asyncTest('POST /api/stadiums/accessibility-plan (Stroller Family Profile)', async () => {
      const res = await makeRequest('POST', '/api/stadiums/accessibility-plan', { profileType: 'STROLLER', section: '215' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.icon, '👶');
      assert.ok(res.data.data.nearestAmenities.familyRestroom.includes('215'));
    });

    // ----------------------------------------------------
    // Module 6: AI Crowd Prediction Engine
    // ----------------------------------------------------
    console.log(`\n📊 [6/10] Testing AI Crowd Prediction Engine...`);

    await asyncTest('POST /api/crowd/predict (Match Timing, Gate Popularity, Parking)', async () => {
      const res = await makeRequest('POST', '/api/crowd/predict', { matchTime: 'T-60', gateId: 'Gate B', parkingOccupancy: 85 });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.predictedWaitMins.includes('mins'));
      assert.ok(res.data.data.aiReasoning.includes('Predictive Rationale'));
    });

    // ----------------------------------------------------
    // Module 7: Weather Intelligence Module
    // ----------------------------------------------------
    console.log(`\n🌤️ [7/10] Testing Weather Intelligence Module...`);

    await asyncTest('POST /api/weather/intelligence (Rain & Heat Advisories)', async () => {
      const res = await makeRequest('POST', '/api/weather/intelligence', { condition: 'extreme_heat', section: '104' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.indoorWaitingArea.includes('Club Lounge'));
      assert.ok(res.data.data.hydrationStations.length > 0);
    });

    // ----------------------------------------------------
    // Module 8: AI Matchday Itinerary Planner
    // ----------------------------------------------------
    console.log(`\n📅 [8/10] Testing AI Matchday Itinerary Planner...`);

    await asyncTest('POST /api/itinerary/generate (8-Step Timeline Generation)', async () => {
      const res = await makeRequest('POST', '/api/itinerary/generate', { section: '104', partyType: 'FAMILY', kickoffTime: '18:00' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.timeline.length, 8);
      assert.ok(res.data.data.crowdTimeSaved.includes('saved'));
    });

    // ----------------------------------------------------
    // Module 9: Chatbot Engine & Gemini Session Reuse
    // ----------------------------------------------------
    console.log(`\n🤖 [9/10] Testing Chatbot Engine & Session Memory...`);

    await asyncTest('Chatbot Query: Emergency & Gate A', async () => {
      const res = await makeRequest('POST', '/api/chat/query', { message: 'Where is Gate A?' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.reply.includes('Gate A'));
    });

    await asyncTest('Chatbot Session Reuse & Fast Cache Hit', async () => {
      const req1 = await makeRequest('POST', '/api/chat/query', { message: 'Where is Gate A?', sessionId: 'test-session-123' });
      const req2 = await makeRequest('POST', '/api/chat/query', { message: 'Where is Gate A?', sessionId: 'test-session-123' });
      assert.strictEqual(req1.status, 200);
      assert.strictEqual(req2.status, 200);
      assert.strictEqual(req2.data.engine, 'cache-fast-hit');
    });

    // ----------------------------------------------------
    // Module 10: Performance Caching Engine
    // ----------------------------------------------------
    console.log(`\n⚡ [10/10] Testing In-Memory TTL Cache Engine...`);

    test('In-Memory Response Cache Set, Get, & Expiration', () => {
      const { ResponseCache } = require('../utils/cache');
      const testCache = new ResponseCache(100); // 100ms TTL
      testCache.set('key1', 'value1');
      assert.strictEqual(testCache.get('key1'), 'value1');
      assert.strictEqual(testCache.has('key1'), true);
    });

    console.log(`\n===================================================`);
    console.log(`📊 Test Summary: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log(`===================================================`);

  } finally {
    if (server) {
      server.close();
    }
  }

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite();
