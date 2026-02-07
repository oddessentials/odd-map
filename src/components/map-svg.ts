/**
 * SVG Map Component
 *
 * Handles rendering and interaction for the 2D SVG USA map.
 * Supports: region selection, zoom to region, location markers.
 */

import type { OfficeWithRegion, MapOptions, ViewBox } from '../types/index.js';
import type { MarkerVisualState } from '../lib/marker-state.js';
import { getMarkerPosition, initProjection } from '../lib/projection.js';
import {
  getClientOffices,
  getActiveConfig,
  validateRegionReferences,
} from '../lib/client-config.js';
import { getConfigForClient } from '../lib/client-registry.js';
import { clampBounds } from '../lib/bounds-clamping.js';

// Map constants
const MAP_WIDTH = 960;
const MAP_HEIGHT = 600;
const DEFAULT_VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
const REGION_PADDING = 30; // Padding around region bounds for comfortable viewing

// Export getMarkerPosition for use by other components
export { getMarkerPosition, initProjection } from '../lib/projection.js';

export class MapSvg {
  private container: HTMLElement;
  private options: Required<MapOptions>;
  private svgElement: SVGSVGElement | null = null;
  private selectedRegion: string | null = null;
  private selectedOffice: OfficeWithRegion | null = null;
  private regionBounds: Map<string, ViewBox> = new Map();

  // Race condition fix: track marker initialization state
  private markersReady: boolean = false;
  private pendingRegionSelection: string | null = null;

  constructor(container: HTMLElement, options: MapOptions = {}) {
    this.container = container;
    this.options = {
      onRegionClick: options.onRegionClick ?? (() => {}),
      onOfficeClick: options.onOfficeClick ?? (() => {}),
      onReset: options.onReset ?? (() => {}),
    };

    // DO NOT auto-initialize - caller must explicitly await init()
    // this.init(); // REMOVED - causes race condition
  }

  async init(): Promise<void> {
    // Reset initialization state
    this.markersReady = false;
    this.pendingRegionSelection = null;

    try {
      // Initialize projection system first
      const clientId = getActiveConfig().clientId;
      await initProjection(clientId);
      console.log('✅ Projection system initialized');

      // Cross-validate office regions against map config regions
      const mapConfig = await getConfigForClient(clientId);
      const mapRegionNames = (mapConfig.regions ?? []).map((r) => r.name);
      validateRegionReferences(mapRegionNames);
    } catch (err) {
      console.error('❌ Failed to initialize projection:', err);
      this.container.innerHTML = `
                <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                    <h2>🚨 Map Initialization Failed</h2>
                    <p>Could not load map configuration. Please check the console for details.</p>
                    <pre>${err}</pre>
                </div>
            `;
      return;
    }

    // Load SVG using Vite asset import (works in dev and prod)
    try {
      const svgModule = await import('../assets/usa-regions.svg?raw');
      const svgText = svgModule.default;

      this.container.innerHTML = svgText;
      this.svgElement = this.container.querySelector('svg');

      if (!this.svgElement) {
        throw new Error('SVG element not found after loading');
      }
    } catch (err) {
      console.error('❌ Failed to load SVG:', err);
      this.container.innerHTML = `
                <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                    <h2>🚨 SVG Loading Failed</h2>
                    <p>Could not load map SVG. Please check the console for details.</p>
                    <pre>${err}</pre>
                </div>
            `;
      return;
    }

    // Calculate region bounds from actual SVG geometry
    this.calculateRegionBounds();

    this.setupEventListeners();
    this.addMarkers();
  }

  /**
   * Calculate bounding boxes for each region from SVG group elements
   */
  private calculateRegionBounds(): void {
    if (!this.svgElement) return;

    const regionGroups = this.svgElement.querySelectorAll<SVGGElement>('[data-region]');
    regionGroups.forEach((group) => {
      const regionName = group.dataset.region;
      if (!regionName) return;

      try {
        const bbox = group.getBBox();
        this.regionBounds.set(regionName, clampBounds(bbox, REGION_PADDING, MAP_WIDTH, MAP_HEIGHT));
      } catch (e) {
        console.warn(`Failed to calculate bounds for region: ${regionName}`, e);
      }
    });
  }

  private setupEventListeners(): void {
    if (!this.svgElement) return;

    // Region click handlers
    const regionGroups = this.svgElement.querySelectorAll<SVGGElement>('[data-region]');
    regionGroups.forEach((group) => {
      group.addEventListener('click', () => {
        const regionName = group.dataset.region;
        if (regionName) {
          this.selectRegion(regionName);
          this.options.onRegionClick(regionName);
        }
      });

      group.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const regionName = group.dataset.region;
          if (regionName) {
            this.selectRegion(regionName);
            this.options.onRegionClick(regionName);
          }
        }
      });
    });
  }

  private addMarkers(): void {
    if (!this.svgElement) return;

    const markersGroup = this.svgElement.querySelector('#markers');
    if (!markersGroup) return;

    const offices = getClientOffices();
    let successCount = 0;
    let errorCount = 0;

    offices.forEach((office: OfficeWithRegion) => {
      try {
        // Use office code for deterministic lookup
        const { x, y } = getMarkerPosition(office.officeCode);

        // Create a group for the marker
        const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        markerGroup.setAttribute('class', 'marker-group');
        markerGroup.setAttribute('data-office-code', office.officeCode);
        markerGroup.setAttribute('data-region', office.regionName);
        markerGroup.setAttribute('transform', `translate(${x}, ${y})`);

        // Create pin-shaped marker using relative path coordinates (won't scale with viewBox)
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        // Simple pin/teardrop shape using relative coordinates centered at 0,0
        // The pin points downward (at y=0) with the bulbous top above
        const pinPath = 'M 0,0 C -2,-6 -4,-8 -4,-12 A 4,4 0 1,1 4,-12 C 4,-8 2,-6 0,0 Z';

        marker.setAttribute('d', pinPath);
        marker.setAttribute('class', 'marker');
        marker.setAttribute('vector-effect', 'non-scaling-stroke');
        marker.setAttribute('role', 'button');
        marker.setAttribute('tabindex', '0');
        marker.setAttribute('aria-label', `${office.city}, ${office.state} - ${office.officeType}`);

        markerGroup.style.pointerEvents = 'auto';

        marker.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          this.selectOffice(office);
          this.options.onOfficeClick(office);
        });

        marker.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectOffice(office);
            this.options.onOfficeClick(office);
          }
        });

        // Transparent hit area for touch targets (~44px equivalent at region zoom)
        const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hitArea.setAttribute('cx', '0');
        hitArea.setAttribute('cy', '-8');
        hitArea.setAttribute('r', '12');
        hitArea.setAttribute('fill', 'transparent');
        hitArea.setAttribute('stroke', 'none');
        hitArea.setAttribute('pointer-events', 'all');
        hitArea.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          this.selectOffice(office);
          this.options.onOfficeClick(office);
        });

        markerGroup.appendChild(hitArea);
        markerGroup.appendChild(marker);
        markersGroup.appendChild(markerGroup);
        successCount++;
      } catch (err) {
        // LOUD FAILURE: Missing coordinate
        const error = err as Error;
        console.error(`🚨 ${error.message}`);
        errorCount++;

        // Create visible error placeholder
        const errorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        errorGroup.setAttribute('class', 'marker-error-group');
        errorGroup.setAttribute('data-office-code', office.officeCode);
        errorGroup.setAttribute('data-region', office.regionName);
        // Place at a default location (will be off-screen until coords added)
        errorGroup.setAttribute('transform', 'translate(0, 0)');

        // Create red X marker to indicate error
        const errorMarker = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        errorMarker.setAttribute('x', '0');
        errorMarker.setAttribute('y', '0');
        errorMarker.setAttribute('font-size', '20');
        errorMarker.setAttribute('fill', 'red');
        errorMarker.setAttribute('text-anchor', 'middle');
        errorMarker.textContent = '❌';
        errorMarker.setAttribute('aria-label', `Error: ${office.officeCode} missing coordinates`);

        errorGroup.appendChild(errorMarker);
        markersGroup.appendChild(errorGroup);
      }
    });

    console.log(`📍 Markers: ${successCount} placed, ${errorCount} errors`);
    if (errorCount > 0) {
      console.warn(
        `⚠️ ${errorCount} offices missing coordinates. Run tools/coordinate-capture.html to fix.`
      );
    }

    // Mark markers as ready and process any pending selection (race condition fix)
    this.markersReady = true;
    if (this.pendingRegionSelection) {
      const regionToSelect = this.pendingRegionSelection;
      this.pendingRegionSelection = null;
      this.selectedRegion = regionToSelect; // Update state
      this.selectedOffice = null; // Clear office state
      this.ensureMarkersVisible(regionToSelect);
      this.highlightRegion(regionToSelect);
    }
  }

  selectRegion(regionName: string): void {
    this.selectedRegion = regionName;
    this.selectedOffice = null;

    // Zoom to region using dynamically calculated bounds
    const bounds = this.regionBounds.get(regionName);
    if (bounds) {
      this.animateViewBox(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    // Race condition fix: queue selection if markers not ready yet
    if (!this.markersReady) {
      this.pendingRegionSelection = regionName;
      return;
    }

    // Show markers for this region
    this.ensureMarkersVisible(regionName);

    // Highlight selected region
    this.highlightRegion(regionName);
  }

  selectOffice(office: OfficeWithRegion): void {
    this.selectedOffice = office;

    // Update selectedRegion to maintain state consistency
    if (office.regionName) {
      this.selectedRegion = office.regionName;
    }

    // Ensure markers for this office's region are visible
    // This fixes the bug where markers stay hidden after 3D→2D toggle with office selected
    if (this.markersReady && office.regionName) {
      this.ensureMarkersVisible(office.regionName);
    }

    try {
      const { x, y } = getMarkerPosition(office.officeCode);

      // Zoom to office location
      const zoomWidth = 100;
      const zoomHeight = 100;
      this.animateViewBox(x - zoomWidth / 2, y - zoomHeight / 2, zoomWidth, zoomHeight);

      // Highlight selected marker
      this.highlightMarker(office.officeCode);
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Cannot zoom to office ${office.officeCode}:`, error.message);
      // Don't zoom if coordinates missing
    }
  }

  reset(): void {
    this.selectedRegion = null;
    this.selectedOffice = null;
    this.pendingRegionSelection = null;

    // Reset viewBox
    this.animateViewBox(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Show all markers (visible at all zoom levels)
    this.ensureMarkersVisible();

    // Remove highlights
    this.clearHighlights();

    this.options.onReset();
  }

  private animateViewBox(x: number, y: number, width: number, height: number): void {
    const svg = this.svgElement;
    if (!svg) return;

    // Parse current viewBox
    const currentAttr = svg.getAttribute('viewBox') || DEFAULT_VIEWBOX;
    const current = currentAttr.split(' ').map(Number);
    const target = [x, y, width, height];

    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const interpolated = current.map((c, i) => c + (target[i] - c) * eased);
      svg.setAttribute('viewBox', interpolated.join(' '));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Ensure all markers are visible.
   * Note: Previously filtered by region, now shows all markers at all zoom levels.
   * Parameter retained for API compatibility with callers.
   */
  private ensureMarkersVisible(_regionName?: string): void {
    if (!this.svgElement) return;

    const markerGroups = this.svgElement.querySelectorAll<SVGGElement>('.marker-group');
    markerGroups.forEach((group) => {
      group.style.pointerEvents = 'auto';
    });
  }

  private highlightRegion(regionName: string): void {
    if (!this.svgElement) return;

    // Remove existing highlights
    this.svgElement.querySelectorAll('[data-region]').forEach((group) => {
      group.classList.remove('selected');
    });

    // Add highlight to selected region
    const regionGroup = this.svgElement.querySelector(`[data-region="${regionName}"]`);
    if (regionGroup) {
      regionGroup.classList.add('selected');
    }
  }

  private highlightMarker(officeCode: string): void {
    if (!this.svgElement) return;

    const markerGroups = this.svgElement.querySelectorAll<SVGGElement>('.marker-group');
    markerGroups.forEach((group) => {
      const marker = group.querySelector('.marker');
      if (marker) {
        marker.classList.remove('selected');
        if (group.dataset.officeCode === officeCode) {
          marker.classList.add('selected');
        }
      }
    });
  }

  /**
   * Apply centralized marker visual states from computeMarkerStates().
   * Adds/removes CSS classes for styling via stylesheet.
   */
  updateMarkerStates(states: MarkerVisualState[]): void {
    if (!this.svgElement) return;

    for (const state of states) {
      const group = this.svgElement.querySelector<SVGGElement>(
        `.marker-group[data-office-code="${state.officeCode}"]`
      );
      if (!group) continue;

      const marker = group.querySelector('.marker');
      if (!marker) continue;

      marker.classList.toggle('marker--selected', state.selected);
      marker.classList.toggle('marker--highlighted', state.highlighted);
      marker.classList.toggle('marker--dimmed', state.dimmed);
    }
  }

  private clearHighlights(): void {
    if (!this.svgElement) return;

    this.svgElement.querySelectorAll('.selected').forEach((el) => {
      el.classList.remove('selected');
    });
  }

  /** Get current state */
  getState(): { selectedRegion: string | null; selectedOffice: OfficeWithRegion | null } {
    return {
      selectedRegion: this.selectedRegion,
      selectedOffice: this.selectedOffice,
    };
  }
}
