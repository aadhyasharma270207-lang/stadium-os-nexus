/**
 * FIFA World Cup 2026 Smart Stadium Assistant - File Reader & In-Memory Cache Utility
 * Provides high-performance cached JSON dataset loading to eliminate disk I/O latency.
 */

const fs = require('fs');
const path = require('path');

const dataCache = new Map();

/**
 * Safely read and parse a JSON file with in-memory caching
 * @param {string} relativeFilePath - Path relative to the /data folder
 * @param {any} fallbackValue - Fallback value if reading fails
 * @returns {any} Parsed JSON data object/array
 */
function readJsonData(relativeFilePath, fallbackValue = []) {
  if (dataCache.has(relativeFilePath)) {
    return dataCache.get(relativeFilePath);
  }

  try {
    const fullPath = path.join(__dirname, '../data', relativeFilePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Warning: Data file not found at ${fullPath}`);
      return fallbackValue;
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Store in memory cache
    dataCache.set(relativeFilePath, parsed);
    return parsed;
  } catch (error) {
    console.error(`🚨 Error reading JSON data file ${relativeFilePath}:`, error.message);
    return fallbackValue;
  }
}

/**
 * Clear memory cache (useful for testing or hot data reloads)
 */
function clearCache() {
  dataCache.clear();
}

module.exports = {
  readJsonData,
  clearCache
};
