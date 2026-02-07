/**
 * Locations Map Application
 *
 * Main application controller with state machine.
 * States: USA_VIEW → REGION_VIEW → LOCATION_VIEW
 * Supports both 2D SVG and 3D WebGL rendering.
 *
 * At startup, loads the client configuration from JSON, then injects
 * branding (DOM text) and theme (CSS custom properties) before
 * initializing the map components.
 */

import type { Region, Office, OfficeWithRegion } from './types/index.js';
import type { MarkerVisualState } from './lib/marker-state.js';
import { MapSvg } from './components/map-svg.js';
import { Map3D } from './components/map-3d.js';
import { TileMap } from './components/tile-map.js';
import { DetailsPanel } from './components/details-panel.js';
import { SpecialtyDivisionsPanel } from './components/specialty-divisions.js';
import { RegionList } from './components/region-list.js';
import {
  loadClientConfig,
  getClientRegions,
  getClientRegion,
  getClientOffices,
} from './lib/client-config.js';
import { getAvailableClients, getDefaultClient } from './lib/client-registry.js';
import { computeMarkerStates } from './lib/marker-state.js';
import { injectClientBranding } from './lib/dom-injector.js';
import { applyClientTheme } from './lib/theme-injector.js';
import { ensureOfficeWithRegion } from './lib/office-utils.js';

// Application states
const States = {
  USA_VIEW: 'USA_VIEW',
  REGION_VIEW: 'REGION_VIEW',
  LOCATION_VIEW: 'LOCATION_VIEW',
} as const;

type StateValue = (typeof States)[keyof typeof States];

// Map interface for polymorphism between 2D and 3D
interface MapComponent {
  selectRegion(regionName: string): void;
  selectOffice(office: Office | OfficeWithRegion): void;
  reset(): void;
  updateMarkerStates?(states: MarkerVisualState[]): void;
  dispose?(): void;
}

type MapMode = '2d' | '3d' | 'tile';

class App {
  private state: StateValue = States.USA_VIEW;
  private selectedRegion: Region | null = null;
  private selectedOffice: Office | null = null;
  private mapMode: MapMode;
  private transitioning: boolean = false;
  private resetting: boolean = false;

  // Component instances
  private map: MapComponent | null = null;
  private panel: DetailsPanel | null = null;
  private regionList: RegionList | null = null;
  // @ts-expect-error - initialized but read access not needed
  private specialtyPanel: SpecialtyDivisionsPanel | null = null;

  // DOM elements
  private mapContainer: HTMLElement | null;
  private panelContainer: HTMLElement | null;
  private regionListContainer: HTMLElement | null;
  private specialtyContainer: HTMLElement | null;
  private resetBtn: HTMLElement | null;
  private stateIndicator: HTMLElement | null;
  private modeSelector: HTMLElement | null;
  private spinBtn: HTMLElement | null;

  constructor() {
    // Rendering mode: default to 2D for testing
    this.mapMode = '2d';

    // DOM elements
    this.mapContainer = document.getElementById('map-container');
    this.panelContainer = document.getElementById('details-panel');
    this.regionListContainer = document.getElementById('region-list');
    this.specialtyContainer = document.getElementById('specialty-divisions');
    this.resetBtn = document.getElementById('reset-btn');
    this.stateIndicator = document.getElementById('state-indicator');
    this.modeSelector = document.querySelector('.mode-selector');
    this.spinBtn = document.getElementById('spin-toggle');

    this.init();
  }

  private async init(): Promise<void> {
    // Load client config, inject branding and theme BEFORE map init
    // Resolve client ID: use ?client= param, or default to first client in registry
    let clientId: string;
    try {
      const availableClients = await getAvailableClients();

      if (availableClients.length === 0) {
        console.error('Client registry is empty — no clients configured.');
        if (this.mapContainer) {
          this.mapContainer.innerHTML = `
            <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
              <h2>Configuration Error</h2>
              <p>No clients configured in registry. Please contact the administrator.</p>
            </div>`;
        }
        return;
      }

      const rawClientId = new URLSearchParams(window.location.search).get('client');

      if (rawClientId !== null) {
        clientId = rawClientId.trim().toLowerCase();
        // Validate against registry before attempting to load
        if (!availableClients.includes(clientId)) {
          console.error(`Unknown client: "${clientId}". Available: ${availableClients.join(', ')}`);
          if (this.mapContainer) {
            this.mapContainer.innerHTML = `
              <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                <h2>Configuration Error</h2>
                <p>Unknown client: &quot;${clientId.replace(/[<>"&]/g, '')}&quot;. Check the client registry.</p>
              </div>`;
          }
          return;
        }
      } else {
        // No ?client= param — use explicit default from registry
        clientId = await getDefaultClient();
      }
    } catch (err) {
      console.error('Failed to load client registry:', err);
      if (this.mapContainer) {
        this.mapContainer.innerHTML = `
          <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
            <h2>Configuration Error</h2>
            <p>Could not load client registry. Please check the console for details.</p>
          </div>`;
      }
      return;
    }

    try {
      const config = await loadClientConfig(clientId);
      injectClientBranding(config);
      applyClientTheme(config.theme);
    } catch (err) {
      console.error(`Failed to load client config for "${clientId}":`, err);
      // Config is required — all data access functions depend on it
      if (this.mapContainer) {
        this.mapContainer.innerHTML = `
          <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
            <h2>Configuration Error</h2>
            <p>Could not load client configuration. Please check the console for details.</p>
          </div>`;
      }
      return;
    }

    // Initialize map based on WebGL availability and user preference
    await this.initMap(); // CRITICAL: Must wait for map to fully initialize

    // Mode selector (2D / 3D / Map)
    if (this.modeSelector) {
      this.modeSelector.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.mode-btn') as HTMLElement | null;
        if (!btn) return;
        const mode = btn.dataset.mode as MapMode | undefined;
        if (mode && mode !== this.mapMode) {
          this.switchMapMode(mode);
        }
      });
      this.updateModeSelector();
    }

    // Spin toggle button (3D mode only)
    if (this.spinBtn) {
      this.spinBtn.addEventListener('click', () => this.handleSpinToggle());
    }
    this.updateSpinButtonVisibility();

    if (this.panelContainer) {
      this.panel = new DetailsPanel(this.panelContainer, {
        onClose: () => this.handlePanelClose(),
        onOfficeClick: (office: Office, region: Region) => this.handleOfficeClick(office, region),
      });
    }

    if (this.regionListContainer) {
      this.regionList = new RegionList(this.regionListContainer, {
        onRegionClick: (region: Region) => this.handleRegionClick(region.name),
        onOfficeClick: (office: Office, region: Region) => this.handleOfficeClick(office, region),
      });
    }

    if (this.specialtyContainer) {
      this.specialtyPanel = new SpecialtyDivisionsPanel(this.specialtyContainer);
    }

    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.handleReset());
    }

    // Handle URL hash for deep linking
    this.handleHashChange();
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Hide loading screen ONLY after map is fully initialized
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 500);
      }, 300);
    }

    this.updateUI();
  }

  private async initMap(): Promise<void> {
    if (!this.mapContainer) return;

    // Dispose existing map if switching
    if (this.map?.dispose) {
      this.map.dispose();
    }
    this.mapContainer.innerHTML = '';

    const mapOptions = {
      onRegionClick: (regionName: string) => this.handleRegionClick(regionName),
      onOfficeClick: (office: OfficeWithRegion) => this.handleOfficeClick(office),
      onReset: () => this.handleReset(),
    };

    if (this.mapMode === '3d') {
      try {
        this.map = new Map3D(this.mapContainer, mapOptions);
        // Map3D auto-initializes in constructor, no init() needed
        document.body.dataset.mapMode = '3d';
      } catch (e) {
        console.warn('3D map failed, falling back to 2D:', e);
        this.mapMode = '2d';
        const map2d = new MapSvg(this.mapContainer, mapOptions);
        await map2d.init(); // CRITICAL: Must await
        this.map = map2d;
        document.body.dataset.mapMode = '2d';
      }
    } else if (this.mapMode === 'tile') {
      try {
        const tileMap = new TileMap(this.mapContainer, mapOptions);
        await tileMap.init();
        this.map = tileMap;
        document.body.dataset.mapMode = 'tile';
      } catch (e) {
        console.warn('Tile map failed, falling back to 2D:', e);
        this.mapMode = '2d';
        const map2d = new MapSvg(this.mapContainer, mapOptions);
        await map2d.init();
        this.map = map2d;
        document.body.dataset.mapMode = '2d';
      }
    } else {
      const map2d = new MapSvg(this.mapContainer, mapOptions);
      await map2d.init(); // CRITICAL: Must await initialization
      this.map = map2d;
      document.body.dataset.mapMode = '2d';
    }
  }

  private lastToggleTime: number = 0;
  // Debounce window for toggle button - prevents double-click issues
  // Set slightly longer than typical double-click interval (300-500ms)
  private static readonly TOGGLE_DEBOUNCE_MS = 500;

  private async switchMapMode(mode: MapMode): Promise<void> {
    // Guard against re-entry during transition
    if (this.transitioning) return;
    if (mode === this.mapMode) return;

    // Debounce: prevent rapid successive switches (e.g., double-click)
    // Uses performance.now() for monotonic timing unaffected by system clock
    const now = performance.now();
    if (now - this.lastToggleTime < App.TOGGLE_DEBOUNCE_MS) return;
    this.lastToggleTime = now;

    this.transitioning = true;
    this.setModeButtonsEnabled(false);

    try {
      // Capture stable identifiers BEFORE disposing map
      // Using strings/codes instead of object references for stability
      const wasRegionName = this.selectedRegion?.name ?? null;
      const wasOfficeCode = this.selectedOffice?.officeCode ?? null;
      const wasOffice = this.selectedOffice; // Keep for panel restoration
      const wasRegion = this.selectedRegion; // Keep for panel restoration

      this.mapMode = mode;
      await this.initMap(); // CRITICAL: Must await full initialization
      this.updateModeSelector();
      this.updateSpinButtonVisibility();
      this.updateSpinButton(); // Reset visual state (autoRotate defaults to false)

      // Restore selection state AFTER map is fully initialized
      // This ensures marker visibility logic is properly triggered
      if (wasOfficeCode && wasOffice && wasRegion && this.map) {
        const officeWithRegion = ensureOfficeWithRegion(wasOffice, wasRegion.name);

        this.map.selectOffice(officeWithRegion);
        // Use consistent object for panel to avoid state divergence
        this.panel?.showOffice(officeWithRegion, wasRegion);
      } else if (wasRegionName && wasRegion && this.map) {
        // Use region name (stable identifier) to restore selection
        this.map.selectRegion(wasRegionName);
        // Also restore panel state
        this.panel?.showRegion(wasRegion);
      }
    } finally {
      this.transitioning = false;
      this.setModeButtonsEnabled(true);
    }
  }

  private updateModeSelector(): void {
    if (!this.modeSelector) return;
    const buttons = this.modeSelector.querySelectorAll('.mode-btn');
    buttons.forEach((btn) => {
      const mode = (btn as HTMLElement).dataset.mode;
      const isActive = mode === this.mapMode;
      btn.classList.toggle('active', isActive);
      (btn as HTMLElement).setAttribute('aria-pressed', String(isActive));
    });
  }

  private setModeButtonsEnabled(enabled: boolean): void {
    if (!this.modeSelector) return;
    const buttons = this.modeSelector.querySelectorAll('.mode-btn');
    buttons.forEach((btn) => {
      (btn as HTMLButtonElement).disabled = !enabled;
    });
  }

  private handleSpinToggle(): void {
    if (this.mapMode !== '3d' || !this.map) return;

    // Type guard: ensure map has toggleAutoRotate method
    if (!('toggleAutoRotate' in this.map)) return;

    // Call toggleAutoRotate on Map3D and update button state
    (this.map as Map3D).toggleAutoRotate();
    this.updateSpinButton();
  }

  private updateSpinButton(): void {
    if (!this.spinBtn) return;

    // Get current rotation state from Map3D (with type guard)
    const isSpinning =
      this.mapMode === '3d' && this.map && 'getAutoRotate' in this.map
        ? (this.map as Map3D).getAutoRotate()
        : false;

    // Toggle active class based on rotation state
    this.spinBtn.classList.toggle('active', isSpinning);

    // Update ARIA state
    this.spinBtn.setAttribute('aria-pressed', String(isSpinning));
  }

  private updateSpinButtonVisibility(): void {
    if (!this.spinBtn) return;

    // Show spin button only in 3D mode
    this.spinBtn.hidden = this.mapMode !== '3d';
  }

  /**
   * Compute and dispatch centralized marker states to the active renderer.
   */
  private dispatchMarkerStates(): void {
    if (!this.map) return;

    const allOffices = getClientOffices();
    const states = computeMarkerStates({
      allOffices,
      selectedRegion: this.selectedRegion?.name ?? null,
      selectedOfficeCode: this.selectedOffice?.officeCode ?? null,
      hoveredOfficeCode: null, // Hover is handled locally by each renderer
    });
    this.map.updateMarkerStates?.(states);
  }

  handleRegionClick(regionName: string): void {
    const region = getClientRegion(regionName);
    if (!region) return;

    this.state = States.REGION_VIEW;
    this.selectedRegion = region;
    this.selectedOffice = null;

    // Update URL hash (replaceState avoids triggering hashchange re-entrancy)
    history.replaceState(null, '', `#region=${encodeURIComponent(regionName)}`);

    // Update components
    this.map?.selectRegion(regionName);
    this.dispatchMarkerStates();
    this.panel?.showRegion(region);
    this.regionList?.highlightRegion(regionName);

    this.updateUI();
  }

  handleOfficeClick(office: Office | OfficeWithRegion, region: Region | null = null): void {
    // If region not provided, find it
    if (!region && this.selectedRegion) {
      region = this.selectedRegion;
    } else if (!region) {
      // Try to find region by officeCode first
      region =
        getClientRegions().find((r) => r.offices.some((o) => o.officeCode === office.officeCode)) ||
        null;
      // Fallback: use regionName if available (from 3D map's getAllOffices)
      if (!region && 'regionName' in office) {
        region = getClientRegion((office as OfficeWithRegion).regionName) || null;
      }
    }

    if (!region) return;

    this.state = States.LOCATION_VIEW;
    this.selectedRegion = region;
    this.selectedOffice = office;

    // Update URL hash (replaceState avoids triggering hashchange re-entrancy)
    history.replaceState(null, '', `#office=${encodeURIComponent(office.officeCode)}`);

    // Update components
    const officeWithRegion = ensureOfficeWithRegion(office, region.name);
    this.map?.selectOffice(officeWithRegion);
    this.dispatchMarkerStates();
    this.panel?.showOffice(office, region);

    this.updateUI();
  }

  private handlePanelClose(): void {
    if (this.state !== States.USA_VIEW) {
      this.handleReset();
    }
  }

  handleReset(): void {
    if (this.resetting) return;
    this.resetting = true;

    try {
      this.state = States.USA_VIEW;
      this.selectedRegion = null;
      this.selectedOffice = null;

      // Clear URL hash
      history.pushState(null, '', window.location.pathname);

      // Reset all components (map.reset() triggers onReset callback back to here, guard prevents re-entrancy)
      this.map?.reset();
      this.dispatchMarkerStates();
      this.panel?.showPlaceholder();
      this.panel?.close();
      this.regionList?.reset();

      this.updateUI();
    } finally {
      this.resetting = false;
    }
  }

  private handleHashChange(): void {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);

    if (params.has('office')) {
      const officeCode = decodeURIComponent(params.get('office') || '');
      const region = getClientRegions().find((r) =>
        r.offices.some((o) => o.officeCode === officeCode)
      );
      if (region) {
        const office = region.offices.find((o) => o.officeCode === officeCode);
        if (office) {
          this.handleOfficeClick(office, region);
          return;
        }
      }
    }

    if (params.has('region')) {
      const regionName = decodeURIComponent(params.get('region') || '');
      this.handleRegionClick(regionName);
      return;
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    // Escape to reset
    if (e.key === 'Escape') {
      if (this.state === States.LOCATION_VIEW) {
        // Go back to region view
        if (this.selectedRegion) {
          this.handleRegionClick(this.selectedRegion.name);
        }
      } else if (this.state === States.REGION_VIEW) {
        // Go back to USA view
        this.handleReset();
      }
    }
  }

  private updateUI(): void {
    // Update state indicator
    if (this.stateIndicator) {
      let breadcrumb = 'USA';
      if (this.state === States.REGION_VIEW && this.selectedRegion) {
        breadcrumb = `USA > ${this.selectedRegion.name}`;
      } else if (this.state === States.LOCATION_VIEW && this.selectedOffice) {
        breadcrumb = `USA > ${this.selectedRegion?.name || ''} > ${this.selectedOffice.city}`;
      }
      this.stateIndicator.textContent = breadcrumb;
    }

    // Update reset button visibility
    if (this.resetBtn) {
      (this.resetBtn as HTMLElement).hidden = this.state === States.USA_VIEW;
    }

    // Update body class for styling
    document.body.dataset.state = this.state.toLowerCase();
  }

  /** Get current state for testing */
  getState(): { state: StateValue; selectedRegion: Region | null; selectedOffice: Office | null } {
    return {
      state: this.state,
      selectedRegion: this.selectedRegion,
      selectedOffice: this.selectedOffice,
    };
  }

  /** Dispose resources for cleanup (e.g., HMR) */
  public dispose(): void {
    if (this.map?.dispose) {
      this.map.dispose();
    }
    // Future: add panel/listener cleanup if needed
  }
}

// Initialize app when DOM is ready
let app: App | null = null;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  (window as unknown as { app: App }).app = app;
});

// HMR support for development
if (import.meta.hot) {
  import.meta.hot.accept();

  import.meta.hot.dispose(() => {
    // Dispose active map component before module replacement
    if (app) {
      app.dispose();
    }
    console.log('[HMR] Disposing app.ts');
  });
}

export { App, States };
