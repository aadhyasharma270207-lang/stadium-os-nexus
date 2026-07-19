/**
 * public/js/ui.js
 * 
 * DOM Interface Controller for the FIFA World Cup 2026 Smart Stadium Assistant.
 * Orchestrates rendering, SVG updates, focus trapping, translations, and voice synthesis.
 */

const UI = {
  // DOM Cache
  elements: {
    // Accessibility & Settings
    html: document.documentElement,
    body: document.body,
    langSelector: document.getElementById("lang-selector"),
    btnContrast: document.getElementById("btn-contrast-toggle"),
    btnFontDec: document.getElementById("btn-font-decrease"),
    btnFontInc: document.getElementById("btn-font-increase"),
    btnFontReset: document.getElementById("btn-font-reset"),
    srAnnouncer: document.getElementById("sr-announcer"),

    // Navigation Links
    navLinks: document.querySelectorAll(".nav-link"),
    btnSosTrigger: document.getElementById("btn-sos-trigger"),

    // Seating Map
    seatForm: document.getElementById("seat-search-form"),
    seatInput: document.getElementById("seat-input"),
    seatError: document.getElementById("seat-error-feedback"),
    seatResults: document.getElementById("seat-route-details"),
    standSelectButtons: document.querySelectorAll(".btn-stand"),
    stadiumSvg: document.getElementById("stadium-svg"),
    inspectFeedback: document.getElementById("inspect-feedback-box"),
    routeAlertBar: document.getElementById("route-alert-bar"),
    alertTitleText: document.getElementById("alert-title-text"),
    alertDescText: document.getElementById("alert-desc-text"),

    // Map highlight nodes
    seatHighlightDot: document.getElementById("seat-highlight-dot"),
    routePathLine: document.getElementById("route-path-line"),

    // Chatbot Panel
    chatForm: document.getElementById("chat-input-form"),
    chatInput: document.getElementById("chat-message-input"),
    chatLog: document.getElementById("chat-conversation"),
    chatChips: document.querySelectorAll(".chat-chip, .chat-chip-danger"),

    // Parking & Foods & Matches Containers
    parkingGrid: document.getElementById("parking-lots-grid"),
    foodGrid: document.getElementById("food-stalls-grid"),
    matchGrid: document.getElementById("match-fixtures-container"),
    matchSearchInput: document.getElementById("schedule-search-input"),
    btnClearMatchFilter: document.getElementById("btn-clear-schedule-filter"),
    gateMetricsContainer: document.getElementById("gate-metrics-container"),

    // Announcement Translator
    btnTranslate: document.getElementById("btn-translate-announcement"),
    presetSelect: document.getElementById("announcement-preset-select"),
    customAnnounceWrapper: document.getElementById("custom-announcement-wrapper"),
    customAnnounceInput: document.getElementById("announcement-custom-input"),
    targetLangSelect: document.getElementById("announcement-target-select"),
    translationResult: document.getElementById("translation-result-box"),
    translationOutput: document.getElementById("translation-output-text"),
    btnAnnounceSpeech: document.getElementById("btn-announce-translation"),

    // Emergency Contacts & Accordions
    emergencyContactsList: document.getElementById("emergency-contacts-list"),
    emergencyAccordion: document.getElementById("emergency-instructions-accordion"),

    // SOS Modal
    sosModal: document.getElementById("sos-modal"),
    btnSosClose: document.getElementById("btn-close-sos"),
    btnSosDismiss: document.getElementById("btn-dismiss-sos-footer"),
    sosMedicalText: document.getElementById("sos-nearest-medical"),
    sosSecurityText: document.getElementById("sos-nearest-security")
  },

  /**
   * Initializes visual style themes (Fonts, Contrast) from State.
   */
  initStyles() {
    this.updateFontScale();
    this.updateContrastMode();
    this.elements.langSelector.value = State.language;
    this.updateDocumentDirection();
    this.translateUI();
  },

  /**
   * Escapes dangerous HTML tags in text string fields to mitigate XSS scripts.
   * @param {string} unsafeStr - The raw text message.
   * @returns {string} Safe text string.
   */
  escapeHtml(unsafeStr) {
    if (typeof unsafeStr !== "string") return unsafeStr;
    return unsafeStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /**
   * Triggers browser standard screen reader announcements.
   * @param {string} text - Message to declare.
   */
  announce(text) {
    if (this.elements.srAnnouncer) {
      this.elements.srAnnouncer.textContent = text;
    }
  },

  /**
   * Scales CSS custom property variables to modify document sizing.
   */
  updateFontScale() {
    this.elements.html.style.setProperty("--font-scale", State.fontScale);
    this.announce(`Text size adjusted to ${Math.round(State.fontScale * 100)} percent`);
  },

  /**
   * Toggles CSS high contrast overrides on the body element.
   */
  updateContrastMode() {
    if (State.highContrast) {
      this.elements.body.classList.add("high-contrast");
      this.announce("High contrast mode enabled");
    } else {
      this.elements.body.classList.remove("high-contrast");
      this.announce("High contrast mode disabled");
    }
  },

  /**
   * Flips text flow direction for Arabic RTL support.
   */
  updateDocumentDirection() {
    if (State.language === "ar") {
      this.elements.html.setAttribute("dir", "rtl");
      this.elements.html.setAttribute("lang", "ar");
    } else {
      this.elements.html.setAttribute("dir", "ltr");
      this.elements.html.setAttribute("lang", State.language);
    }
  },

  /**
   * Iterates through elements containing text translation IDs and maps values.
   */
  translateUI() {
    if (State.language === "en") {
      document.title = "FIFA World Cup 2026 - Smart Stadium Assistant";
      return;
    }
    const dict = TRANSLATIONS[State.language];
    if (!dict) return;

    // Switch title
    if (State.language === "es") {
      document.title = "Copa Mundial FIFA 2026 - Asistente de Estadio";
    } else if (State.language === "fr") {
      document.title = "Coupe du Monde de la FIFA 2026 - Assistant Stade";
    } else if (State.language === "ar") {
      document.title = "كأس العالم FIFA 2026 - مساعد الاستاد الذكي";
    }

    // Loop translations
    Object.keys(dict).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        // Safe XSS mitigation: use textContent instead of innerHTML
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = dict[id];
        } else {
          element.textContent = dict[id];
        }
      }
    });

    // Translate quick suggestions inputs
    this.elements.chatChips.forEach(chip => {
      const label = chip.getAttribute("aria-label");
      if (label.includes("Gate A")) chip.textContent = State.language === "es" ? "Dónde está la Puerta A?" : State.language === "fr" ? "Où est la Porte A?" : State.language === "ar" ? "أين البوابة A؟" : "Where is Gate A?";
      if (label.includes("B12")) chip.textContent = State.language === "es" ? "Ruta al Asiento B12" : State.language === "fr" ? "Rejoindre le siège B12" : State.language === "ar" ? "كيف أصل للمقعد B12؟" : "Route to Seat B12";
      if (label.includes("washroom")) chip.textContent = State.language === "es" ? "Baño más cercano?" : State.language === "fr" ? "Sanitaires les plus proches?" : State.language === "ar" ? "أين دورة المياه القريبة؟" : "Nearest washroom?";
      if (label.includes("park")) chip.textContent = State.language === "es" ? "Dónde estacionar?" : State.language === "fr" ? "Où se garer?" : State.language === "ar" ? "أين يمكنني إيقاف السيارة؟" : "Where to park?";
      if (label.includes("food")) chip.textContent = State.language === "es" ? "Puestos sin cola" : State.language === "fr" ? "Stands sans attente" : State.language === "ar" ? "مطاعم بدون انتظار" : "Shortest lines food";
      if (label.includes("SOS")) chip.textContent = State.language === "es" ? "🚨 SOS Auxilio Médico" : State.language === "fr" ? "🚨 SOS Aide Médicale" : State.language === "ar" ? "🚨 SOS مساعدة طبية" : "🚨 SOS Medical Support";
    });

    this.announce(`Language changed to ${State.language}`);
  },

  // ----------------------------------------------------
  // Dynamic Sensor Renderers
  // ----------------------------------------------------

  /**
   * Renders the upcoming match cards with filter support.
   */
  renderMatches(fixtures, filterTeam = "") {
    if (!this.elements.matchGrid) return;
    this.elements.matchGrid.innerHTML = "";

    const cleanFilter = filterTeam.toLowerCase().trim();

    const filtered = fixtures.filter(m => {
      if (!cleanFilter) return true;
      return m.homeTeam.toLowerCase().includes(cleanFilter) || m.awayTeam.toLowerCase().includes(cleanFilter);
    });

    if (filtered.length === 0) {
      this.elements.matchGrid.innerHTML = `<div class="inspect-feedback" style="grid-column: 1/-1;">No matching World Cup matches found.</div>`;
      return;
    }

    filtered.forEach(m => {
      const isLive = m.status.includes("Live");
      const card = document.createElement("div");
      card.className = `match-card ${isLive ? "live" : ""}`;
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${this.escapeHtml(m.homeTeam)} versus ${this.escapeHtml(m.awayTeam)}, Stage: ${this.escapeHtml(m.stage)}. Status: ${this.escapeHtml(m.status)}`);

      card.innerHTML = `
        <div class="match-stage">${this.escapeHtml(m.stage)}</div>
        <div class="match-teams-row">
          <div class="match-team">
            <span class="team-flag" aria-hidden="true">${this.escapeHtml(m.homeFlag)}</span>
            <span class="team-name">${this.escapeHtml(m.homeTeam)}</span>
          </div>
          <span class="match-vs">VS</span>
          <div class="match-team">
            <span class="team-flag" aria-hidden="true">${this.escapeHtml(m.awayFlag)}</span>
            <span class="team-name">${this.escapeHtml(m.awayTeam)}</span>
          </div>
        </div>
        <div class="match-time-badge">
          ${isLive ? `<span class="live-dot" style="width: 8px; height: 8px; background: red; display: inline-block; border-radius: 50%; margin-right: 6px; animation: pulse-emergency 1.5s infinite;"></span>` : ""}
          ${isLive ? "LIVE NOW" : this.escapeHtml(new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
        </div>
      `;
      this.elements.matchGrid.appendChild(card);
    });
  },

  /**
   * Renders the dynamic crowd density levels for Gates A, B, C, D.
   */
  renderGateCrowds(alerts) {
    if (!this.elements.gateMetricsContainer) return;
    this.elements.gateMetricsContainer.innerHTML = "";

    const gates = [
      { id: "A", name: "Gate A (North Stand)", waitTime: 3, occupancy: 45 },
      { id: "B", name: "Gate B (East Stand)", waitTime: 35, occupancy: 85 },
      { id: "C", name: "Gate C (South Stand)", waitTime: 4, occupancy: 30 },
      { id: "D", name: "Gate D (West Stand)", waitTime: 2, occupancy: 20 }
    ];

    gates.forEach(gate => {
      const isFull = gate.occupancy >= 80;
      const isWarning = gate.occupancy >= 60 && gate.occupancy < 80;
      
      const item = document.createElement("div");
      item.className = "gate-metric-item";
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `${gate.name}. Wait queue: ${gate.waitTime} minutes. Density: ${gate.occupancy} percent.`);

      let severityClass = "success";
      let statusTag = State.language === "es" ? "Despejado" : State.language === "fr" ? "Fluide" : State.language === "ar" ? "واضح" : "Clear";
      
      if (isFull) {
        severityClass = "danger";
        statusTag = State.language === "es" ? "Congestionado" : State.language === "fr" ? "Surchargé" : State.language === "ar" ? "مزدحم" : "Congested";
      } else if (isWarning) {
        severityClass = "warning";
        statusTag = State.language === "es" ? "Moderado" : State.language === "fr" ? "Modéré" : State.language === "ar" ? "متوسط" : "Moderate";
      }

      item.innerHTML = `
        <div class="gate-metric-header">
          <span class="gate-metric-name">${this.escapeHtml(gate.name)}</span>
          <span class="badge ${isFull ? "badge-danger" : "badge-success"}">${this.escapeHtml(statusTag)} (${gate.waitTime}m)</span>
        </div>
        <div class="progress-bar-container" aria-hidden="true">
          <div class="progress-bar ${severityClass}" style="width: ${gate.occupancy}%;"></div>
        </div>
      `;
      this.elements.gateMetricsContainer.appendChild(item);
    });
  },

  /**
   * Renders the dynamic parking cards containing occupancy meters.
   */
  renderParking(lots) {
    if (!this.elements.parkingGrid) return;
    this.elements.parkingGrid.innerHTML = "";

    lots.forEach(lot => {
      const percentage = Math.round((lot.occupiedSpaces / lot.totalSpaces) * 100);
      const isFull = percentage >= 85;
      
      const card = document.createElement("div");
      card.className = "parking-card glass-panel";
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${this.escapeHtml(lot.name)}. Pricing: ${this.escapeHtml(lot.pricing)}. Capacity: ${percentage} percent full.`);

      card.innerHTML = `
        <div class="parking-header">
          <h3>${this.escapeHtml(lot.name)}</h3>
          <span class="badge ${isFull ? "badge-danger" : "badge-success"}">${isFull ? "High Congestion" : "Spaces Clear"}</span>
        </div>
        <div class="parking-body">
          <div class="capacity-bar-wrapper">
            <div class="capacity-labels">
              <span>Occupancy</span>
              <strong>${lot.occupiedSpaces} / ${lot.totalSpaces} spaces</strong>
            </div>
            <div class="progress-bar-container" aria-hidden="true">
              <div class="progress-bar ${isFull ? "danger" : "success"}" style="width: ${percentage}%;"></div>
            </div>
          </div>
          <ul class="parking-features">
            ${lot.features.map(f => `<li>• ${this.escapeHtml(f)}</li>`).join("")}
          </ul>
        </div>
        <div class="parking-footer">
          <span class="price-tag">${this.escapeHtml(lot.pricing)} / Match</span>
        </div>
      `;
      this.elements.parkingGrid.appendChild(card);
    });
  },

  /**
   * Renders concession food stall widgets.
   */
  renderFoodStalls(stalls) {
    if (!this.elements.foodGrid) return;
    this.elements.foodGrid.innerHTML = "";

    stalls.forEach(stall => {
      let queueClass = "low";
      if (stall.waitTime > 10) queueClass = "moderate";
      if (stall.waitTime > 20) queueClass = "high";

      const card = document.createElement("div");
      card.className = "food-card glass-panel";
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${this.escapeHtml(stall.name)}. Wait time: ${stall.waitTime} minutes.`);

      card.innerHTML = `
        <h3>${this.escapeHtml(stall.name)}</h3>
        <span class="food-cuisine">${this.escapeHtml(stall.cuisine)}</span>
        <p class="panel-desc">📍 ${this.escapeHtml(stall.location)}</p>
        <div class="food-waitTime-box ${queueClass}">
          🕒 Queue Wait: ${stall.waitTime} mins (${this.escapeHtml(stall.crowdLevel)} Crowd)
        </div>
        <ul class="food-features">
          ${stall.features.map(f => `<li>${this.escapeHtml(f)}</li>`).join("")}
        </ul>
      `;
      this.elements.foodGrid.appendChild(card);
    });
  },

  /**
   * Renders the contacts directory.
   */
  renderSafetyDetails(safety) {
    if (this.elements.emergencyContactsList) {
      this.elements.emergencyContactsList.innerHTML = "";
      safety.contacts.forEach(c => {
        const row = document.createElement("div");
        row.className = "contact-row-card";
        row.innerHTML = `
          <span class="contact-label">${this.escapeHtml(c.label)}</span>
          <a href="tel:${this.escapeHtml(c.phone.replace(/[^0-9+]/g, ""))}" class="btn-call-link" aria-label="Call ${this.escapeHtml(c.label)} at ${this.escapeHtml(c.readable)}">${this.escapeHtml(c.phone)}</a>
        `;
        this.elements.emergencyContactsList.appendChild(row);
      });
    }

    if (this.elements.emergencyAccordion) {
      this.elements.emergencyAccordion.innerHTML = "";
      safety.instructions.forEach((ins, idx) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = `
          <button class="accordion-header" aria-expanded="false" aria-controls="safety-step-body-${idx}">
            <span>${this.escapeHtml(ins.title)}</span>
            <span class="accordion-icon" aria-hidden="true">▼</span>
          </button>
          <div id="safety-step-body-${idx}" class="accordion-content">
            <div class="accordion-body">
              <ol>
                ${ins.steps.map(s => `<li>${this.escapeHtml(s)}</li>`).join("")}
              </ol>
            </div>
          </div>
        `;
        this.elements.emergencyAccordion.appendChild(item);
      });

      // Bind local accordions click
      document.querySelectorAll(".accordion-header").forEach(btn => {
        btn.addEventListener("click", () => {
          const item = btn.parentElement;
          const content = btn.nextElementSibling;
          const expanded = btn.getAttribute("aria-expanded") === "true";
          
          // Collapse other active accordion elements
          document.querySelectorAll(".accordion-item").forEach(other => {
            if (other !== item) {
              other.classList.remove("active");
              other.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
              other.querySelector(".accordion-content").style.maxHeight = null;
            }
          });

          // Toggle current
          btn.setAttribute("aria-expanded", !expanded);
          if (!expanded) {
            item.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            item.classList.remove("active");
            content.style.maxHeight = null;
          }
        });
      });
    }
  },

  // ----------------------------------------------------
  // Interactive Stadium Map Drawing
  // ----------------------------------------------------

  /**
   * Highlights specific stands and shows metadata in the map inspector.
   */
  selectStadiumStand(standName) {
    // Reset selections on all stands
    const stands = this.elements.stadiumSvg.querySelectorAll(".stadium-stand");
    stands.forEach(s => s.classList.remove("stand-selected"));

    // Reset selected gates
    const markers = this.elements.stadiumSvg.querySelectorAll(".gate-marker");
    markers.forEach(m => m.classList.remove("gate-marker-selected"));

    // Select the new target stand path
    const targetPath = this.elements.stadiumSvg.getElementById(`stand-${standName}`);
    if (targetPath) {
      targetPath.classList.add("stand-selected");
    }

    // Set inspection message
    const gateLetters = { North: "A", East: "B", South: "C", West: "D" };
    const gate = gateLetters[standName];
    const gateMarker = this.elements.stadiumSvg.getElementById(`gate-node-${gate}`)?.querySelector(".gate-marker");
    if (gateMarker) {
      gateMarker.classList.add("gate-marker-selected");
    }

    let capacityText = "";
    if (standName === "North") capacityText = "Capacity: **45%** (Low crowding). Restrooms located next to Section 101.";
    if (standName === "East") capacityText = "Capacity: **85%** (Congested). Restrooms next to Section 112. Seat B12 is here.";
    if (standName === "South") capacityText = "Capacity: **30%** (Spaces clear). Restrooms next to Section 125. Transit hub.";
    if (standName === "West") capacityText = "Capacity: **75%** (Moderate traffic). Restrooms next to Section 136.";

    this.elements.inspectFeedback.innerHTML = `📍 **Stand Selected: ${standName} Stand**<br>${capacityText}<br>Closest Entry Gate: **Gate ${gate}**.`;
    this.announce(`${standName} Stand selected. Closest gate is Gate ${gate}.`);
    
    // Update local SOS points if SOS was opened
    const safetyPoints = State.getSafetyPointsForStand(standName);
    this.elements.sosMedicalText.textContent = safetyPoints.medical;
    this.elements.sosSecurityText.textContent = safetyPoints.security;
  },

  /**
   * Highlights specific gate marker circles.
   */
  selectStadiumGate(gateLetter) {
    const markers = this.elements.stadiumSvg.querySelectorAll(".gate-marker");
    markers.forEach(m => m.classList.remove("gate-marker-selected"));

    const targetMarker = this.elements.stadiumSvg.getElementById(`gate-node-${gateLetter}`)?.querySelector(".gate-marker");
    if (targetMarker) {
      targetMarker.classList.add("gate-marker-selected");
    }

    let details = "";
    if (gateLetter === "A") details = "Gate A (North Stand) - Main entry gate. Wait time is under 3 minutes. Directly adjacent to Primary Medical Center.";
    if (gateLetter === "B") details = "Gate B (East Stand) - Connects to Lot B Parking. Currently critically congested (Wait queues: 35 minutes). Fans advised to redirect to Gate C.";
    if (gateLetter === "C") details = "Gate C (South Stand) - Transit hub & bus shuttle connections. Wait time is under 4 minutes.";
    if (gateLetter === "D") details = "Gate D (West Stand) - Rideshare pickup/drop-off point. Wait time is under 2 minutes.";

    this.elements.inspectFeedback.innerHTML = `📍 **Gate Selected: Gate ${gateLetter}**<br>${details}`;
    this.announce(`Gate ${gateLetter} selected. ${details}`);
  },

  /**
   * Plots navigation paths and highlighting dots for Seat B12.
   * @param {Object} route - Path data.
   */
  renderSeatB12Path(route) {
    // Reveal B12 highlights
    this.elements.seatHighlightDot.classList.remove("hidden");
    this.elements.routePathLine.classList.remove("hidden");

    // Select which route path to draw based on congestion alert state
    const useAlternate = route.alternate !== null;
    let pathD = "";
    
    if (useAlternate) {
      // Path starting from Gate C (cx=200, cy=360) looping to Seat B12 (cx=270, cy=160)
      pathD = "M 200 360 Q 280 320 270 160";
      this.selectStadiumStand("South");
      this.announce("Warning alert: drawing alternate path from Gate C to Seat B12.");
    } else {
      // Standard path starting from Gate B (cx=360, cy=200) leading to Seat B12 (cx=270, cy=160)
      pathD = "M 360 200 Q 320 180 270 160";
      this.selectStadiumStand("East");
      this.announce("Drawing standard path from Gate B to Seat B12.");
    }

    this.elements.routePathLine.setAttribute("d", pathD);
  },

  /**
   * Resets active map markers and hides path overlays.
   */
  clearMapHighlights() {
    this.elements.seatHighlightDot.classList.add("hidden");
    this.elements.routePathLine.classList.add("hidden");
    
    const stands = this.elements.stadiumSvg.querySelectorAll(".stadium-stand");
    stands.forEach(s => s.classList.remove("stand-selected"));
    
    const markers = this.elements.stadiumSvg.querySelectorAll(".gate-marker");
    markers.forEach(m => m.classList.remove("gate-marker-selected"));
    
    this.elements.inspectFeedback.textContent = "Click any stand or entrance gate pin to display current details, crowd levels, and estimated wait times.";
  },

  // ----------------------------------------------------
  // Chat Messaging Renderer
  // ----------------------------------------------------

  /**
   * Creates a chat text message bubble inside the log.
   */
  appendChatMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.className = `message ${sender === "user" ? "user-msg" : "system-msg"}`;
    
    const avatar = sender === "user" ? "👤" : "🤖";
    const displayName = sender === "user" ? "You" : "Smart Stadium Assistant";

    bubble.innerHTML = `
      <span class="avatar" aria-hidden="true">${avatar}</span>
      <div class="message-content">
        <strong>${displayName}</strong>
        <p>${text}</p>
      </div>
    `;

    this.elements.chatLog.appendChild(bubble);
    
    // Auto scroll chat to bottom
    this.elements.chatLog.scrollTop = this.elements.chatLog.scrollHeight;
    
    // Screen reader declaration for new messaging
    this.announce(`${displayName} says: ${text}`);
  },

  // ----------------------------------------------------
  // Full-Screen SOS Panic Modal overlay
  // ----------------------------------------------------

  /**
   * Opens the urgent SOS overlay and traps keyboard navigation.
   */
  openSosModal() {
    State.sosTriggered = true;
    this.elements.sosModal.classList.remove("hidden");
    
    // Trap focus inside modal: move focus to header title first
    const focusTarget = document.getElementById("sos-modal-focus-target");
    if (focusTarget) {
      focusTarget.focus();
    }

    this.announce("⚠️ ALERT: SOS Emergency center triggered. Stadium security dispatch notified. Keyboard focus is locked in this overlay.");
    
    // Add focus trap keydown listener
    this.elements.sosModal.addEventListener("keydown", this.handleSosFocusTrap);
  },

  /**
   * Closes the SOS overlay.
   */
  closeSosModal() {
    State.sosTriggered = false;
    this.elements.sosModal.classList.add("hidden");
    this.elements.sosModal.removeEventListener("keydown", this.handleSosFocusTrap);
    
    // Restore focus to SOS navbar button
    this.elements.btnSosTrigger.focus();
    this.announce("SOS emergency overlay closed.");
  },

  /**
   * Focus Trap Routine to keep keyboard navigation inside modal.
   */
  handleSosFocusTrap(e) {
    if (e.key === "Tab") {
      const modal = UI.elements.sosModal;
      // Get all focusable elements inside modal
      const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      const focusable = Array.from(modal.querySelectorAll(focusableSelectors));
      
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab -> reverse flow
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        // Tab -> forward flow
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    } else if (e.key === "Escape") {
      UI.closeSosModal();
    }
  },

  // ----------------------------------------------------
  // Browser Speech Synthesis (Announcer)
  // ----------------------------------------------------

  /**
   * Speaks announcement translation text using web speech API if available.
   * @param {string} text - Content to pronounce.
   * @param {string} lang - Locale code (es, fr, ar).
   */
  speakText(text, lang) {
    if ("speechSynthesis" in window) {
      // Cancel ongoing speeches
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      // Attempt to pick a natural regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(lang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      this.announce("Speaking announcement aloud.");
    } else {
      alert("Text-to-speech audio rendering is not supported on this browser.");
    }
  }
};
