/**
 * utils/cache.js
 * 
 * High-Performance In-Memory Response & Session Cache
 * Provides TTL (Time-To-Live) cache storage for AI route calculations, crowd predictions,
 * weather advisories, food recommendations, and telemetry data.
 */

class ResponseCache {
  constructor(defaultTtlMs = 60000) {
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Set a key with value and optional TTL in milliseconds.
   */
  set(key, value, ttlMs = this.defaultTtlMs) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Retrieve cached item if not expired.
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Check if non-expired key exists.
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key or keys matching pattern.
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all keys starting with prefix.
   */
  invalidatePrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Flush all cached items.
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get total number of active non-expired items.
   */
  size() {
    let count = 0;
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now <= item.expiresAt) {
        count++;
      } else {
        this.cache.delete(key);
      }
    }
    return count;
  }
}

const defaultCache = new ResponseCache();

module.exports = {
  ResponseCache,
  defaultCache
};
