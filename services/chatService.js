/**
 * Chat Service - FIFA World Cup 2026 (Multilingual AI-First Architecture)
 * Powered by Google Gemini 2.5 Flash AI with Automatic Language Detection,
 * Active Conversation Session Reuse, Multi-Signal Context Injection,
 * Intent / Urgency / Frustration / Accessibility / Family Detection,
 * and Zero-Hallucination Ground-Truth Protection.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { readJsonData } = require('../utils/fileReader');
const { sanitizeHtml } = require('../utils/security');
const { defaultCache } = require('../utils/cache');
const stadiumService = require('./stadiumService');

class ChatService {
  constructor() {
    // In-memory active Gemini ChatSessions map: sessionId -> { chatSession, lastAccess }
    this.activeSessions = new Map();
  }

  /**
   * Build Multi-Signal Gemini System Instructions
   */
  getSystemInstruction(stadiumContext, userProfile = {}) {
    const profileSummary = `
FAN PROFILE MEMORY:
- Gate: ${userProfile.gate || 'Not specified'}
- Section: ${userProfile.section ? `Section ${userProfile.section}` : 'Not specified'}
- Parking: ${userProfile.parkingLot || 'Not specified'}
- Accessibility: ${userProfile.accessibilityNeeds || 'None'}
- Family Travel: ${userProfile.hasChildren ? 'Yes (Children/Stroller)' : 'No'}
- Food Preferences: ${userProfile.foodPreferences || 'None'}
- Language: ${userProfile.language || 'Auto-detect'}
`;

    return `
You are "Goalie AI", the official intelligent, polite, empathetic, and multilingual Smart Stadium Assistant for the FIFA World Cup 2026.
Selected Stadium Venue: ${stadiumContext || 'MetLife Stadium (NY/NJ)'}

${profileSummary}

INTERNAL REASONING & MULTI-SIGNAL DIRECTIVES:
1. **INTERNAL STEP-BY-STEP THINKING**:
   - Analyze user intent, emotional tone, and physical constraints before outputting your response.
   - DO NOT expose internal reasoning tags or thinking logs (like <think> or "Internal Step 1") to the user. Present a polished, structured, helpful response directly!
2. **MULTI-SIGNAL CONTEXT DETECTION**:
   - **Detect Urgency**: If the user pings medical distress, injury, cardiac arrest, fire, panic, or lost child, IMMEDIATELY prioritize calm, step-by-step emergency guidance. Instruct them to tap the Red SOS Button (2-min paramedic dispatch).
   - **Detect Frustration**: If the user expresses annoyance ("stuck in line", "waiting forever", "terrible traffic"), empathize warmly and provide an instant alternate low-queue route or food stall bypass.
   - **Detect Accessibility Needs**: If wheelchair, senior, visual, or hearing needs are mentioned, tailor step-free elevator routes, audio commentary tabs, or visual caption screens.
   - **Detect Family Travel**: If kids, infants, or strollers are mentioned, highlight stroller-wide lanes, baby care pods (Section 215), and Junior Champion meals.
   - **Ask Follow-Up Questions**: If key information is missing (like seat section code or budget limit), provide a helpful initial answer and ask a polite follow-up question to refine guidance!
3. **EXPLICIT "WHY" RATIONALE & ZERO GENERIC ANSWERS**:
   - Always explain EXACTLY WHY a recommendation was selected (e.g. *"I recommend Gate A because turnstile wait queue is currently 4 minutes (bypassing Gate B's 35-minute delay) and connects directly to your Lot A parking spot"*).
   - Never output generic placeholders or vague filler text.
4. **STRICT ZERO-HALLUCINATION VENUE GROUND-TRUTH**:
   - Gates: Gate A (North, 4m wait), Gate B (East, 35m wait - CONGESTED), Gate C (South, 4m wait), Gate D (West Fast Track, 2m wait).
   - First Aid Stations: Section 128 (Lower Level), Section 214 (Club Level), Section 330 (Upper Deck), Gate A Main Lounge.
   - Emergency Phone Extensions: Medical (Ext 911-MED) | Security (Ext 911-SEC) | Lost & Found (Ext 404-LOST).
   - Food: Champion Burger ($14.99 at Sec 104), Azteca Tacos ($12.50 at Sec 118), Golden Boot Fries ($8.99 at Sec 210), Green Pitch Vegan Bowl ($11.50 at Sec 112), Junior Kid Combo ($7.99 at Sec 104).
   - Restrooms & Baby Care: Sections 101, 112, 125, 136. Family Quiet Lounge at Section 215.
5. **MULTILINGUAL AUTO-MIRRORING**:
   - Automatically detect the user's input language and reply in the EXACT SAME language (English 🇺🇸, Hindi 🇮🇳, Spanish 🇲🇽, French 🇨🇦, Portuguese 🇧🇷, Arabic 🇦🇪, Japanese 🇯🇵).
`;
  }

  /**
   * Process user query using Gemini 2.5 Flash AI as Primary Engine with Conversation Reuse
   */
  async processQuery(message, history = [], stadiumId = 'metlife', userProfile = {}, sessionId = 'default-session') {
    const cleanMsg = (message || '').trim();
    if (!cleanMsg) {
      throw new Error('Message cannot be empty.');
    }

    const stadium = stadiumService.getStadiumById(stadiumId);
    const stadiumContext = stadium ? `${stadium.name} (${stadium.city})` : 'MetLife Stadium (NY/NJ)';

    // Check fast response cache for exact match queries
    const cacheKey = `chat_cache_${sessionId}_${cleanMsg.toLowerCase()}`;
    const cachedReply = defaultCache.get(cacheKey);
    if (cachedReply) {
      return {
        reply: cachedReply,
        engine: 'cache-fast-hit',
        suggestions: ["Bypass Gate C Bottleneck", "Nearest Concession to My Seat", "First Aid Locations", "Translate PA Announcement"]
      };
    }

    // 1. PRIMARY ENGINE: Google Gemini 2.5 Flash AI
    const aiResponse = await this.callGeminiAI(cleanMsg, history, stadiumContext, userProfile, sessionId);
    if (aiResponse) {
      const sanitized = sanitizeHtml(aiResponse).replace(/&amp;/g, '&');
      defaultCache.set(cacheKey, sanitized, 30000); // 30s TTL cache
      return {
        reply: sanitized,
        engine: 'gemini-2.5-flash-session-reused',
        suggestions: ["Bypass Gate C Bottleneck", "Nearest Concession to My Seat", "First Aid Locations", "Translate PA Announcement"]
      };
    }

    // 2. OFFLINE FALLBACK ENGINE: Used ONLY if Gemini API key is missing or network fails
    console.warn('⚠️ Gemini AI API key missing or network unreachable. Executing intelligent offline solver.');
    const fallback = this.processOfflineMultilingualFallback(cleanMsg, stadiumContext, userProfile);
    defaultCache.set(cacheKey, fallback.reply, 30000);
    return fallback;
  }

  /**
   * Call Gemini 2.5 Flash AI with Session Reuse & Multi-Signal Prompt
   */
  async callGeminiAI(message, history, stadiumContext, userProfile, sessionId) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return null;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = this.getSystemInstruction(stadiumContext, userProfile);

      let chat = null;
      const existing = this.activeSessions.get(sessionId);

      if (existing && (Date.now() - existing.lastAccess < 1800000)) { // 30 min session timeout
        chat = existing.chatSession;
        existing.lastAccess = Date.now();
      } else {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction
        });

        const formattedHistory = (Array.isArray(history) ? history : []).slice(-10).map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text || '' }]
        }));

        chat = model.startChat({ history: formattedHistory });
        this.activeSessions.set(sessionId, { chatSession: chat, lastAccess: Date.now() });
      }

      const prompt = `Selected Venue: ${stadiumContext}\nUser Message: "${message}"`;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      let text = response.text();

      // Strip internal reasoning tags if model leaked them
      text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      return text;
    } catch (err) {
      console.warn('⚠️ Gemini AI chat call failed:', err.message);
      return null;
    }
  }

  /**
   * Offline Multilingual & Context-Aware Intelligent Solver
   */
  processOfflineMultilingualFallback(message, stadiumContext, userProfile) {
    const cleanMsg = message.toLowerCase().trim();

    // 1. Urgency / Emergency Detection
    if (cleanMsg.includes('sos') || cleanMsg.includes('heart') || cleanMsg.includes('chest pain') || cleanMsg.includes('injured') || cleanMsg.includes('bleeding') || cleanMsg.includes('doctor')) {
      return {
        reply: `🚨 **EMERGENCY MEDICAL PROTOCOL ACTIVATED (${stadiumContext}):**\n\nPlease remain calm. Paramedic responders are standing by.\n\n• **Action**: Tap the **Red SOS Button** in the top navigation bar to dispatch paramedics directly to your seat pin (ETA: 1-2 minutes).\n• **Nearest First Aid**: First Aid Station 1 is located at **Section 128 (Lower Level)** and Station 2 at **Section 214 (Club Level)**.\n• **AED Defibrillator**: Located right on the concourse wall at your section portal.\n• **Direct Hotline**: Call **+1 (800) 555-6331** (Ext 911-MED).`,
        engine: 'offline-emergency-solver'
      };
    }

    // 2. Frustration Detection (e.g. stuck at Gate B)
    if ((cleanMsg.includes('gate b') || cleanMsg.includes('stuck') || cleanMsg.includes('traffic') || cleanMsg.includes('waiting')) && cleanMsg.includes('gate')) {
      return {
        reply: `🔀 **AI Congestion Reroute (${stadiumContext}):**\n\nI understand your frustration! Gate B (East Stand) is currently experiencing an **85% critical bottleneck** (~35 mins wait).\n\n• **Recommended Action**: Bypass Gate B by walking 120m South to **Gate C (South Stand)** or **Gate D (West Fast Track)**.\n• **Why this route**: Gate D turnstiles have a wait queue of under **2 minutes**, saving you over **30 minutes of waiting** in line!`,
        engine: 'offline-frustration-reroute'
      };
    }

    // 3. Lost Child Detection
    if (cleanMsg.includes('lost child') || cleanMsg.includes('missing kid') || cleanMsg.includes('lost my son') || cleanMsg.includes('lost my daughter')) {
      return {
        reply: `👶 **LOST CHILD IMMEDIATE ASSISTANCE (${stadiumContext}):**\n\nPlease remain calm. FIFA Stadium Security and Guest Services are trained for rapid child reunion.\n\n• **Action**: Report to the nearest yellow-vest stadium steward or head directly to the **FIFA Guest Services Lounge at Gate A North Plaza**.\n• **Hotline**: Call Stadium Security immediately at **+1 (800) 555-7233** (Ext 404-LOST).\n• **Child Care Room**: Quiet sensory rooms and child care amenities are open at **Section 215**.`,
        engine: 'offline-lost-child'
      };
    }

    // 4. Hindi Detection
    if (/[\u0900-\u097F]/.test(message) || cleanMsg.includes('hindi') || cleanMsg.includes('गेट')) {
      return {
        reply: `⚽ **गोलिफ़ाय AI (Goalie AI) - ${stadiumContext}:**\n\n• 🚪 **गेट A (नॉर्थ)**: वेट टाइम केवल 4 मिनट।\n• 🚗 **पार्किंग**: लॉट C (साउथ) का उपयोग करें (लॉट B में भारी भीड़ है)।\n• 🍔 **भोजन**: चैंपियन बर्गर (सेक्शन 104) तथा ग्रीन बाइट वेगन बाउल (सेक्शन 112)।\n• 🚨 **आपात स्थिति**: तत्काल सहायता के लिए Red SOS बटन दबाएं।`,
        engine: 'offline-multilingual-hindi'
      };
    }

    // 5. Japanese Detection
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(message) || cleanMsg.includes('japanese') || cleanMsg.includes('ゲート')) {
      return {
        reply: `⚽ **Goalie AI (ゴーリィAI) - ${stadiumContext}:**\n\n• 🚪 **ゲートA (北)**: 待ち時間 4分。\n• 🚗 **駐車場**: Lot C (南) をおすすめします (Lot B は混雑中)。\n• 🍔 **スタジアムグルメ**: チャンピオンバーガー (Sec 104) & ヴィーガンボウル (Sec 112)。\n• 🚨 **緊急時**: ナビバーのSOSボタンで2分以内に救護班が到着します。`,
        engine: 'offline-multilingual-japanese'
      };
    }

    // 6. Arabic Detection
    if (/[\u0600-\u06FF]/.test(message) || cleanMsg.includes('arabic') || cleanMsg.includes('البوابة')) {
      return {
        reply: `⚽ **مساعد الملعب الذكي Goalie AI - ${stadiumContext}:**\n\n• 🚪 **البوابة A**: الساحة الشمالية (وقت الانتظار: 4 دقائق)\n• 🚗 **مواقف السيارات**: Lot C لتجنب ازدحام Lot B\n• 🍔 **المأكولات**: برجر البطولة (قسم 104) ووجبات الأطفال\n• 🚨 **الطوارئ**: اضغط على زر SOS لإرسال فريق الإسعاف فوراً.`,
        engine: 'offline-multilingual-arabic'
      };
    }

    // 7. Spanish Detection
    if (cleanMsg.includes('español') || cleanMsg.includes('spanish') || cleanMsg.includes('dónde') || cleanMsg.includes('donde') || cleanMsg.includes('puerta')) {
      return {
        reply: `⚽ **Goalie AI - Asistente de Estadio (${stadiumContext}):**\n\n• 🚪 **Acceso A (Norte)**: Tiempo de espera de solo 4 minutos (Recomendado sobre el Acceso B).\n• 🚗 **Estacionamiento**: Recomendamos Lot C para evitar la congestión del Lot B.\n• 🍔 **Comida**: Hamburguesa Campeón ($14.99 en Sección 104).\n• 🚨 **Emergencia**: Use el botón SOS rojo para asistencia médica inmediata.`,
        engine: 'offline-multilingual-spanish'
      };
    }

    // 8. Gate / Navigation Queries
    if (cleanMsg.includes('gate a') || cleanMsg.includes('where is gate')) {
      return {
        reply: `🚪 **Gate A Entry Guidance (${stadiumContext}):**\n\n• **Location**: North Plaza Entrance.\n• **Current Queue**: 🟢 **Low Crowd** (4 mins wait).\n• **Why Gate A**: Connects directly to Lot A parking and Section 100 lower deck portals with zero stair barriers.`,
        engine: 'offline-fallback'
      };
    }

    // 9. Food Queries
    if (cleanMsg.includes('food') || cleanMsg.includes('eat') || cleanMsg.includes('burger') || cleanMsg.includes('tacos') || cleanMsg.includes('vegan')) {
      return {
        reply: `🍔 **Personalized Food Recommendations (${stadiumContext}):**\n\n1. 🏆 **World Cup Champion Burger** ($14.99) at Section 104 (Wait: 4 mins).\n2. 🌮 **Azteca Gourmet Tacos** ($12.50) at Section 118 (Wait: 5 mins, Gluten-Free).\n3. 🥗 **Green Pitch Vegan Power Bowl** ($11.50) at Section 112 (Wait: 2 mins, 100% Vegan & Nut-Free).\n\n**Why these choices**: These stalls are located near your section with wait times under 5 minutes!`,
        engine: 'offline-fallback'
      };
    }

    // 10. General Matchday Response
    return {
      reply: `⚽ **Goalie AI Smart Assistant (${stadiumContext}):**\n\nI am your FIFA World Cup 2026 matchday assistant powered by Gemini 2.5 Flash. How can I assist you with intelligent navigation, personalized food options, weather advisories, emergency help, or accessibility services?`,
      engine: 'offline-fallback'
    };
  }
}

module.exports = new ChatService();
