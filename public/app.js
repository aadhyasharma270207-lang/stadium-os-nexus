/**
 * public/app.js
 * 
 * Application Entry Bootstrapper and Glue Controller.
 * Binds DOM event listeners, configures accessibility settings,
 * and synchronizes live backend stadium sensors on window load.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Fail-safe loader dismissal after 800ms to guarantee zero buffering
  setTimeout(fadeOutPageLoader, 800);

  try {
    // Initialize State parameters from storage
    if (typeof State !== 'undefined') State.init();
    
    // Apply initial theme variables, language maps and alignments
    if (typeof UI !== 'undefined') UI.initStyles();

    // Load and register Event Listeners
    bindAccessibilityControls();
    bindNavigationEvents();
    bindStadiumMapEvents();
    bindChatbotEvents();
    bindAnnouncementTranslatorEvents();
    bindEmergencyEvents();

    // Load Sensor Telemetry from Express API
    await loadStadiumTelemetrySensors();
  } catch (err) {
    console.warn("Notice during app bootstrap:", err);
  } finally {
    // Fade out splash loader screen smoothly
    fadeOutPageLoader();
  }
});

/**
 * Fades out the full screen loading overlay with a smooth transition.
 */
function fadeOutPageLoader() {
  const loader = document.getElementById("page-loader");
  if (loader && !loader.classList.contains("fade-out")) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.remove();
      }
      if (typeof UI !== 'undefined' && UI.announce) {
        UI.announce("FIFA 2026 Stadium Dashboard Loaded.");
      }
    }, 400);
  }
}

/**
 * Fetches dynamic sensors and lists matches, parking, food queues, and emergency directories.
 */
async function loadStadiumTelemetrySensors() {
  try {
    const data = await API.fetchStadiumData();
    if (typeof State !== 'undefined') State.stadiumTelemetry = data;

    if (typeof UI !== 'undefined') {
      if (data.schedule) UI.renderMatches(data.schedule);
      if (data.alerts) UI.renderGateCrowds(data.alerts);
      if (data.parking) UI.renderParking(data.parking);
      if (data.foodStalls) UI.renderFoodStalls(data.foodStalls);
      if (data.safety) UI.renderSafetyDetails(data.safety);

      if (Array.isArray(data.alerts)) {
        const gateBAlert = data.alerts.find(a => a.location && a.location.includes("Gate B"));
        if (gateBAlert && UI.elements.routeAlertBar) {
          UI.elements.routeAlertBar.classList.remove("hidden");
          if (UI.elements.alertTitleText) UI.elements.alertTitleText.textContent = `⚠️ ${gateBAlert.location} (${gateBAlert.status}): `;
          if (UI.elements.alertDescText) UI.elements.alertDescText.textContent = `${gateBAlert.message} ${gateBAlert.alternateAction}`;
        }
      }
    }
  } catch (error) {
    console.warn("⚠️ Telemetry fetch fallback active.");
    const fallbackData = {
      schedule: [
        { id: "m1", homeTeam: "USA", awayTeam: "Mexico", time: "2026-07-18T18:00:00", status: "Upcoming", stage: "Group A", stadium: "MetLife Stadium", homeFlag: "🇺🇸", awayFlag: "🇲🇽" },
        { id: "m2", homeTeam: "Canada", awayTeam: "Argentina", time: "2026-07-18T21:00:00", status: "Upcoming", stage: "Group B", stadium: "MetLife Stadium", homeFlag: "🇨🇦", awayFlag: "🇦🇷" },
        { id: "m3", homeTeam: "England", awayTeam: "France", time: "2026-07-17T20:00:00", status: "Live - Min 72", stage: "Quarter-Finals", stadium: "MetLife Stadium", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇫🇷" }
      ],
      parking: [
        { name: "Lot A (North Gate)", totalSpaces: 500, occupiedSpaces: 475, pricing: "$50", features: ["VIP Reservation", "EV Charging"], congestion: "High" },
        { name: "Lot B (East Gate)", totalSpaces: 1200, occupiedSpaces: 1020, pricing: "$35", features: ["General Parking"], congestion: "High" },
        { name: "Lot C (South Gate)", totalSpaces: 800, occupiedSpaces: 240, pricing: "$25", features: ["Pre-booked Shuttle transit"], congestion: "Low" },
        { name: "Lot D (West Gate)", totalSpaces: 600, occupiedSpaces: 180, pricing: "$40", features: ["Rideshare drop-off zone"], congestion: "Low" }
      ],
      foodStalls: [
        { name: "Stadium Street Tacos", cuisine: "Mexican", location: "North Concourse (Gate A)", waitTime: 25, crowdLevel: "High", features: ["Vegetarian Options"] },
        { name: "International Grill & Burgers", cuisine: "American", location: "East Concourse (Gate B)", waitTime: 18, crowdLevel: "Moderate", features: ["Gluten-free"] },
        { name: "South Side Pizza", cuisine: "Italian", location: "South Concourse (Gate C)", waitTime: 5, crowdLevel: "Low", features: ["Halal"] },
        { name: "Green Bite Salad", cuisine: "Vegan", location: "West Concourse (Gate D)", waitTime: 3, crowdLevel: "Low", features: ["100% Vegan"] }
      ],
      safety: {
        contacts: [
          { label: "Stadium Safety & Security", phone: "+1 (800) 555-7233", readable: "1 800 555 SAFE" },
          { label: "Medical First-Aid Dispatch", phone: "+1 (800) 555-6331", readable: "1 800 555 MED 1" }
        ],
        locations: {
          medical: [{ name: "First-Aid Room North", nearestGate: "Gate A" }, { name: "First-Aid Room South", nearestGate: "Gate C" }],
          security: [{ name: "Command Center North", nearestGate: "Gate A" }, { name: "Security Desk East", nearestGate: "Gate B" }, { name: "Security Desk West", nearestGate: "Gate D" }]
        },
        instructions: [
          { title: "Evacuation Protocol", steps: ["Remain calm.", "Locate the nearest emergency exit door.", "Follow directions from security wardens."] }
        ]
      }
    };
    if (typeof State !== 'undefined') State.stadiumTelemetry = fallbackData;
    if (typeof UI !== 'undefined') {
      UI.renderMatches(fallbackData.schedule);
      UI.renderGateCrowds(null);
      UI.renderParking(fallbackData.parking);
      UI.renderFoodStalls(fallbackData.foodStalls);
      UI.renderSafetyDetails(fallbackData.safety);
    }
  }
}

// ----------------------------------------------------
// Event Binders
// ----------------------------------------------------

function bindAccessibilityControls() {
  if (typeof UI === 'undefined' || !UI.elements) return;
  if (UI.elements.btnContrast) {
    UI.elements.btnContrast.addEventListener("click", () => {
      State.toggleContrast();
      UI.updateContrastMode();
    });
  }

  if (UI.elements.btnFontDec) {
    UI.elements.btnFontDec.addEventListener("click", () => {
      State.decreaseFont();
      UI.updateFontScale();
    });
  }

  if (UI.elements.btnFontInc) {
    UI.elements.btnFontInc.addEventListener("click", () => {
      State.increaseFont();
      UI.updateFontScale();
    });
  }

  if (UI.elements.btnFontReset) {
    UI.elements.btnFontReset.addEventListener("click", () => {
      State.resetFont();
      UI.updateFontScale();
    });
  }

  if (UI.elements.langSelector) {
    UI.elements.langSelector.addEventListener("change", (e) => {
      const prevLang = State.language;
      const nextLang = e.target.value;
      State.setLanguage(nextLang);
      
      if (nextLang === "en" && prevLang !== "en") {
        location.reload();
        return;
      }
      
      UI.updateDocumentDirection();
      UI.translateUI();
      if (State.stadiumTelemetry && UI.elements.matchSearchInput) {
        UI.renderMatches(State.stadiumTelemetry.schedule, UI.elements.matchSearchInput.value);
      }
    });
  }
}

function bindNavigationEvents() {
  if (typeof UI === 'undefined' || !UI.elements) return;
  if (UI.elements.navLinks) {
    UI.elements.navLinks.forEach(link => {
      link.addEventListener("click", () => {
        UI.elements.navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll("section[id]").forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        if (UI.elements && UI.elements.navLinks) {
          UI.elements.navLinks.forEach(l => {
            l.classList.remove("active");
            if (l.getAttribute("href") === `#${id}`) {
              l.classList.add("active");
            }
          });
        }
      }
    });
  });
}

function bindStadiumMapEvents() {
  if (typeof UI === 'undefined' || !UI.elements || !UI.elements.stadiumSvg) return;
  
  UI.elements.stadiumSvg.querySelectorAll(".stadium-stand").forEach(stand => {
    stand.addEventListener("click", () => {
      const standName = stand.getAttribute("id").replace("stand-", "");
      UI.selectStadiumStand(standName);
    });
  });

  UI.elements.stadiumSvg.querySelectorAll(".map-gate-node").forEach(gateNode => {
    gateNode.addEventListener("click", () => {
      const gateLetter = gateNode.getAttribute("id").replace("gate-node-", "");
      UI.selectStadiumGate(gateLetter);
    });
  });

  if (UI.elements.standSelectButtons) {
    UI.elements.standSelectButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const standName = btn.getAttribute("data-stand");
        UI.selectStadiumStand(standName);
      });
    });
  }

  if (UI.elements.seatForm) {
    UI.elements.seatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = UI.elements.seatInput ? UI.elements.seatInput.value.trim() : "";

      UI.clearMapHighlights();
      if (UI.elements.seatError) UI.elements.seatError.classList.add("hidden");
      if (UI.elements.seatResults) UI.elements.seatResults.classList.add("hidden");

      if (!query) {
        if (UI.elements.seatError) {
          UI.elements.seatError.textContent = "Please enter a ticket seat code.";
          UI.elements.seatError.classList.remove("hidden");
        }
        return;
      }

      const route = State.calculateSeatRoute(query);
      if (route) {
        if (UI.elements.seatResults) UI.elements.seatResults.classList.remove("hidden");
        const standEl = document.getElementById("route-stand");
        if (standEl) standEl.textContent = route.stand;
        
        const isAlt = route.alternate !== null;
        const gateEl = document.getElementById("route-gate");
        if (gateEl) gateEl.textContent = isAlt ? route.alternate.gate : route.gate;
        
        const walkEl = document.getElementById("route-walk-time");
        if (walkEl) walkEl.textContent = isAlt ? route.alternate.walkTime : route.walkTime;

        const stepsList = document.getElementById("route-steps");
        if (stepsList) {
          stepsList.innerHTML = "";
          const routeSteps = isAlt ? [
            `Congestion detour: Enter via Gate C.`,
            `Follow inner walkways east to Section 102.`,
            `Head up Row B to Seat 12.`
          ] : route.steps;

          routeSteps.forEach(s => {
            const li = document.createElement("li");
            li.textContent = s;
            stepsList.appendChild(li);
          });
        }

        const altBox = document.getElementById("alternate-route-box");
        if (altBox) {
          if (isAlt) {
            altBox.classList.remove("hidden");
            const descEl = document.getElementById("alternate-route-desc");
            if (descEl) descEl.innerHTML = route.alternate.desc;
          } else {
            altBox.classList.add("hidden");
          }
        }

        UI.renderSeatB12Path(route);
        UI.announce(`Seat route found.`);
      } else {
        if (UI.elements.seatError) {
          UI.elements.seatError.textContent = "Seat location not found. Please verify code.";
          UI.elements.seatError.classList.remove("hidden");
        }
      }
    });
  }
}

function bindChatbotEvents() {
  if (typeof UI === 'undefined' || !UI.elements) return;
  if (UI.elements.chatChips) {
    UI.elements.chatChips.forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("chat-chip-danger")) {
          UI.openSosModal();
          return;
        }
        
        const query = chip.getAttribute("aria-label") || chip.textContent;
        if (UI.elements.chatInput) UI.elements.chatInput.value = query;
        triggerChatMessageSubmit();
      });
    });
  }

  if (UI.elements.chatForm) {
    UI.elements.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerChatMessageSubmit();
    });
  }
}

async function triggerChatMessageSubmit() {
  if (!UI.elements || !UI.elements.chatInput) return;
  const query = UI.elements.chatInput.value.trim();
  if (!query) return;

  UI.appendChatMessage("user", query);
  UI.elements.chatInput.value = "";

  const loaderBubble = document.createElement("div");
  loaderBubble.className = "message system-msg temp-chat-loader";
  loaderBubble.innerHTML = `
    <span class="avatar" aria-hidden="true">🤖</span>
    <div class="message-content">
      <strong>Smart Stadium Assistant</strong>
      <p class="chat-typing-animation">Assistant is thinking<span>.</span><span>.</span><span>.</span></p>
    </div>
  `;
  if (UI.elements.chatLog) {
    UI.elements.chatLog.appendChild(loaderBubble);
    UI.elements.chatLog.scrollTop = UI.elements.chatLog.scrollHeight;
  }

  try {
    const response = await API.sendChatMessage(query);
    loaderBubble.remove();
    UI.appendChatMessage("system", response.reply, response.engine);
  } catch (error) {
    loaderBubble.remove();
    UI.appendChatMessage("system", "I apologize, but I am having trouble connecting to the stadium core server right now. Please check your internet connection.");
  }
}

function bindAnnouncementTranslatorEvents() {
  if (typeof UI === 'undefined' || !UI.elements) return;
  if (UI.elements.presetSelect) {
    UI.elements.presetSelect.addEventListener("change", (e) => {
      if (e.target.value === "custom") {
        if (UI.elements.customAnnounceWrapper) UI.elements.customAnnounceWrapper.classList.remove("hidden");
      } else {
        if (UI.elements.customAnnounceWrapper) UI.elements.customAnnounceWrapper.classList.add("hidden");
      }
    });
  }

  if (UI.elements.btnTranslate) {
    UI.elements.btnTranslate.addEventListener("click", async () => {
      let sourceText = "";
      const selectedPreset = UI.elements.presetSelect ? UI.elements.presetSelect.value : "";
      
      if (selectedPreset === "custom") {
        sourceText = UI.elements.customAnnounceInput ? UI.elements.customAnnounceInput.value.trim() : "";
      } else if (UI.elements.presetSelect) {
        const presetOption = UI.elements.presetSelect.querySelector(`option[value="${selectedPreset}"]`);
        sourceText = presetOption ? presetOption.textContent : "";
      }

      if (!sourceText) {
        alert("Please enter text or select an announcement to translate.");
        return;
      }

      const targetLang = UI.elements.targetLangSelect ? UI.elements.targetLangSelect.value : "es";
      
      UI.elements.btnTranslate.disabled = true;
      const oldText = UI.elements.btnTranslate.textContent;
      UI.elements.btnTranslate.textContent = "Translating announcement...";

      try {
        const response = await API.translateAnnouncement(sourceText, targetLang);
        if (UI.elements.translationResult) UI.elements.translationResult.classList.remove("hidden");
        if (UI.elements.translationOutput) UI.elements.translationOutput.textContent = response.translation;
        UI.announce("Translation completed successfully.");
      } catch (error) {
        if (UI.elements.translationResult) UI.elements.translationResult.classList.remove("hidden");
        if (UI.elements.translationOutput) UI.elements.translationOutput.textContent = "Error: Failed to fetch translation from the server.";
      } finally {
        UI.elements.btnTranslate.disabled = false;
        UI.elements.btnTranslate.textContent = oldText;
      }
    });
  }

  if (UI.elements.btnAnnounceSpeech) {
    UI.elements.btnAnnounceSpeech.addEventListener("click", () => {
      const text = UI.elements.translationOutput ? UI.elements.translationOutput.textContent : "";
      const lang = UI.elements.targetLangSelect ? UI.elements.targetLangSelect.value : "es";
      if (text) {
        UI.speakText(text, lang);
      }
    });
  }
}

function bindEmergencyEvents() {
  if (typeof UI === 'undefined' || !UI.elements) return;
  if (UI.elements.btnSosTrigger) {
    UI.elements.btnSosTrigger.addEventListener("click", () => {
      UI.openSosModal();
    });
  }

  if (UI.elements.btnSosClose) {
    UI.elements.btnSosClose.addEventListener("click", () => {
      UI.closeSosModal();
    });
  }

  if (UI.elements.btnSosDismiss) {
    UI.elements.btnSosDismiss.addEventListener("click", () => {
      UI.closeSosModal();
    });
  }

  if (UI.elements.sosModal) {
    UI.elements.sosModal.addEventListener("click", (e) => {
      if (e.target === UI.elements.sosModal) {
        UI.closeSosModal();
      }
    });
  }
}
