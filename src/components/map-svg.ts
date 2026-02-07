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
const REGION_PADDING = 30; // Padding around region bounds for comfortable viewing

// Scroll-wheel zoom constants
const ZOOM_IN_FACTOR = 0.9;
const ZOOM_OUT_FACTOR = 1.1;
const MIN_VIEWBOX_WIDTH = 60; // Maximum zoom (~16x)
const MAX_VIEWBOX_WIDTH = MAP_WIDTH; // Minimum zoom (full view)

// Drag-pan constants
const DRAG_THRESHOLD = 5; // Pixels of movement before drag mode activates

/** ViewBox dimensions for zoom calculations */
export interface ViewBoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Compute a new viewBox after a scroll-wheel zoom step.
 * Pure function — no DOM dependencies, exported for testability.
 *
 * The zoom is centered on the cursor position in SVG coordinate space:
 * the point under the cursor remains fixed while the rest of the map scales.
 */
export function computeZoomedViewBox(
  current: ViewBoxRect,
  cursorSVG: { x: number; y: number },
  zoomIn: boolean
): ViewBoxRect {
  const factor = zoomIn ? ZOOM_IN_FACTOR : ZOOM_OUT_FACTOR;

  let newW = current.w * factor;
  let newH = current.h * factor;

  // Clamp width to [MIN_VIEWBOX_WIDTH, MAX_VIEWBOX_WIDTH]
  if (newW < MIN_VIEWBOX_WIDTH) {
    newW = MIN_VIEWBOX_WIDTH;
    newH = MIN_VIEWBOX_WIDTH * (MAP_HEIGHT / MAP_WIDTH);
  } else if (newW > MAX_VIEWBOX_WIDTH) {
    newW = MAX_VIEWBOX_WIDTH;
    newH = MAP_HEIGHT;
  }

  // Keep cursor point stationary: adjust origin so cursorSVG maps to the same screen position
  const newX = cursorSVG.x - (cursorSVG.x - current.x) * (newW / current.w);
  const newY = cursorSVG.y - (cursorSVG.y - current.y) * (newH / current.h);

  return { x: newX, y: newY, w: newW, h: newH };
}

/**
 * Compute a new viewBox after a drag-pan gesture.
 * Pure function — no DOM dependencies, exported for testability.
 *
 * Converts screen pixel delta to SVG coordinate delta, then translates the
 * viewBox origin. Width and height are unchanged — pan does not zoom.
 * The origin is clamped so the viewBox never extends outside [0, 0, MAP_WIDTH, MAP_HEIGHT].
 */
export function computeDragPannedViewBox(
  startViewBox: ViewBoxRect,
  screenDelta: { dx: number; dy: number },
  containerSize: { width: number; height: number }
): ViewBoxRect {
  if (containerSize.width <= 0 || containerSize.height <= 0) return { ...startViewBox };

  // Convert screen delta to SVG delta
  const svgDeltaX = screenDelta.dx * (startViewBox.w / containerSize.width);
  const svgDeltaY = screenDelta.dy * (startViewBox.h / containerSize.height);

  // Translate origin (subtract so map follows cursor direction)
  let newX = startViewBox.x - svgDeltaX;
  let newY = startViewBox.y - svgDeltaY;

  // Clamp to map boundaries
  newX = Math.max(0, Math.min(MAP_WIDTH - startViewBox.w, newX));
  newY = Math.max(0, Math.min(MAP_HEIGHT - startViewBox.h, newY));

  return { x: newX, y: newY, w: startViewBox.w, h: startViewBox.h };
}

// Export getMarkerPosition for use by other components
export { getMarkerPosition, initProjection } from '../lib/projection.js';

export class MapSvg {
  private container: HTMLElement;
  private options: Required<MapOptions>;
  private svgElement: SVGSVGElement | null = null;
  private selectedRegion: string | null = null;
  private selectedOffice: OfficeWithRegion | null = null;
  private regionBounds: Map<string, ViewBox> = new Map();

  // Scroll-wheel zoom state
  private currentViewBox = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
  private viewBoxAnimationId: number | null = null;
  private boundHandleWheel: ((e: WheelEvent) => void) | null = null;

  // Drag-pan state
  private isDragging: boolean = false;
  private wasDragging: boolean = false;
  private dragStartScreenPos: { x: number; y: number } | null = null;
  private dragStartViewBox: ViewBoxRect | null = null;
  private activePointerId: number | null = null;
  private boundPointerDown: ((e: PointerEvent) => void) | null = null;
  private boundPointerMove: ((e: PointerEvent) => void) | null = null;
  private boundPointerUp: ((e: PointerEvent) => void) | null = null;
  private boundClickCapture: ((e: MouseEvent) => void) | null = null;

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

    // Register scroll-wheel zoom handler
    this.boundHandleWheel = (e: WheelEvent) => this.handleWheel(e);
    this.container.addEventListener('wheel', this.boundHandleWheel, { passive: false });

    // Register pointer event listeners for drag-pan
    this.boundPointerDown = (e: PointerEvent) => this.handlePointerDown(e);
    this.boundPointerMove = (e: PointerEvent) => this.handlePointerMove(e);
    this.boundPointerUp = (e: PointerEvent) => this.handlePointerUp(e);
    this.boundClickCapture = (e: MouseEvent) => {
      if (this.wasDragging) {
        this.wasDragging = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };

    this.container.addEventListener('pointerdown', this.boundPointerDown);
    this.container.addEventListener('pointermove', this.boundPointerMove);
    this.container.addEventListener('pointerup', this.boundPointerUp);
    this.container.addEventListener('pointercancel', this.boundPointerUp);
    this.container.addEventListener('click', this.boundClickCapture, { capture: true });
  }

  /**
   * Clean up event listeners and animation state.
   */
  dispose(): void {
    if (this.viewBoxAnimationId !== null) {
      cancelAnimationFrame(this.viewBoxAnimationId);
      this.viewBoxAnimationId = null;
    }
    if (this.boundHandleWheel) {
      this.container.removeEventListener('wheel', this.boundHandleWheel);
      this.boundHandleWheel = null;
    }
    if (this.boundPointerDown) {
      this.container.removeEventListener('pointerdown', this.boundPointerDown);
      this.boundPointerDown = null;
    }
    if (this.boundPointerMove) {
      this.container.removeEventListener('pointermove', this.boundPointerMove);
      this.boundPointerMove = null;
    }
    if (this.boundPointerUp) {
      this.container.removeEventListener('pointerup', this.boundPointerUp);
      this.container.removeEventListener('pointercancel', this.boundPointerUp);
      this.boundPointerUp = null;
    }
    if (this.boundClickCapture) {
      this.container.removeEventListener('click', this.boundClickCapture, { capture: true });
      this.boundClickCapture = null;
    }
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

        // Single click handler on the group (covers both marker path and hit area)
        markerGroup.addEventListener('click', (e: Event) => {
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
        hitArea.setAttribute('aria-hidden', 'true');

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

    // Reset viewBox (animateViewBox will update currentViewBox via animation)
    this.animateViewBox(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Show all markers (visible at all zoom levels)
    this.ensureMarkersVisible();

    // Remove highlights
    this.clearHighlights();

    this.options.onReset();
  }

  /**
   * Handle mouse wheel events for scroll-zoom.
   * Zooms in/out centered on cursor position, suppresses page scroll.
   */
  private handleWheel(event: WheelEvent): void {
    event.preventDefault();

    const svg = this.svgElement;
    if (!svg) return;

    // Normalize deltaY to direction only (+1 or -1)
    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    const zoomIn = direction < 0; // scroll-up = negative deltaY = zoom in

    // Convert screen cursor position to SVG coordinate space
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const cursorSVG = point.matrixTransform(ctm.inverse());

    // Compute new viewBox
    const newViewBox = computeZoomedViewBox(this.currentViewBox, cursorSVG, zoomIn);

    // Cancel any in-progress click-based zoom animation
    if (this.viewBoxAnimationId !== null) {
      cancelAnimationFrame(this.viewBoxAnimationId);
      this.viewBoxAnimationId = null;
    }

    // Apply immediately (no animation per tick — responsive to each scroll event)
    this.currentViewBox = newViewBox;
    svg.setAttribute('viewBox', `${newViewBox.x} ${newViewBox.y} ${newViewBox.w} ${newViewBox.h}`);
  }

  private handlePointerDown(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0) return;

    this.dragStartScreenPos = { x: event.clientX, y: event.clientY };
    this.dragStartViewBox = { ...this.currentViewBox };
    this.isDragging = false;
    this.wasDragging = false;
    this.activePointerId = event.pointerId;

    // Cancel any in-progress viewBox animation
    if (this.viewBoxAnimationId !== null) {
      cancelAnimationFrame(this.viewBoxAnimationId);
      this.viewBoxAnimationId = null;
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.activePointerId) return;
    if (!this.dragStartScreenPos || !this.dragStartViewBox) return;

    const deltaX = event.clientX - this.dragStartScreenPos.x;
    const deltaY = event.clientY - this.dragStartScreenPos.y;

    // Check drag threshold
    if (!this.isDragging && Math.hypot(deltaX, deltaY) <= DRAG_THRESHOLD) return;

    if (!this.isDragging) {
      this.isDragging = true;
      this.container.style.cursor = 'grabbing';
      if (this.activePointerId !== null) {
        this.container.setPointerCapture(this.activePointerId);
      }
    }

    // Compute new viewBox from drag start (cumulative, not incremental)
    const newViewBox = computeDragPannedViewBox(
      this.dragStartViewBox,
      { dx: deltaX, dy: deltaY },
      { width: this.container.clientWidth, height: this.container.clientHeight }
    );

    // Apply immediately
    this.currentViewBox = newViewBox;
    if (this.svgElement) {
      this.svgElement.setAttribute(
        'viewBox',
        `${newViewBox.x} ${newViewBox.y} ${newViewBox.w} ${newViewBox.h}`
      );
    }
  }

  private handlePointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.activePointerId) return;

    if (this.isDragging) {
      this.wasDragging = true;
    }

    // Reset drag state
    this.isDragging = false;
    this.dragStartScreenPos = null;
    this.dragStartViewBox = null;
    this.activePointerId = null;
    this.container.style.cursor = 'grab';
  }

  private animateViewBox(x: number, y: number, width: number, height: number): void {
    const svg = this.svgElement;
    if (!svg) return;

    // Cancel any in-progress animation
    if (this.viewBoxAnimationId !== null) {
      cancelAnimationFrame(this.viewBoxAnimationId);
      this.viewBoxAnimationId = null;
    }

    const current = [
      this.currentViewBox.x,
      this.currentViewBox.y,
      this.currentViewBox.w,
      this.currentViewBox.h,
    ];
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

      // Keep currentViewBox in sync
      this.currentViewBox = {
        x: interpolated[0],
        y: interpolated[1],
        w: interpolated[2],
        h: interpolated[3],
      };

      if (progress < 1) {
        this.viewBoxAnimationId = requestAnimationFrame(animate);
      } else {
        this.viewBoxAnimationId = null;
      }
    };

    this.viewBoxAnimationId = requestAnimationFrame(animate);
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
      marker.classList.toggle('marker--subdued', state.subdued);
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
