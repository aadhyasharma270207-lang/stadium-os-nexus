/**
 * FIFA World Cup 2026 Smart Assistant - Services & Dining Controller
 * Connects Gemini AI Personalized Food Recommendations, Weather Intelligence, and Matchday Itinerary Generator.
 */

const Services = {
  init() {
    this.bindEvents();
    this.loadWeatherIntelligence();
  },

  bindEvents() {
    // Food Recommendation Trigger
    const recFoodBtn = document.getElementById('btn-recommend-food');
    if (recFoodBtn) {
      recFoodBtn.addEventListener('click', () => this.calculateFoodRecommendations());
    }

    // Itinerary Generator Trigger
    const genItinBtn = document.getElementById('btn-generate-itinerary');
    if (genItinBtn) {
      genItinBtn.addEventListener('click', () => this.generateMatchdayItinerary());
    }
  },

  async calculateFoodRecommendations() {
    const secInput = document.getElementById('food-sec-input');
    const budgetInput = document.getElementById('food-budget-input');
    const vegCheck = document.getElementById('food-veg-check');
    const veganCheck = document.getElementById('food-vegan-check');
    const gfCheck = document.getElementById('food-gf-check');
    const nutCheck = document.getElementById('food-nut-check');
    const kidsCheck = document.getElementById('food-kids-check');

    const section = secInput ? secInput.value.trim() || '104' : '104';
    const maxBudget = budgetInput ? parseFloat(budgetInput.value) || 15 : 15;
    const isVegetarian = vegCheck ? vegCheck.checked : false;
    const isVegan = veganCheck ? veganCheck.checked : false;
    const isGlutenFree = gfCheck ? gfCheck.checked : false;
    const isNutFree = nutCheck ? nutCheck.checked : false;
    const isKids = kidsCheck ? kidsCheck.checked : false;

    try {
      const res = await fetch('/api/services/recommend-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          maxBudget,
          isVegetarian,
          isVegan,
          isGlutenFree,
          isNutFree,
          isKids,
          maxWaitMins: 10
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.renderFoodRecommendations(json.data);
      }
    } catch (err) {
      console.error('Error fetching food recommendations:', err);
    }
  },

  renderFoodRecommendations(data) {
    const box = document.getElementById('ai-food-recommendation-box');
    const grid = document.getElementById('food-stalls-grid');
    if (!box) return;

    box.style.display = 'block';
    const formattedRationale = (data.aiRationale || '')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    box.innerHTML = `
      <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--accent-gold); background: rgba(255, 215, 0, 0.05);">
        <h4 style="color: var(--accent-gold); font-size: 0.95rem; margin-bottom: 8px;">
          🍔 Gemini AI Personalized Food Recommendation
        </h4>
        <div style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.5;">${formattedRationale}</div>
      </div>
    `;

    if (grid && Array.isArray(data.recommendations)) {
      grid.innerHTML = data.recommendations.map(item => `
        <div class="glass-card" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;" tabindex="0" aria-label="${item.name}, Price $${item.price}, Wait time ${item.waitTimeMins} minutes">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 1rem;">${item.name}</h4>
            <span class="status-pill low">$${item.price}</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary);">${item.description}</p>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
            <span>Section ${item.section} Portal</span>
            <span>Wait: <strong>${item.waitTimeMins} mins</strong></span>
          </div>
        </div>
      `).join('');
    }

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Food recommendations updated for Section ${data.userSection}.`);
    }
  },

  async generateMatchdayItinerary() {
    const secInput = document.getElementById('itin-sec-input');
    const partySelect = document.getElementById('itin-party-select');
    const kickoffSelect = document.getElementById('itin-kickoff-select');

    const section = secInput ? secInput.value.trim() || '104' : '104';
    const partyType = partySelect ? partySelect.value : 'FAMILY';
    const kickoffTime = kickoffSelect ? kickoffSelect.value : '18:00';

    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, partyType, kickoffTime })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.renderItineraryResult(json.data);
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
    }
  },

  renderItineraryResult(data) {
    const box = document.getElementById('itinerary-result-box');
    if (!box) return;

    box.style.display = 'block';

    const timelineHtml = (data.timeline || []).map(t => `
      <div style="display: flex; gap: 14px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 8px;">
        <span style="background: var(--accent-cyan); color: #000; font-weight: 800; font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; height: fit-content;">${t.timeOffset}</span>
        <div>
          <h4 style="font-size: 0.92rem; color: var(--text-primary); margin-bottom: 4px;">${t.title}</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 4px;">${t.detail}</p>
          <div style="font-size: 0.78rem; color: var(--accent-emerald); font-weight: 600;">💡 Crowd Avoidance: ${t.crowdAvoidanceTip}</div>
        </div>
      </div>
    `).join('');

    box.innerHTML = `
      <div class="glass-card" style="padding: 20px; border-left: 4px solid var(--accent-cyan);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 1.1rem; color: var(--accent-cyan);">
            📅 Complete Matchday Visit Plan (Section ${data.section})
          </h3>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="status-pill low">${data.crowdTimeSaved}</span>
            <button type="button" id="btn-copy-itinerary" style="background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">📋 Copy Plan</button>
          </div>
        </div>
        ${timelineHtml}
      </div>
    `;

    const copyBtn = document.getElementById('btn-copy-itinerary');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = `FIFA 2026 Matchday Itinerary (Section ${data.section}):\n` + (data.timeline || []).map(t => `${t.timeOffset}: ${t.title} - ${t.detail}`).join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.Navigation && window.Navigation.showToast) {
            window.Navigation.showToast('📋 Matchday Itinerary copied to clipboard!');
          } else {
            alert('📋 Matchday Itinerary copied to clipboard!');
          }
        });
      });
    }

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Generated complete matchday itinerary for Section ${data.section}. Saved ${data.crowdTimeSaved}.`);
    }
  },

  async loadWeatherIntelligence() {
    try {
      const res = await fetch('/api/weather/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: 'sunny', section: '104' })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const heading = document.getElementById('weather-condition-heading');
        const indoor = document.getElementById('weather-indoor-lounges');
        const rain = document.getElementById('weather-rain-entrances');
        const tips = document.getElementById('weather-clothing-tips');

        if (heading) heading.textContent = `${d.condition} (31°C)`;
        if (indoor) indoor.textContent = d.indoorWaitingArea;
        if (rain) rain.textContent = d.rainSafeEntrance;
        if (tips) tips.textContent = d.clothingAdvice;
      }
    } catch (e) {
      console.warn('Could not fetch weather intelligence:', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Services.init();
});

window.Services = Services;
