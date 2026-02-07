/**
 * Office Modal Component
 *
 * Displays office details in an accessible modal dialog.
 * No API keys required - uses static data and Google Maps URLs.
 *
 * Accessibility features:
 * - ESC to close
 * - Click outside to close
 * - Focus trapping
 * - ARIA labels
 */

import { escapeHtml } from '../lib/escape-html.js';

export class OfficeModal {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.focusableElements = [];
    this.previouslyFocused = null;
    this.isOpen = false;

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /**
   * Create and show the modal
   * @param {Object} office - Office data with city, state, address, coordinates
   * @param {Object} region - Region data with personnel
   */
  show(office, region) {
    if (this.isOpen) this.close();

    this.previouslyFocused = document.activeElement;
    this.createModal(office, region);
    this.isOpen = true;

    // Add event listeners
    document.addEventListener('keydown', this.handleKeydown);

    // Focus first focusable element after a brief delay
    requestAnimationFrame(() => {
      this.updateFocusableElements();
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    });
  }

  createModal(office, region) {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'office-modal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.addEventListener('click', this.handleClickOutside);

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'office-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'office-modal-title');

    // Build directions URL
    const directionsUrl = this.buildDirectionsUrl(office);

    // Modal content
    this.modal.innerHTML = `
            <div class="office-modal-header">
                <h2 id="office-modal-title">${escapeHtml(office.city)}, ${escapeHtml(office.state)}</h2>
                <button 
                    class="office-modal-close" 
                    aria-label="Close modal"
                    type="button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="office-modal-body">
                <div class="office-modal-info">
                    <p class="office-type">${escapeHtml(office.officeType || 'Office')}</p>
                    ${
                      office.address
                        ? `
                        <p class="office-address">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${escapeHtml(office.address)}
                        </p>
                    `
                        : ''
                    }
                    ${
                      region?.personnel?.[0]
                        ? `
                        <div class="office-contact">
                            <p class="contact-name">${escapeHtml(region.personnel[0].name)}</p>
                            <p class="contact-title">${escapeHtml(region.personnel[0].title)}</p>
                            ${
                              region.personnel[0].phone
                                ? `
                                <p class="contact-phone">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                    <a href="tel:${escapeHtml(region.personnel[0].phone)}">${escapeHtml(region.personnel[0].phone)}</a>
                                </p>
                            `
                                : ''
                            }
                            ${
                              region.personnel[0].email
                                ? `
                                <p class="contact-email">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                    <a href="mailto:${escapeHtml(region.personnel[0].email)}">${escapeHtml(region.personnel[0].email)}</a>
                                </p>
                            `
                                : ''
                            }
                        </div>
                    `
                        : ''
                    }
                </div>
            </div>
            <div class="office-modal-footer">
                <a 
                    href="${directionsUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn btn-primary directions-btn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                    </svg>
                    Get Directions
                </a>
            </div>
        `;

    // Add close button handler
    const closeBtn = this.modal.querySelector('.office-modal-close');
    closeBtn.addEventListener('click', () => this.close());

    // Append to DOM
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.modal);

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('visible');
      this.modal.classList.add('visible');
    });
  }

  buildDirectionsUrl(office) {
    // Prefer coordinates if available, otherwise use address
    if (office.coordinates?.lat && office.coordinates?.lon) {
      return `https://www.google.com/maps/dir/?api=1&destination=${office.coordinates.lat},${office.coordinates.lon}`;
    } else if (office.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(office.address)}`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.city + ', ' + office.state)}`;
    }
  }

  updateFocusableElements() {
    if (!this.modal) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    this.focusableElements = Array.from(this.modal.querySelectorAll(focusableSelectors.join(',')));
  }

  handleKeydown(event) {
    if (!this.isOpen) return;

    // ESC to close
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    // Tab focus trapping
    if (event.key === 'Tab') {
      this.updateFocusableElements();

      if (this.focusableElements.length === 0) return;

      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleClickOutside(event) {
    if (event.target === this.overlay) {
      this.close();
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    document.removeEventListener('keydown', this.handleKeydown);

    // Animate out
    if (this.modal) this.modal.classList.remove('visible');
    if (this.overlay) this.overlay.classList.remove('visible');

    // Remove after animation
    setTimeout(() => {
      if (this.modal?.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      if (this.overlay?.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.modal = null;
      this.overlay = null;

      // Restore focus
      if (this.previouslyFocused && this.previouslyFocused.focus) {
        this.previouslyFocused.focus();
      }
    }, 200);
  }
}

// Singleton instance
let modalInstance = null;

export function showOfficeModal(office, region) {
  if (!modalInstance) {
    modalInstance = new OfficeModal();
  }
  modalInstance.show(office, region);
  return modalInstance;
}

export function closeOfficeModal() {
  if (modalInstance) {
    modalInstance.close();
  }
}
