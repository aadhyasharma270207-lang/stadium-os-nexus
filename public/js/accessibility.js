/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Accessibility & Inclusion Controller
 * Powered by AI Personalized Plans for Wheelchair, Elderly, Visually Impaired, Hearing Impaired, & Stroller Families.
 */

const Accessibility = {
  state: {
    contrast: false,
    colorblind: false,
    fontSizeMultiplier: 1.0,
    audioCommentary: false,
    activeProfile: 'WHEELCHAIR'
  },

  init() {
    this.loadSavedSettings();
    this.bindEvents();
    this.setupKeyboardListeners();
    this.fetchAccessibilityPlan('WHEELCHAIR');
  },

  loadSavedSettings() {
    try {
      const savedContrast = localStorage.getItem('fifa_a11y_contrast') === 'true';
      const savedColorblind = localStorage.getItem('fifa_a11y_colorblind') === 'true';
      const savedFont = parseFloat(localStorage.getItem('fifa_a11y_font') || '1.0');

      if (savedContrast) {
        this.toggleHighContrast(true);
        const el = document.getElementById('a11y-contrast-toggle');
        if (el) el.checked = true;
      }

      if (savedColorblind) {
        this.toggleColorblind(true);
        const el = document.getElementById('a11y-colorblind-toggle');
        if (el) el.checked = true;
      }

      if (savedFont !== 1.0) {
        this.state.fontSizeMultiplier = savedFont;
        this.applyFontSize();
      }
    } catch (e) {
      console.warn('Could not read localStorage a11y settings:', e);
    }
  },

  bindEvents() {
    // High Contrast Toggle
    const contrastSwitch = document.getElementById('a11y-contrast-toggle');
    if (contrastSwitch) {
      contrastSwitch.addEventListener('change', (e) => {
        this.toggleHighContrast(e.target.checked);
      });
    }

    // Color Blind Toggle
    const colorblindSwitch = document.getElementById('a11y-colorblind-toggle');
    if (colorblindSwitch) {
      colorblindSwitch.addEventListener('change', (e) => {
        this.toggleColorblind(e.target.checked);
      });
    }

    // Profile Selection Buttons
    document.querySelectorAll('.a11y-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.a11y-profile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const profile = btn.getAttribute('data-profile');
        this.state.activeProfile = profile;
        this.fetchAccessibilityPlan(profile);
      });
    });

    // Quick A11y Button in Header
    const quickA11yBtn = document.getElementById('a11y-quick-btn');
    if (quickA11yBtn) {
      quickA11yBtn.addEventListener('click', () => {
        if (window.App) window.App.switchTab('accessibility');
        this.announceScreenReader("Navigated to Accessibility and Inclusion page");
      });
    }

    // Font Resizing Buttons
    const fontPlus = document.getElementById('a11y-font-plus');
    const fontMinus = document.getElementById('a11y-font-minus');
    const fontReset = document.getElementById('a11y-font-reset');

    if (fontPlus) fontPlus.addEventListener('click', () => this.adjustFontSize(0.1));
    if (fontMinus) fontMinus.addEventListener('click', () => this.adjustFontSize(-0.1));
    if (fontReset) fontReset.addEventListener('click', () => this.resetFontSize());

    // Audio Commentary Toggle
    const audioSwitch = document.getElementById('a11y-audio-toggle');
    if (audioSwitch) {
      audioSwitch.addEventListener('change', (e) => {
        this.toggleAudioCommentary(e.target.checked);
      });
    }
  },

  async fetchAccessibilityPlan(profileType = 'WHEELCHAIR') {
    const card = document.getElementById('ai-accessibility-plan-card');
    if (!card) return;

    try {
      const res = await fetch('/api/stadiums/accessibility-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileType, section: '104' })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.renderAccessibilityPlan(json.data, card);
      }
    } catch (err) {
      console.error('Error fetching AI accessibility plan:', err);
    }
  },

  renderAccessibilityPlan(data, container) {
    if (!container) return;

    const routesHtml = (data.recommendedRoute || []).map(r => `
      <div style="margin-bottom: 6px; font-size: 0.88rem;">${r}</div>
    `).join('');

    const tipsHtml = (data.tips || []).map(t => `
      <li style="margin-bottom: 4px;">${t}</li>
    `).join('');

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0, 230, 118, 0.3); padding-bottom: 10px;">
        <h4 style="font-size: 1.1rem; color: var(--accent-emerald);">
          ${data.icon} AI Personalized Plan: ${data.profile}
        </h4>
        <span class="status-pill low">Section ${data.section} Tailored</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase;">Nearest Elevator</div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--accent-gold);">${data.nearestAmenities.elevator || 'Elevator Bank 2'}</div>
        </div>
        <div style="background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase;">Nearest ADA Restroom</div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--accent-cyan);">${data.nearestAmenities.restroom || 'Section 104 ADA'}</div>
        </div>
      </div>

      <div style="font-weight: 700; margin-bottom: 6px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">Recommended Step-by-Step Route:</div>
      ${routesHtml}

      <div style="font-weight: 700; margin: 10px 0 4px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">Personalized Matchday Tips:</div>
      <ul style="padding-left: 18px; font-size: 0.85rem; color: var(--text-secondary);">
        ${tipsHtml}
      </ul>

      <div style="margin-top: 14px; padding: 10px; background: rgba(0, 229, 255, 0.08); border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600;">🎧 Audio-Described Match Commentary Stream:</span>
        <button type="button" id="btn-play-audio-stream" style="background: var(--accent-cyan); color: #000; font-weight: 800; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.78rem; cursor: pointer;">🔊 Play Commentary</button>
      </div>
    `;

    const playAudioBtn = document.getElementById('btn-play-audio-stream');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', () => {
        const commentaryText = "Live FIFA World Cup 2026 Commentary. Minute 74. Team USA is pressing up the right flank with rapid ball movement into the penalty box. Attendance at MetLife Stadium is at maximum capacity.";
        if ('speechSynthesis' in window) {
          const synth = window.speechSynthesis;
          synth.cancel();
          const utterance = new SpeechSynthesisUtterance(commentaryText);
          utterance.rate = 1.0;
          synth.speak(utterance);
          this.announceScreenReader("Playing live audio-described match commentary stream.");
        } else {
          alert("Audio commentary: " + commentaryText);
        }
      });
    }

    this.announceScreenReader(`AI Accessibility Plan generated for ${data.profile}. Recommended route loaded.`);
  },

  setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && target.classList.contains('glass-card-interactive')) {
          e.preventDefault();
          target.click();
        } else if (target && target.classList.contains('brand-logo-group')) {
          e.preventDefault();
          if (window.App) window.App.switchTab('home');
        }
      }

      if (e.key === 'Escape') {
        const modal = document.getElementById('sos-modal-overlay');
        if (modal && modal.classList.contains('active')) {
          if (window.Emergency) window.Emergency.closeSOSModal();
        }
      }
    });
  },

  toggleHighContrast(enabled) {
    this.state.contrast = enabled;
    if (enabled) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    localStorage.setItem('fifa_a11y_contrast', enabled);
    this.announceScreenReader(enabled ? "High contrast mode enabled" : "High contrast mode disabled");
  },

  toggleColorblind(enabled) {
    this.state.colorblind = enabled;
    if (enabled) {
      document.documentElement.setAttribute('data-colorblind', 'true');
    } else {
      document.documentElement.removeAttribute('data-colorblind');
    }
    localStorage.setItem('fifa_a11y_colorblind', enabled);
    this.announceScreenReader(enabled ? "Color blind safe palette enabled" : "Color blind safe palette disabled");
  },

  adjustFontSize(delta) {
    this.state.fontSizeMultiplier = Math.min(1.4, Math.max(0.8, this.state.fontSizeMultiplier + delta));
    this.applyFontSize();
    localStorage.setItem('fifa_a11y_font', this.state.fontSizeMultiplier.toFixed(1));
  },

  resetFontSize() {
    this.state.fontSizeMultiplier = 1.0;
    this.applyFontSize();
    localStorage.setItem('fifa_a11y_font', '1.0');
  },

  applyFontSize() {
    document.documentElement.style.fontSize = `${this.state.fontSizeMultiplier * 16}px`;
    const label = document.getElementById('a11y-font-level-label');
    const percent = `${Math.round(this.state.fontSizeMultiplier * 100)}%`;
    if (label) label.textContent = percent;
    this.announceScreenReader(`Text font size set to ${percent}`);
  },

  toggleAudioCommentary(enabled) {
    this.state.audioCommentary = enabled;
    if (enabled) {
      this.announceScreenReader("Audio-described match commentary stream connected.");
      alert("🔊 Audio-Described Match Commentary Enabled. Audio stream connected.");
    }
  },

  announceScreenReader(message) {
    const region = document.getElementById('sr-announcement-region');
    if (region) {
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Accessibility.init();
});

window.Accessibility = Accessibility;
