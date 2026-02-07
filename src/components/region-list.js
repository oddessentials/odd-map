/**
 * Region List Component
 *
 * Text-based fallback navigation for regions and offices.
 * Shows as a sidebar or mobile navigation.
 */

import { getClientRegions, getClientRegion } from '../lib/client-config.js';
import { escapeHtml } from '../lib/escape-html.js';

export class RegionList {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onRegionClick: options.onRegionClick || (() => {}),
      onOfficeClick: options.onOfficeClick || (() => {}),
    };

    this.selectedRegion = null;
    this.init();
  }

  init() {
    let html = `
      <nav class="region-nav" aria-label="Regions">
        <h2 class="region-nav-title">Regions</h2>
        <ul class="region-list">
    `;

    getClientRegions().forEach((region) => {
      const offices = region.offices || [];

      html += `
        <li class="region-list-item" data-region="${escapeHtml(region.name)}">
          <button class="region-btn" aria-expanded="false">
            <span class="region-name">${escapeHtml(region.name)}</span>
            <span class="region-count">${offices.length} office${offices.length !== 1 ? 's' : ''}</span>
          </button>
          <ul class="office-sublist" hidden>
            ${offices
              .map(
                (office) => `
              <li class="office-subitem" data-office-code="${escapeHtml(office.officeCode)}">
                <button class="office-subbtn">
                  <span class="office-city">${escapeHtml(office.city)}, ${escapeHtml(office.state)}</span>
                  <span class="office-type">${office.officeType === 'Satellite Sales Office' ? 'Satellite' : 'Branch'}</span>
                </button>
              </li>
            `
              )
              .join('')}
          </ul>
        </li>
      `;
    });

    html += `
        </ul>
      </nav>
    `;

    this.container.innerHTML = html;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Region buttons
    this.container.querySelectorAll('.region-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.region-list-item');
        const regionName = item.dataset.region;
        const sublist = item.querySelector('.office-sublist');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all other regions
        this.container.querySelectorAll('.region-list-item').forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.querySelector('.region-btn').setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.office-sublist').hidden = true;
            otherItem.classList.remove('expanded');
          }
        });

        // Toggle this region
        btn.setAttribute('aria-expanded', !isOpen);
        sublist.hidden = isOpen;
        item.classList.toggle('expanded', !isOpen);

        if (!isOpen) {
          this.selectedRegion = regionName;
          const region = getClientRegion(regionName);
          this.options.onRegionClick(region);
        }
      });
    });

    // Office buttons
    this.container.querySelectorAll('.office-subbtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.office-subitem');
        const officeCode = item.dataset.officeCode;
        const regionItem = item.closest('.region-list-item');
        const regionName = regionItem.dataset.region;

        const region = getClientRegion(regionName);
        const office = region?.offices.find((o) => o.officeCode === officeCode);

        if (office) {
          // Highlight selected
          this.container
            .querySelectorAll('.office-subitem')
            .forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');

          this.options.onOfficeClick(office, region);
        }
      });
    });
  }

  highlightRegion(regionName) {
    this.container.querySelectorAll('.region-list-item').forEach((item) => {
      if (item.dataset.region === regionName) {
        item.classList.add('active');
        item.querySelector('.region-btn').setAttribute('aria-expanded', 'true');
        item.querySelector('.office-sublist').hidden = false;
      } else {
        item.classList.remove('active');
      }
    });
  }

  reset() {
    this.selectedRegion = null;
    this.container.querySelectorAll('.region-list-item').forEach((item) => {
      item.classList.remove('active', 'expanded');
      item.querySelector('.region-btn').setAttribute('aria-expanded', 'false');
      item.querySelector('.office-sublist').hidden = true;
    });
    this.container.querySelectorAll('.office-subitem').forEach((item) => {
      item.classList.remove('selected');
    });
  }
}
