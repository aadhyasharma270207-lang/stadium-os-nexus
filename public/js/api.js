/**
 * public/js/api.js
 * 
 * Modular API client wrappers for communicating with the Node.js/Express backend.
 * Provides resilient try-catch wrappers for chatbot, translations, and stadium telemetry.
 */

const API = {
  /**
   * Fetches real-time stadium sensors and telemetry database.
   * @returns {Promise<Object>} Sensor data containing schedule, parking, food queues, and safety contacts.
   */
  async fetchStadiumData() {
    try {
      const response = await fetch("/api/stadium-data");
      
      if (!response.ok) {
        throw new Error(`HTTP telemetry error: status ${response.status}`);
      }
      
      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || "Failed to parse telemetry data payload.");
      }
      
      return payload.data;
    } catch (error) {
      console.error("❌ API.fetchStadiumData failed:", error);
      throw error; // Propagate error so UI can display offline alerts
    }
  },

  /**
   * Sends user question to Gemini AI or fallback NLP simulation.
   * @param {string} userMessage - Text entered by the fan.
   * @returns {Promise<Object>} Server reply and query source (Gemini/Fallback).
   */
  async sendChatMessage(userMessage) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP chat error: status ${response.status}`);
      }
      
      const payload = await response.json();
      return {
        reply: payload.reply,
        source: payload.source,
        engine: payload.engine
      };
    } catch (error) {
      console.error("❌ API.sendChatMessage failed:", error);
      throw error;
    }
  },

  /**
   * Translates stadium announcements into target languages.
   * @param {string} textToTranslate - The original announcement text.
   * @param {string} targetLanguageCode - E.g. 'es', 'fr', 'ar'.
   * @returns {Promise<Object>} Output translation text and source.
   */
  async translateAnnouncement(textToTranslate, targetLanguageCode) {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLang: targetLanguageCode
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP translation error: status ${response.status}`);
      }

      const payload = await response.json();
      return {
        translation: payload.translation,
        source: payload.source
      };
    } catch (error) {
      console.error("❌ API.translateAnnouncement failed:", error);
      throw error;
    }
  }
};
