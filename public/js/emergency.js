/**
 * FIFA World Cup 2026 Smart Stadium Assistant - Emergency SOS Controller
 * Manages 24/7 Security & Medical Dispatch and Zero-Hallucination Calm AI Protocols.
 */

const Emergency = {
  activeType: 'MEDICAL',

  init() {
    this.bindEvents();
    this.fetchEmergencyAssistance('MEDICAL');
  },

  bindEvents() {
    // SOS buttons (Header & Emergency Page)
    document.querySelectorAll('.trigger-sos-action').forEach(btn => {
      btn.addEventListener('click', () => this.openSOSModal());
    });

    const closeBtn = document.getElementById('sos-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeSOSModal());
    }

    const confirmSOSBtn = document.getElementById('confirm-sos-dispatch-btn');
    if (confirmSOSBtn) {
      confirmSOSBtn.addEventListener('click', () => this.dispatchEmergencySOS());
    }

    // Emergency Type Selector Buttons
    document.querySelectorAll('.emergency-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.emergency-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type');
        this.activeType = type;
        this.fetchEmergencyAssistance(type);
      });
    });
  },

  openSOSModal() {
    const modal = document.getElementById('sos-modal-overlay');
    if (modal) modal.classList.add('active');
  },

  closeSOSModal() {
    const modal = document.getElementById('sos-modal-overlay');
    if (modal) modal.classList.remove('active');
  },

  async fetchEmergencyAssistance(type = 'MEDICAL') {
    const card = document.getElementById('ai-emergency-protocol-card');
    if (!card) return;

    try {
      const res = await fetch('/api/emergency/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergencyType: type, section: '104' })
      });

      const json = await res.json();
      if (json.success && json.data) {
        this.renderCalmProtocol(json.data, card);
      }
    } catch (err) {
      console.error('Error fetching emergency assistance protocol:', err);
    }
  },

  renderCalmProtocol(data, container) {
    if (!container) return;

    const stepsHtml = (data.evacuationSteps || []).map(s => `
      <div style="margin-bottom: 8px; font-size: 0.9rem;">${s}</div>
    `).join('');

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 42, 95, 0.2); padding-bottom: 10px;">
        <div>
          <h4 style="color: var(--accent-danger); font-size: 1.05rem;">
            <i class="fas fa-shield-heart"></i> ${data.calmMessage}
          </h4>
          <div style="font-size: 0.8rem; color: var(--accent-gold); margin-top: 4px;">
            <i class="fas fa-phone"></i> Official Extension: <strong>${data.phoneExtension}</strong>
          </div>
        </div>
        <span class="status-pill live" style="font-size: 0.72rem;">${data.priority}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
        <div style="background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Nearest First Aid Station</div>
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent-emerald);">${data.nearestFirstAidStation}</div>
        </div>
        <div style="background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Nearest Verified Exit</div>
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent-cyan);">${data.nearestExit}</div>
        </div>
      </div>

      <div style="font-weight: 700; margin-bottom: 6px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">Calm Step-by-Step Instructions:</div>
      ${stepsHtml}
    `;

    if (window.Accessibility) {
      window.Accessibility.announceScreenReader(`Emergency protocol loaded for ${data.type}. Nearest First Aid is at ${data.nearestFirstAidStation}`);
    }
  },

  async dispatchEmergencySOS() {
    const locInput = document.getElementById('sos-location-input');
    const location = locInput ? locInput.value : 'Section 104, Row 12, Seat 8';

    try {
      const res = await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: '104', row: '12', seat: '8' })
      });

      const data = await res.json();
      if (data.success && data.dispatch) {
        this.closeSOSModal();
        const feedbackBox = document.getElementById('sos-dispatch-status-box');
        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.innerHTML = `
            <div class="glass-card" style="padding: 24px; border: 2px solid var(--accent-danger); text-align: center;">
              <div style="font-size: 2.5rem; color: var(--accent-danger); margin-bottom: 12px;">🚨</div>
              <h3 style="color: var(--accent-danger);">EMERGENCY DISPATCH ACTIVATED</h3>
              <p style="margin: 8px 0; font-weight: 700;">Dispatch ID: ${data.dispatch.dispatchId}</p>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Responders assigned: <strong>${data.dispatch.respondersAssigned.join(', ')}</strong></p>
              <p style="font-size: 0.88rem; color: var(--accent-gold); margin-top: 12px;"><i class="fas fa-truck-medical"></i> Estimated Arrival: ~${data.dispatch.eta}</p>
              <p style="font-size: 0.82rem; color: var(--accent-emerald); margin-top: 8px;">Nearest First Aid: ${data.dispatch.nearestFirstAidStation}</p>
            </div>
          `;
        }
      }
    } catch (err) {
      alert("Emergency call failed to dispatch. Please report immediately to any nearby Stadium Steward!");
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Emergency.init();
});

window.Emergency = Emergency;
