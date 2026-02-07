/**
 * Details Panel Component
 *
 * Displays detailed information for a selected office location.
 * Includes: name, type, address, contacts, action buttons.
 */

import { escapeHtml } from '../lib/escape-html.js';
import { getActiveConfig } from '../lib/client-config.js';
import { MiniMap } from './mini-map.js';

export class DetailsPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onClose: options.onClose || (() => {}),
      onOfficeClick: options.onOfficeClick || null,
    };

    this.currentOffice = null;
    this.currentRegion = null;
    this.miniMap = null;
    this.miniMapContainer = null;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="panel-content">
        <div class="panel-header">
          <h2 class="panel-title">Select a Location</h2>
          <button class="panel-close btn btn-secondary" aria-label="Close panel">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="panel-body">
          <p class="panel-placeholder"></p>
        </div>
      </div>
    `;

    this.closeBtn = this.container.querySelector('.panel-close');
    this.titleEl = this.container.querySelector('.panel-title');
    this.bodyEl = this.container.querySelector('.panel-body');

    // Set placeholder via textContent to safely handle special characters in client name
    const placeholder = this.bodyEl.querySelector('.panel-placeholder');
    if (placeholder) {
      try {
        placeholder.textContent = `Click on a region to explore ${getActiveConfig().name} offices.`;
      } catch {
        placeholder.textContent = 'Click on a region to explore offices.';
      }
    }

    this.closeBtn.addEventListener('click', () => {
      this.options.onClose();
    });

    // Hide close button in initial placeholder state (no-op when nothing selected)
    this.closeBtn.classList.add('panel-close--hidden');

    // Setup mobile swipe-to-dismiss gestures
    this.setupMobileGestures();
  }

  /**
   * Swipe-to-dismiss for the mobile bottom sheet.
   * Uses touch events (not pointer) so it only fires on touch devices
   * and doesn't interfere with mouse interactions on desktop.
   */
  setupMobileGestures() {
    let startY = 0;
    let startScrollTop = 0;
    let currentTranslateY = 0;
    let tracking = false;

    this.container.addEventListener(
      'touchstart',
      (e) => {
        if (!this.container.classList.contains('open')) return;
        if (!e.touches.length) return;
        const touch = e.touches[0];
        startY = touch.clientY;
        startScrollTop = this.bodyEl.scrollTop;
        currentTranslateY = 0;
        tracking = true;
      },
      { passive: true }
    );

    this.container.addEventListener(
      'touchmove',
      (e) => {
        if (!tracking) return;
        if (!e.touches.length) return;
        const touch = e.touches[0];
        const deltaY = touch.clientY - startY;

        // Only intercept if panel is scrolled to top and swiping down
        if (startScrollTop <= 1 && deltaY > 0) {
          e.preventDefault();
          // Resistance factor for natural feel
          currentTranslateY = deltaY * 0.6;
          this.container.style.transform = `translateY(${currentTranslateY}px)`;
          this.container.style.transition = 'none';
        }
      },
      { passive: false }
    );

    const onTouchEnd = () => {
      if (!tracking) return;
      tracking = false;

      if (currentTranslateY > 80) {
        // Dismiss: animate down and close
        this.container.style.transition = 'transform 0.25s ease-out';
        this.container.style.transform = 'translateY(100%)';
        this.container.classList.remove('open');
        this.options.onClose();

        // Reset after transition
        setTimeout(() => {
          this.container.style.transition = '';
          this.container.style.transform = '';
        }, 250);
      } else if (currentTranslateY > 0) {
        // Snap back
        this.container.style.transition = 'transform 0.2s ease-out';
        this.container.style.transform = '';

        setTimeout(() => {
          this.container.style.transition = '';
        }, 200);
      }

      currentTranslateY = 0;
    };

    this.container.addEventListener('touchend', onTouchEnd, { passive: true });
    // Handle touchcancel (system gesture interruption) — snap back to prevent stuck state
    this.container.addEventListener('touchcancel', onTouchEnd, { passive: true });
  }

  showRegion(region) {
    // Dispose mini-map when switching to region view
    if (this.miniMap) {
      this.miniMap.dispose();
      this.miniMap = null;
      this.miniMapContainer = null;
    }

    this.currentRegion = region;
    this.currentOffice = null;
    this.closeBtn.classList.remove('panel-close--hidden');

    this.titleEl.textContent = region.name;

    const offices = region.offices || [];
    const personnel = region.personnel || [];

    let html = '';

    // Region manager info
    if (personnel.length > 0) {
      const manager = personnel[0];
      html += `
        <div class="region-manager">
          <h3>Regional Manager</h3>
          <div class="contact-card">
            <div class="contact-name">${escapeHtml(manager.name)}</div>
            <div class="contact-title">${escapeHtml(manager.title)}</div>
            ${manager.phone ? `<div class="contact-phone"><a href="tel:${escapeHtml(manager.phone)}">${escapeHtml(manager.phone)}</a></div>` : ''}
            ${manager.email ? `<div class="contact-email"><a href="mailto:${escapeHtml(manager.email)}">${escapeHtml(manager.email)}</a></div>` : ''}
            ${manager.vcardUrl ? `<a href="${manager.vcardUrl}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">Download vCard</a>` : ''}
          </div>
        </div>
      `;
    }

    // Office list
    if (offices.length > 0) {
      html += `
        <div class="office-list">
          <h3>Offices in this Region</h3>
          <ul class="office-items">
            ${offices
              .map(
                (office) => `
              <li class="office-item" data-office-code="${escapeHtml(office.officeCode)}">
                <button class="office-btn">
                  <span class="office-city">${escapeHtml(office.city)}, ${escapeHtml(office.state)}</span>
                  <span class="office-code">${escapeHtml(office.officeCode)}</span>
                  <span class="office-type">${escapeHtml(office.officeType)}</span>
                </button>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      `;
    } else {
      html += '<p class="no-offices">No offices in this region.</p>';
    }

    this.bodyEl.innerHTML = html;

    // Add click handlers to office items
    this.bodyEl.querySelectorAll('.office-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.closest('.office-item').dataset.officeCode;
        const office = offices.find((o) => o.officeCode === code);
        if (office) {
          if (this.options.onOfficeClick) {
            this.options.onOfficeClick(office, region);
          } else {
            this.showOffice(office, region);
          }
        }
      });
    });

    this.container.classList.add('open');
  }

  showOffice(office, region) {
    this.currentOffice = office;
    this.currentRegion = region;
    this.closeBtn.classList.remove('panel-close--hidden');

    this.titleEl.textContent = `${office.city}, ${office.state}`;

    // Find manager for this office (use region manager)
    const personnel = region?.personnel || [];
    const manager = personnel[0];

    let html = `
      <div class="office-details">
        <!-- Logo placeholder slot -->
        <div class="office-logo-slot" style="--logo-url: var(--logo-url, none)">
          <div class="logo-placeholder" aria-hidden="true"></div>
        </div>

        <div class="office-header">
          <div class="office-code-badge">${escapeHtml(office.officeCode)}</div>
          <div class="office-type-badge ${office.officeType === 'Satellite Sales Office' ? 'satellite' : 'branch'}">${escapeHtml(office.officeType)}</div>
        </div>

        ${
          office.address
            ? `
          <div class="office-address">
            <h4>Address</h4>
            <address>${escapeHtml(office.address)}</address>
            <a href="${office.directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}" class="btn btn-accent" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Get Directions
            </a>
          </div>
        `
            : `
          <div class="office-address">
            <p class="no-address">Address not available for this satellite office.</p>
          </div>
        `
        }
    `;

    // Manager contact
    if (manager) {
      html += `
        <div class="office-contact">
          <h4>Contact</h4>
          <div class="contact-card">
            <div class="contact-name">${escapeHtml(manager.name)}</div>
            <div class="contact-title">${escapeHtml(manager.title)}</div>
            ${manager.phone ? `<div class="contact-phone"><a href="tel:${escapeHtml(manager.phone)}">${escapeHtml(manager.phone)}</a></div>` : ''}
            ${manager.email ? `<div class="contact-email"><a href="mailto:${escapeHtml(manager.email)}">${escapeHtml(manager.email)}</a></div>` : ''}
            ${
              manager.vcardUrl
                ? `
              <a href="${manager.vcardUrl}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Download vCard
              </a>
            `
                : ''
            }
          </div>
        </div>
      `;
    }

    // Coordinates confidence warning
    if (office.coordinates?.approximate) {
      html += `
        <div class="coord-warning">
          <small>📍 Location shown is approximate (${escapeHtml(office.coordinates.source)})</small>
        </div>
      `;
    }

    html += '</div>';

    this.bodyEl.innerHTML = html;
    this.container.classList.add('open');

    // Re-append persistent mini-map container AFTER innerHTML (which destroys prior DOM).
    // MiniMap is created once and reused — subsequent calls trigger fly-to animation.
    if (office.coordinates?.lat && office.coordinates?.lon) {
      if (!this.miniMapContainer) {
        this.miniMapContainer = document.createElement('div');
        this.miniMapContainer.className = 'mini-map-container';
        this.miniMapContainer.id = 'details-mini-map';
      }
      this.bodyEl.querySelector('.office-details')?.appendChild(this.miniMapContainer);

      const brandColor =
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
        '#00396c';

      if (!this.miniMap) {
        this.miniMap = new MiniMap(this.miniMapContainer);
      }
      this.miniMap.show(office, brandColor);
    }
  }

  showPlaceholder(message) {
    // Dispose mini-map when resetting panel
    if (this.miniMap) {
      this.miniMap.dispose();
      this.miniMap = null;
      this.miniMapContainer = null;
    }

    if (!message) {
      try {
        message = `Click on a region to explore ${getActiveConfig().name} offices.`;
      } catch {
        message = 'Click on a region to explore offices.';
      }
    }
    this.currentOffice = null;
    this.currentRegion = null;

    this.titleEl.textContent = 'Select a Location';
    this.bodyEl.innerHTML = '<p class="panel-placeholder"></p>';
    this.bodyEl.querySelector('.panel-placeholder').textContent = message;
    this.closeBtn.classList.add('panel-close--hidden');
  }

  close() {
    this.container.classList.remove('open');
  }

  open() {
    this.container.classList.add('open');
  }
}
