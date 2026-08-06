/**
 * FIFA World Cup 2026 Smart Assistant - Navigation Controller
 * Interactive 2D HTML5 Canvas Pitch Map & AI Smart Route Pathfinder
 */

const Navigation = {
  canvas: null,
  ctx: null,
  routeInstructions: null,
  aiExplanationCard: null,
  aiExplanationText: null,

  state: {
    section: '104',
    row: '12',
    seat: '8',
    weather: 'sunny',
    accessibility: false,
    isElderly: false,
    hasChildren: false,
    destination: 'seat',
    currentRoute: null
  },

  init() {
    this.canvas = document.getElementById('stadium-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.routeInstructions = document.getElementById('nav-route-instructions');
    this.aiExplanationCard = document.getElementById('ai-route-explanation-card');
    this.aiExplanationText = document.getElementById('ai-explanation-text');

    this.bindEvents();
    this.renderCanvasMap();
  },

  bindEvents() {
    const findSeatBtn = document.getElementById('find-seat-btn');
    if (findSeatBtn) {
      findSeatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.calculateSmartRoute();
      });
    }

    const destSelect = document.getElementById('nav-dest-select');
    if (destSelect) {
      destSelect.addEventListener('change', (e) => {
        this.state.destination = e.target.value;
        this.calculateSmartRoute();
      });
    }
  },

  async calculateSmartRoute() {
    const secInput = document.getElementById('seat-sec-input');
    const rowInput = document.getElementById('seat-row-input');
    const seatInput = document.getElementById('seat-num-input');
    const weatherSelect = document.getElementById('nav-weather-select');
    const wheelchairCheck = document.getElementById('nav-wheelchair-check');
    const elderlyCheck = document.getElementById('nav-elderly-check');
    const familyCheck = document.getElementById('nav-family-check');

    if (secInput) this.state.section = secInput.value.trim() || '104';
    if (rowInput) this.state.row = rowInput.value.trim() || '12';
    if (seatInput) this.state.seat = seatInput.value.trim() || '8';
    if (weatherSelect) this.state.weather = weatherSelect.value;
    if (wheelchairCheck) this.state.accessibility = wheelchairCheck.checked;
    if (elderlyCheck) this.state.isElderly = elderlyCheck.checked;
    if (familyCheck) this.state.hasChildren = familyCheck.checked;

    try {
      const res = await fetch('/api/crowd/smart-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gate: 'Gate A',
          section: this.state.section,
          weather: this.state.weather,
          accessibility: this.state.accessibility,
          isElderly: this.state.isElderly,
          hasChildren: this.state.hasChildren
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.state.currentRoute = json.data;
        this.renderRouteInstructions(json.data);
        this.renderAiExplanation(json.data.aiExplanation);
        this.renderCanvasMap(true);
      }
    } catch (err) {
      console.error('Error calculating smart route:', err);
    }
  },

  renderRouteInstructions(routeData) {
    if (!this.routeInstructions) return;

    const stepsHtml = (routeData.routeSteps || []).map((s, idx) => `
      <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
        <span style="background: var(--accent-emerald); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem;">${idx + 1}</span>
        <span style="font-size: 0.9rem;">${s}</span>
      </div>
    `).join('');

    this.routeInstructions.innerHTML = `
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 1.05rem;"><i class="fas fa-route" style="color: var(--accent-emerald);"></i> Smart Route to Section ${routeData.section}</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="status-pill low">${routeData.walkingTimeMins} (${routeData.distanceMeters})</span>
            <button type="button" id="btn-copy-route" style="background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">📋 Copy</button>
          </div>
        </div>
        ${stepsHtml}
      </div>
    `;

    const copyBtn = document.getElementById('btn-copy-route');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = `FIFA 2026 Smart Route (Section ${routeData.section}):\n` + (routeData.routeSteps || []).join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showToast('📋 Smart Route copied to clipboard!');
        });
      });
    }

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Smart Route calculated to Section ${routeData.section}. Walking time: ${routeData.walkingTimeMins}`);
    }
  },

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  },

  renderAiExplanation(explanationText) {
    if (!this.aiExplanationCard || !this.aiExplanationText) return;
    if (!explanationText) {
      this.aiExplanationCard.style.display = 'none';
      return;
    }

    const formatted = explanationText
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    this.aiExplanationText.innerHTML = formatted;
    this.aiExplanationCard.style.display = 'block';
  },

  renderCanvasMap(showRoute = false) {
    if (!this.ctx || !this.canvas) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background Pitch Gradient
    const bg = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w/2);
    bg.addColorStop(0, '#0a1526');
    bg.addColorStop(1, '#040812');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Outer Stadium Oval
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w*0.42, h*0.38, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Grass Pitch
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w*0.22, h*0.18, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f3a22';
    ctx.fill();
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pitch Center Circle & Line
    ctx.beginPath();
    ctx.arc(w/2, h/2, 28, 0, 2 * Math.PI);
    ctx.stroke();

    // Gate Pins
    this.drawPin(w * 0.5, h * 0.1, 'Gate A', '#00e676');
    this.drawPin(w * 0.9, h * 0.5, 'Gate B', '#ffd700');
    this.drawPin(w * 0.5, h * 0.9, 'Gate C', '#ff2a5f');
    this.drawPin(w * 0.1, h * 0.5, 'Gate D', '#00e5ff');

    // Section 104 Target Pin
    this.drawPin(w * 0.65, h * 0.35, `Sec ${this.state.section}`, '#ffd700', true);

    // Draw Animated Route Line if active
    if (showRoute) {
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.moveTo(w * 0.5, h * 0.1); // Gate A
      ctx.lineTo(w * 0.58, h * 0.22);
      ctx.lineTo(w * 0.65, h * 0.35); // Target Section
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  },

  drawPin(x, y, label, color, isTarget = false) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, isTarget ? 10 : 7, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = isTarget ? 'bold 12px Outfit' : '10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 12);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});

window.Navigation = Navigation;
