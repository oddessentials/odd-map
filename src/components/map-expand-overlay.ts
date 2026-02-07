/**
 * Map Expand Overlay Component
 *
 * Full-screen overlay for expanded mini-map view.
 * Accepts a map element via DOM reparenting to preserve map state.
 * Dismissible via close button, Escape key, or click-outside.
 * Includes focus trapping and ARIA labels per accessibility requirements.
 */

interface MapExpandOverlayOptions {
  onClose: () => void;
}

export class MapExpandOverlay {
  private backdrop: HTMLElement;
  private dialog: HTMLElement;
  private mapContainer: HTMLElement;
  private closeBtn: HTMLButtonElement;
  private onClose: () => void;
  private previouslyFocused: HTMLElement | null = null;

  private handleKeydown: (e: KeyboardEvent) => void;
  private handleBackdropClick: (e: MouseEvent) => void;

  constructor(options: MapExpandOverlayOptions) {
    this.onClose = options.onClose;
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'map-expand-overlay';
    this.backdrop.setAttribute('aria-hidden', 'true');

    // Dialog container
    this.dialog = document.createElement('div');
    this.dialog.className = 'map-expand-dialog';
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    this.dialog.setAttribute('aria-label', 'Expanded map view');

    // Map container inside dialog
    this.mapContainer = document.createElement('div');
    this.mapContainer.className = 'map-expand-content';

    // Close button
    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'map-expand-close-btn';
    this.closeBtn.setAttribute('aria-label', 'Close expanded map');
    this.closeBtn.type = 'button';
    this.closeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    `;

    // Assemble
    this.dialog.appendChild(this.closeBtn);
    this.dialog.appendChild(this.mapContainer);

    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.dialog);

    // Trigger animation
    requestAnimationFrame(() => {
      this.backdrop.classList.add('visible');
      this.dialog.classList.add('visible');
    });

    // Event handlers
    this.handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      }

      // Focus trapping on Tab
      if (e.key === 'Tab') {
        const focusable = this.dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    this.handleBackdropClick = (e: MouseEvent) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    };

    // Attach events
    document.addEventListener('keydown', this.handleKeydown);
    this.backdrop.addEventListener('click', this.handleBackdropClick);
    this.closeBtn.addEventListener('click', () => this.close());

    // Focus the close button
    requestAnimationFrame(() => this.closeBtn.focus());
  }

  /**
   * Reparent the map element into the overlay container.
   */
  setMapElement(mapElement: HTMLElement): void {
    this.mapContainer.appendChild(mapElement);
  }

  /**
   * Close the overlay and clean up.
   */
  close(): void {
    // Notify parent (triggers reparent back to inline container)
    this.onClose();

    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeydown);
    this.backdrop.removeEventListener('click', this.handleBackdropClick);

    // Animate out, then remove from DOM
    this.backdrop.classList.remove('visible');
    this.dialog.classList.remove('visible');

    setTimeout(() => {
      this.backdrop.remove();
      this.dialog.remove();

      // Restore focus
      if (this.previouslyFocused?.focus) {
        this.previouslyFocused.focus();
      }
    }, 200);
  }
}
