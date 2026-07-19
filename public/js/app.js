/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Main Application Controller
 */

const App = {
  state: {
    currentTab: 'home',
    theme: 'dark',
    highContrast: false,
    selectedStadium: 'metlife',
    matchTicker: null,
    stadiums: []
  },

  init() {
    console.log('⚽ FIFA World Cup 2026 Smart Stadium Assistant initializing...');
    
    // Set up theme
    this.initTheme();

    // Set up event listeners
    this.bindEvents();

    // Initial data load
    this.fetchStadiums();
    this.fetchMatchTicker();

    // Hide loading animation after initial assets load
    setTimeout(() => {
      this.hideLoader();
    }, 1200);
  },

  hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  },

  showLoader(text = 'Loading Stadium Data...') {
    const loader = document.getElementById('app-loader');
    const label = document.getElementById('loader-label-text');
    if (label) label.textContent = text;
    if (loader) loader.classList.remove('hidden');
  },

  bindEvents() {
    // Navigation links (Desktop & Mobile)
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = e.currentTarget.getAttribute('data-view-target');
        this.switchTab(targetView);
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Stadium Selector dropdown change
    const stadiumSelect = document.getElementById('global-stadium-select');
    if (stadiumSelect) {
      stadiumSelect.addEventListener('change', (e) => {
        this.state.selectedStadium = e.target.value;
        this.onStadiumChanged(e.target.value);
      });
    }

    // Host Nations Language Switcher
    const langSelect = document.getElementById('host-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.onLanguageChanged(e.target.value);
      });
    }
  },

  onLanguageChanged(lang) {
    console.log('Language switched to:', lang);
    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Language switched to ${lang === 'es' ? 'Spanish' : lang === 'fr' ? 'French' : 'English'}`);
    }
  },

  switchTab(tabId) {
    if (!tabId) return;
    this.state.currentTab = tabId;

    // Update active nav buttons
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      if (btn.getAttribute('data-view-target') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update view section displays
    document.querySelectorAll('.view-section').forEach(sec => {
      if (sec.id === `view-${tabId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Screen Reader announcement
    if (window.Accessibility && window.Accessibility.announceScreenReader) {
      window.Accessibility.announceScreenReader(`Switched to ${tabId.toUpperCase()} page section`);
    }

    // Trigger tab specific refresh if needed
    if (tabId === 'navigation' && window.Navigation) {
      window.Navigation.renderMap();
    } else if (tabId === 'services' && window.Services) {
      window.Services.loadServices();
    }
  },

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = this.state.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  },

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
  },

  async fetchStadiums() {
    try {
      const res = await fetch('/api/stadiums');
      const data = await res.json();
      if (data.success) {
        this.state.stadiums = data.data;
        this.populateStadiumDropdown(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch stadiums list:', err);
    }
  },

  populateStadiumDropdown(stadiums) {
    const dropdown = document.getElementById('global-stadium-select');
    if (!dropdown) return;
    dropdown.innerHTML = stadiums.map(s => `
      <option value="${s.id}">${s.name} - ${s.city}</option>
    `).join('');
  },

  async fetchMatchTicker() {
    try {
      const res = await fetch('/api/match-ticker');
      const data = await res.json();
      if (data.success) {
        this.renderMatchTicker(data.currentMatch);
      }
    } catch (err) {
      console.warn('Could not fetch match ticker:', err);
    }
  },

  renderMatchTicker(match) {
    const tickerContainer = document.getElementById('live-match-ticker');
    if (!tickerContainer || !match) return;

    tickerContainer.innerHTML = `
      <div class="match-teams-display">
        <span class="status-pill live"><span class="status-dot"></span> ${match.status} ${match.minute}</span>
        <div class="team-box">
          <span>${match.homeTeam.flag}</span>
          <span>${match.homeTeam.name}</span>
        </div>
        <div class="score-badge">${match.homeTeam.score} - ${match.awayTeam.score}</div>
        <div class="team-box">
          <span>${match.awayTeam.name}</span>
          <span>${match.awayTeam.flag}</span>
        </div>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary);">
        <i class="fas fa-location-dot" style="color: var(--accent-emerald);"></i> ${match.venue}
      </div>
    `;
  },

  onStadiumChanged(stadiumId) {
    console.log('Stadium changed to:', stadiumId);
    if (window.Navigation) window.Navigation.onStadiumSelect(stadiumId);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.App = App;
