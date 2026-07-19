/**
 * FIFA World Cup 2026 Smart Assistant - Chatbot Controller
 * Powered by Google Gemini AI with Conversational Fan Memory (Gate, Seat, Parking, Food, ADA, Language)
 */

const Chatbot = {
  history: [],
  userProfile: {
    gate: null,
    section: null,
    row: null,
    seat: null,
    parkingLot: null,
    accessibilityNeeds: null,
    foodPreferences: null,
    language: 'English'
  },

  init() {
    this.chatInput = document.getElementById('chat-input-text');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.messagesScroll = document.getElementById('chat-messages-container');
    this.ttsToggle = document.getElementById('chat-tts-toggle');
    this.resetMemoryBtn = document.getElementById('reset-chat-memory-btn');

    this.bindEvents();
  },

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    if (this.resetMemoryBtn) {
      this.resetMemoryBtn.addEventListener('click', () => this.resetMemory());
    }

    // Dynamic Quick Action Chips Listener
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (chip) {
        const text = chip.getAttribute('data-query') || chip.textContent.trim();
        if (this.chatInput) {
          this.chatInput.value = text;
          this.sendMessage();
        }
      }
    });
  },

  /**
   * Automatically extract and store fan profile attributes from natural dialogue
   */
  extractMemoryFromText(text) {
    const clean = text.toLowerCase();

    // Extract Section (e.g. "Section 205", "sec 104", "sitting in 205")
    const sectionMatch = text.match(/(?:section|sec|sitting in)\s*#?([0-9]{3})/i);
    if (sectionMatch && sectionMatch[1]) {
      this.userProfile.section = sectionMatch[1];
      console.log('🧠 Memory Extracted: Section =', this.userProfile.section);
    }

    // Extract Gate (e.g. "Gate A", "Gate B")
    const gateMatch = text.match(/gate\s*([a-d])/i);
    if (gateMatch && gateMatch[1]) {
      this.userProfile.gate = `Gate ${gateMatch[1].toUpperCase()}`;
      console.log('🧠 Memory Extracted: Gate =', this.userProfile.gate);
    }

    // Extract Parking Lot (e.g. "Lot E", "Lot A", "parking in lot e")
    const parkingMatch = text.match(/lot\s*([a-e])/i);
    if (parkingMatch && parkingMatch[1]) {
      this.userProfile.parkingLot = `Lot ${parkingMatch[1].toUpperCase()}`;
      console.log('🧠 Memory Extracted: Parking Lot =', this.userProfile.parkingLot);
    }

    // Extract Accessibility Needs
    if (clean.includes('wheelchair') || clean.includes('ada') || clean.includes('step-free')) {
      this.userProfile.accessibilityNeeds = 'Wheelchair / Step-free Ramp Access';
      console.log('🧠 Memory Extracted: Accessibility =', this.userProfile.accessibilityNeeds);
    }

    // Extract Food Preferences
    if (clean.includes('taco') || clean.includes('burger') || clean.includes('vegetarian') || clean.includes('fries')) {
      this.userProfile.foodPreferences = text;
    }
  },

  resetMemory() {
    this.history = [];
    this.userProfile = {
      gate: null,
      section: null,
      row: null,
      seat: null,
      parkingLot: null,
      accessibilityNeeds: null,
      foodPreferences: null,
      language: 'English'
    };

    if (this.messagesScroll) {
      this.messagesScroll.innerHTML = `
        <div class="chat-message-bubble bot">
          ⚽ <strong>Memory Reset!</strong> I have cleared our chat history and your fan profile preferences. How can I help you today?
        </div>
      `;
    }

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader('Chat history and fan profile memory cleared');
    }
  },

  async sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    // Extract Fan Memory Attributes
    this.extractMemoryFromText(text);

    // Append User Message to UI
    this.appendMessage(text, 'user');
    this.chatInput.value = '';

    // Record User Turn in Session History
    this.history.push({ role: 'user', text });
    if (this.history.length > 12) this.history.shift();

    // Typing Indicator
    const typingId = this.appendTypingIndicator();
    const stadiumId = window.App ? window.App.state.selectedStadium : 'metlife';

    try {
      const res = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: this.history,
          stadiumId,
          userProfile: this.userProfile
        })
      });

      const responseData = await res.json();
      this.removeTypingIndicator(typingId);

      if (responseData.success && responseData.reply) {
        const botReply = responseData.reply;
        
        // Append Bot Reply to UI
        this.appendMessage(botReply, 'bot');

        // Record Bot Turn in Session History
        this.history.push({ role: 'model', text: botReply });

        // Update Dynamic Quick Suggestion Chips
        if (responseData.suggestions && Array.isArray(responseData.suggestions)) {
          this.renderDynamicChips(responseData.suggestions);
        }

        // Voice Speech Output if enabled
        if (this.ttsToggle && this.ttsToggle.checked) {
          this.speakText(botReply);
        }
      } else {
        const errorMsg = responseData.error || "Sorry, I am having trouble processing your query. Please try again.";
        this.appendMessage(errorMsg, 'bot');
      }
    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.appendMessage("Network connection error. Please check your connection.", 'bot');
    }
  },

  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  appendMessage(content, sender) {
    if (!this.messagesScroll) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-message-bubble ${sender}`;

    const cleanContent = this.escapeHtml(content);
    const formatted = cleanContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = formatted;

    this.messagesScroll.appendChild(bubble);
    this.messagesScroll.scrollTop = this.messagesScroll.scrollHeight;
  },

  renderDynamicChips(suggestions) {
    const chipsContainer = document.querySelector('.chat-quick-chips');
    if (!chipsContainer || !suggestions) return;

    chipsContainer.innerHTML = suggestions.map(s => `
      <button class="chip-btn" data-query="${this.escapeHtml(s)}">${this.escapeHtml(s)}</button>
    `).join('');
  },

  appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const bubble = document.createElement('div');
    bubble.className = 'chat-message-bubble bot';
    bubble.id = id;
    bubble.innerHTML = `<em><i class="fas fa-circle-notch fa-spin"></i> Goalie AI is thinking...</em>`;
    this.messagesScroll.appendChild(bubble);
    this.messagesScroll.scrollTop = this.messagesScroll.scrollHeight;
    return id;
  },

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    const cleanText = text.replace(/[*#🎒🎟️🍟♿🚨📶🚌⚽🤖📊🚗🚪💡🏆]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Chatbot.init();
});

window.Chatbot = Chatbot;
