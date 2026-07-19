/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Crowd Management Controller
 */

const Crowd = {
  state: {
    zones: [],
    aiRecommendations: [],
    nearestExits: [],
    reroutePlan: null,
    autoRefreshInterval: null
  },

  init() {
    this.bindEvents();
    this.loadCrowdData();
    this.startAutoRefresh();
  },

  bindEvents() {
    const rerouteBtn = document.getElementById('calc-reroute-btn');
    if (rerouteBtn) {
      rerouteBtn.addEventListener('click', () => this.calculateReroute());
    }

    const predictBtn = document.getElementById('btn-predict-crowd');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => this.predictCrowdConditions());
    }

    const refreshBtn = document.getElementById('refresh-crowd-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadCrowdData();
        if (window.Accessibility) {
          window.Accessibility.announceScreenReader("Crowd density data refreshed.");
        }
      });
    }
  },

  startAutoRefresh() {
    if (this.state.autoRefreshInterval) clearInterval(this.state.autoRefreshInterval);
    this.state.autoRefreshInterval = setInterval(() => {
      this.loadCrowdData();
    }, 10000);
  },

  async predictCrowdConditions() {
    const timingSelect = document.getElementById('predict-timing-select');
    const gateSelect = document.getElementById('predict-gate-select');
    const parkingInput = document.getElementById('predict-parking-input');

    const matchTime = timingSelect ? timingSelect.value : 'T-60';
    const gateId = gateSelect ? gateSelect.value : 'Gate B';
    const parkingOccupancy = parkingInput ? parseInt(parkingInput.value, 10) || 85 : 85;

    try {
      const res = await fetch('/api/crowd/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchTime, gateId, parkingOccupancy })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.renderPredictionResult(json.data);
      }
    } catch (err) {
      console.error('Error predicting crowd conditions:', err);
    }
  },

  renderPredictionResult(data) {
    const box = document.getElementById('crowd-prediction-result-box');
    if (!box) return;

    box.style.display = 'block';
    const formattedReasoning = (data.aiReasoning || '')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    box.innerHTML = `
      <div class="glass-card" style="padding: 14px; background: rgba(0, 229, 255, 0.05); border-left: 4px solid var(--accent-cyan);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <strong style="font-size: 0.88rem; color: var(--accent-cyan);">${data.gateId} (${data.matchTime})</strong>
          <span class="status-pill ${data.predictedWaitMins.includes('18') || data.predictedWaitMins.includes('25') ? 'live' : 'low'}">${data.predictedWaitMins}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700; margin-bottom: 6px;">
          Recommended Alt: ${data.recommendedAlternativeEntrance}
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">${formattedReasoning}</div>
      </div>
    `;

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Crowd prediction updated for ${data.gateId}. Predicted wait: ${data.predictedWaitMins}.`);
    }
  },

  async loadCrowdData() {
    try {
      const res = await fetch('/api/crowd/density');
      const data = await res.json();
      if (data.success) {
        this.state.zones = data.zones;
        this.state.aiRecommendations = data.aiRecommendations;
        this.state.nearestExits = data.nearestExits;

        this.renderDensityMeters(data.zones);
        this.renderAiRecommendations(data.aiRecommendations);
        this.renderNearestExits(data.nearestExits);
      }
    } catch (err) {
      console.warn('Could not load crowd density data:', err);
    }
  },

  renderDensityMeters(zones) {
    const container = document.getElementById('gate-metrics-container');
    if (!container || !zones) return;

    container.innerHTML = zones.map(z => {
      let badgeClass = 'low';
      let statusIcon = '🟢';
      let barColor = 'var(--accent-emerald)';

      if (z.density > 75) {
        badgeClass = 'live';
        statusIcon = '🛑';
        barColor = 'var(--accent-danger)';
      } else if (z.density > 50) {
        badgeClass = 'moderate';
        statusIcon = '⚠️';
        barColor = 'var(--accent-gold)';
      }

      return `
        <div class="glass-card" style="padding: 12px; margin-bottom: 8px;" tabindex="0" aria-label="${z.name}: ${z.density}% Density, Status ${z.status}, Estimated Wait ${z.waitTime}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <h4 style="font-size: 0.88rem;">${z.name}</h4>
            <span class="status-pill ${badgeClass}">${statusIcon} ${z.status} (${z.waitTime})</span>
          </div>

          <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-top: 4px;">
            <div style="width: ${z.density}%; height: 100%; background: ${barColor}; transition: width 0.5s ease;"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderAiRecommendations(recs) {
    const box = document.getElementById('ai-crowd-recommendations-box');
    if (!box || !recs) return;

    box.innerHTML = `
      <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--accent-cyan); background: rgba(0, 229, 255, 0.05);">
        <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;">
          💡 AI Crowd Recommendations
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 0.84rem;">
          ${recs.map(r => `<li>• ${r.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
        </ul>
      </div>
    `;
  },

  renderNearestExits(exits) {
    const container = document.getElementById('nearest-exits-list');
    if (!container || !exits) return;

    container.innerHTML = exits.map(e => `
      <div class="glass-card" style="padding: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;" tabindex="0" aria-label="Nearest Exit: ${e.name}, Distance ${e.distance}, Est time ${e.estTime}">
        <div>
          <h4 style="font-size: 0.88rem; color: var(--accent-emerald);">${e.name}</h4>
          <div style="font-size: 0.76rem; color: var(--text-secondary);">Distance: <strong>${e.distance}</strong></div>
        </div>
        <span class="status-pill low">${e.estTime}</span>
      </div>
    `).join('');
  },

  async calculateReroute() {
    const secInput = document.getElementById('reroute-sec-input');
    const destSelect = document.getElementById('reroute-dest-select');

    const sec = secInput ? secInput.value : '104';
    const dest = destSelect ? destSelect.value : 'Main Gate Exit';

    try {
      const res = await fetch('/api/crowd/reroute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSection: sec, targetDestination: dest })
      });

      const data = await res.json();
      if (data.success) {
        this.renderRerouteComparison(data.reroutePlan);
      }
    } catch (err) {
      console.warn('Could not calculate reroute:', err);
    }
  },

  renderRerouteComparison(plan) {
    const box = document.getElementById('reroute-result-container');
    if (!box || !plan) return;

    box.style.display = 'block';
    box.innerHTML = `
      <div class="glass-card" style="padding: 18px; border: 1px solid var(--accent-emerald);">
        <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--accent-gold);">
          🔄 AI Route Comparison & Reroute Engine
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div class="glass-card" style="padding: 12px; background: rgba(255, 42, 95, 0.05);">
            <div class="status-pill live" style="margin-bottom: 6px;">CONGESTED</div>
            <h5 style="font-size: 0.82rem;">${plan.primaryRoute.path}</h5>
            <div style="font-size: 0.78rem; color: var(--accent-danger);">${plan.primaryRoute.estTime}</div>
          </div>

          <div class="glass-card" style="padding: 12px; background: rgba(0, 230, 118, 0.08);">
            <div class="status-pill low" style="margin-bottom: 6px;">AI BYPASS</div>
            <h5 style="font-size: 0.82rem;">${plan.recommendedAlternativeRoute.path}</h5>
            <div style="font-size: 0.78rem; color: var(--accent-emerald); font-weight: 800;">${plan.recommendedAlternativeRoute.estTime} (${plan.recommendedAlternativeRoute.timeSaved})</div>
          </div>
        </div>

        <ol style="margin-left: 16px; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          ${plan.stepByStepDirections.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
    `;

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Calculated bypass route: ${plan.recommendedAlternativeRoute.timeSaved}`);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Crowd.init();
});

window.Crowd = Crowd;
