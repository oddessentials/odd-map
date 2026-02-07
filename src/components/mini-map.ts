/**
 * Mini-Map Component
 *
 * Renders an interactive map for a single office location.
 * Used in both the details panel (2D mode) and office modal (3D mode).
 * Manages provider lifecycle, fly-to animations, and expand/collapse.
 */

import type { Office } from '../types/index.js';
import type { MapProvider } from '../lib/map-providers/types.js';
import { createMapProvider } from '../lib/map-providers/provider-factory.js';
import { getMapProviderConfig } from '../lib/client-config.js';
import { MapExpandOverlay } from './map-expand-overlay.js';

export class MiniMap {
  private provider: MapProvider | null = null;
  private container: HTMLElement;
  private mapWrapper: HTMLElement;
  private expandBtn: HTMLButtonElement;
  private overlay: MapExpandOverlay | null = null;
  private currentOfficeCode: string | null = null;
  private lastOffice: Office | null = null;
  private lastBrandColor: string = '#00396c';
  private initializing = false;
  private disposed = false;
  private resizeObserver: ResizeObserver | null = null;
  private contextLostHandler: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    // Create internal structure
    this.mapWrapper = document.createElement('div');
    this.mapWrapper.className = 'mini-map-wrapper';
    this.container.appendChild(this.mapWrapper);

    // Expand button
    this.expandBtn = document.createElement('button');
    this.expandBtn.className = 'mini-map-expand-btn';
    this.expandBtn.setAttribute('aria-label', 'Expand map');
    this.expandBtn.title = 'Expand map';
    this.expandBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      </svg>
    `;
    this.container.appendChild(this.expandBtn);

    this.expandBtn.addEventListener('click', () => this.expand());
  }

  /**
   * Show/update the mini-map for an office location.
   * On first call: creates provider and initializes map.
   * On subsequent calls: flies to the new location.
   */
  async show(office: Office, brandColor: string): Promise<void> {
    if (this.disposed) return;

    // Same office - no-op
    if (this.currentOfficeCode === office.officeCode && this.provider) {
      return;
    }

    const { lat, lon } = office.coordinates;

    // If provider exists, fly to new location
    if (this.provider && this.currentOfficeCode !== null) {
      this.currentOfficeCode = office.officeCode;
      this.lastOffice = office;
      this.provider.flyTo(lat, lon, { duration: 1000 });
      return;
    }

    // First time: create and initialize provider
    if (this.initializing) return;
    this.initializing = true;

    try {
      const config = getMapProviderConfig();
      this.provider = createMapProvider(config);

      await this.provider.initialize(this.mapWrapper, {
        zoom: config.defaultZoom,
        interactive: true,
        attributionControl: true,
        style: this.detectThemeStyle(),
      });

      if (this.disposed) {
        this.provider?.dispose();
        this.provider = null;
        return;
      }

      this.provider.setLocation(lat, lon, { color: brandColor });
      this.currentOfficeCode = office.officeCode;
      this.lastOffice = office;
      this.lastBrandColor = brandColor;

      // Watch for container resize to keep map in sync
      this.setupResizeObserver();

      // Watch for WebGL context loss (can happen on Safari during DOM reparenting)
      this.setupContextLostHandler();
    } catch (err) {
      console.error('[mini-map] Failed to initialize map provider:', err);
      this.provider?.dispose();
      this.provider = null;
      this.showFallback();
    } finally {
      this.initializing = false;
    }
  }

  /**
   * Animate to a new office location.
   */
  flyTo(office: Office): void {
    if (!this.provider || this.disposed) return;

    const { lat, lon } = office.coordinates;
    this.currentOfficeCode = office.officeCode;
    this.lastOffice = office;
    this.provider.flyTo(lat, lon, { duration: 1000 });
  }

  /**
   * Expand the map into a full-screen overlay.
   */
  expand(): void {
    if (!this.provider || this.disposed) return;

    const mapElement = this.provider.getMapElement();

    this.overlay = new MapExpandOverlay({
      onClose: () => {
        // Reparent map element back to inline container
        this.mapWrapper.appendChild(mapElement);
        this.provider?.resize();
        this.overlay = null;
      },
    });

    // Reparent map element into overlay
    this.overlay.setMapElement(mapElement);
    this.provider.resize();
  }

  /**
   * Clean up all resources.
   */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.overlay) {
      this.overlay.close();
      this.overlay = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Remove WebGL context lost listener to prevent leaks
    if (this.contextLostHandler) {
      const canvas = this.mapWrapper.querySelector('canvas');
      canvas?.removeEventListener('webglcontextlost', this.contextLostHandler);
      this.contextLostHandler = null;
    }

    if (this.provider) {
      this.provider.dispose();
      this.provider = null;
    }

    this.currentOfficeCode = null;
    this.container.innerHTML = '';
  }

  /**
   * Watch for WebGL context loss on the map canvas.
   * DOM reparenting (expand/collapse) can trigger context loss on Safari.
   * On loss, show a brief message and reinitialize the map.
   */
  private setupContextLostHandler(): void {
    if (this.contextLostHandler) return;

    const canvas = this.mapWrapper.querySelector('canvas');
    if (!canvas) return;

    this.contextLostHandler = () => {
      if (this.disposed || !this.lastOffice) return;

      console.warn('[mini-map] WebGL context lost, reinitializing map');

      // Dispose the broken provider
      if (this.provider) {
        this.provider.dispose();
        this.provider = null;
      }
      this.currentOfficeCode = null;

      // Show brief loading message
      this.mapWrapper.innerHTML = `
        <div class="mini-map-fallback">
          <p>Reloading map...</p>
        </div>
      `;

      // Reinitialize after a short delay
      setTimeout(() => {
        if (this.disposed || !this.lastOffice) return;
        // Reset wrapper for new map
        this.mapWrapper.innerHTML = '';
        this.initializing = false;
        this.contextLostHandler = null;
        this.show(this.lastOffice, this.lastBrandColor);
      }, 300);
    };

    canvas.addEventListener('webglcontextlost', this.contextLostHandler);
  }

  /**
   * Set up ResizeObserver to call provider.resize() when container dimensions change.
   */
  private setupResizeObserver(): void {
    if (this.resizeObserver || !this.provider) return;

    try {
      this.resizeObserver = new ResizeObserver(() => {
        this.provider?.resize();
      });
      this.resizeObserver.observe(this.container);
    } catch {
      // ResizeObserver may not be available in older environments
    }
  }

  /**
   * Detect current theme style (light/dark) from CSS custom properties.
   */
  private detectThemeStyle(): 'light' | 'dark' {
    // Check if the page uses a dark theme via data attribute or media query
    if (document.documentElement.dataset.theme === 'dark') {
      return 'dark';
    }
    try {
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // matchMedia may not be available in test/SSR environments
    }
    return 'light';
  }

  /**
   * Show a friendly fallback message when the map fails to load.
   */
  private showFallback(): void {
    this.mapWrapper.innerHTML = `
      <div class="mini-map-fallback">
        <p>Map unavailable</p>
        <p class="mini-map-fallback-hint">Check your internet connection</p>
      </div>
    `;
  }
}
