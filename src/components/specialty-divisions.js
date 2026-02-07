/**
 * Specialty Divisions Panel
 *
 * Displays non-geographic specialty divisions (Brokerage, Environmental, etc.)
 * as a separate collapsible section outside the map.
 */

import { getActiveConfig } from '../lib/client-config.js';
import { escapeHtml } from '../lib/escape-html.js';

export class SpecialtyDivisionsPanel {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    let html = `
      <div class="specialty-panel">
        <h2 class="specialty-panel-title">Specialty Divisions</h2>
        <p class="specialty-panel-desc">Our specialty divisions serve clients nationwide.</p>
        <div class="specialty-accordion">
    `;

    const specialtyDivisions = getActiveConfig().specialtyDivisions ?? [];

    specialtyDivisions.forEach((division, index) => {
      const personnel = division.personnel || [];

      html += `
        <div class="accordion-item" data-index="${index}">
          <button class="accordion-header" aria-expanded="false" aria-controls="division-${index}">
            <span class="accordion-title">${escapeHtml(division.name)}</span>
            <span class="accordion-count">${personnel.length} contact${personnel.length !== 1 ? 's' : ''}</span>
            <svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="accordion-content" id="division-${index}" hidden>
            <div class="personnel-list">
              ${personnel
                .map(
                  (person) => `
                <div class="personnel-card">
                  <div class="personnel-name">${escapeHtml(person.name)}</div>
                  <div class="personnel-title">${escapeHtml(person.title || '')}</div>
                  <div class="personnel-contact">
                    ${person.phone ? `<a href="tel:${escapeHtml(person.phone)}" class="contact-link phone">${escapeHtml(person.phone)}</a>` : ''}
                    ${person.email ? `<a href="mailto:${escapeHtml(person.email)}" class="contact-link email">${escapeHtml(person.email)}</a>` : ''}
                  </div>
                  ${
                    person.vcardUrl
                      ? `
                    <a href="${escapeHtml(person.vcardUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">
                      Download vCard
                    </a>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.setupAccordion();
  }

  setupAccordion() {
    const headers = this.container.querySelectorAll('.accordion-header');

    headers.forEach((header) => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = header.getAttribute('aria-expanded') === 'true';

        // Close all other items
        this.container.querySelectorAll('.accordion-item').forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.accordion-content').hidden = true;
            otherItem.classList.remove('open');
          }
        });

        // Toggle this item
        header.setAttribute('aria-expanded', !isOpen);
        content.hidden = isOpen;
        item.classList.toggle('open', !isOpen);
      });
    });
  }
}
