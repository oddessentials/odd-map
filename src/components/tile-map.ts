/**
 * Tile Map Component
 *
 * Full-screen interactive tile map using MapLibre, Apple Maps, or Google Maps.
 * If the configured provider fails to initialize (CDN error, auth failure),
 * automatically falls back to MapLibre before the app-level 2D SVG fallback.
 * Displays all office markers with clustering at zoomed-out levels.
 */

import type { Office, OfficeWithRegion, MapOptions } from '../types/index.js';
import type { MarkerVisualState } from '../lib/marker-state.js';
import type {
  TileMapProvider,
  MapProviderConfig,
  TileMapMarker,
} from '../lib/map-providers/types.js';
import { createTileMapProvider } from '../lib/map-providers/provider-factory.js';
import { MapLibreProvider } from '../lib/map-providers/maplibre-provider.js';
import {
  getMapProviderConfig,
  getClientOffices,
  getOfficesByRegion,
} from '../lib/client-config.js';

/** Options to restore a previous map view on init (skips fitBounds). */
export interface TileMapInitialView {
  lat: number;
  lon: number;
  zoom: number;
}

export class TileMap {
  private provider: TileMapProvider | null = null;
  private container: HTMLElement;
  private mapContainer: HTMLElement;
  private onOfficeClick: ((office: OfficeWithRegion) => void) | null;
  private markers: TileMapMarker[] = [];
  private disposed = false;
  private config: MapProviderConfig;

  constructor(container: HTMLElement, options: MapOptions) {
    this.container = container;
    this.onOfficeClick = options.onOfficeClick ?? null;
    this.config = getMapProviderConfig();

    // Create map container
    this.mapContainer = document.createElement('div');
    this.mapContainer.className = 'tile-map-container';
    this.container.appendChild(this.mapContainer);
  }

  async init(initialView?: TileMapInitialView): Promise<void> {
    this.provider = createTileMapProvider(this.config);

    const initOptions = {
      zoom: 4, // Start zoomed out to show all of US
      interactive: true,
      attributionControl: true,
      style: (this.config.defaultTileStyle ?? 'light') as 'light' | 'dark',
    };

    try {
      await this.provider.initialize(this.mapContainer, initOptions);
    } catch (err) {
      // Provider failed (e.g., CDN load error, auth failure) — fall back to MapLibre
      if (this.config.provider !== 'maplibre') {
        console.warn(
          `[tile-map] ${this.config.provider} provider failed to initialize. Falling back to MapLibre.`,
          err
        );
        this.provider.dispose();
        this.mapContainer.innerHTML = '';
        this.provider = new MapLibreProvider(this.config.tileStyleUrl);
        await this.provider.initialize(this.mapContainer, initOptions);
      } else {
        throw err; // MapLibre itself failed — nothing to fall back to
      }
    }

    if (this.disposed) {
      this.provider?.dispose();
      this.provider = null;
      return;
    }

    // Register marker click handler — bridge officeCode to OfficeWithRegion
    if (this.onOfficeClick) {
      const callback = this.onOfficeClick;
      this.provider.onMarkerClick((officeCode: string) => {
        const offices = getClientOffices();
        const office = offices.find((o) => o.officeCode === officeCode);
        if (office) callback(office);
      });
    }

    // Load all offices as markers with clustering
    this.loadOfficeMarkers(initialView);
  }

  /**
   * Load all offices as interactive markers on the tile map.
   * Uses TileMapProvider.setMarkers() for clustering support.
   *
   * When `initialView` is provided (state restoration after view switch),
   * skips fitBounds and jumps directly to the saved coordinates to avoid
   * a jarring zoom-out-then-zoom-in animation race.
   */
  private loadOfficeMarkers(initialView?: TileMapInitialView): void {
    if (!this.provider) return;

    const offices = getClientOffices();
    const brandColor =
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#00396c';

    this.markers = offices
      .filter((office) => office.coordinates)
      .map((office) => ({
        officeCode: office.officeCode,
        lat: office.coordinates.lat,
        lon: office.coordinates.lon,
        label: `${office.city}, ${office.state}`,
        color: brandColor,
        regionName: office.regionName,
      }));

    // Pass all markers to provider for clustered rendering
    this.provider.setMarkers(this.markers);

    if (initialView) {
      // Restore previous view instantly (no animation) to avoid race with fitBounds
      this.provider.flyTo(initialView.lat, initialView.lon, {
        zoom: initialView.zoom,
        duration: 0,
      });
    } else if (this.markers.length > 0) {
      // Fresh init — fit view to show all markers
      this.provider.fitBounds(this.markers);
    }
  }

  selectRegion(regionName: string): void {
    if (!this.provider) return;

    // Get offices in this region and fit view to their bounds
    const offices = getOfficesByRegion(regionName);
    if (offices.length === 0) return;

    const brandColor =
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#00396c';
    const regionMarkers = offices.map((o) => ({
      officeCode: o.officeCode,
      lat: o.coordinates.lat,
      lon: o.coordinates.lon,
      label: `${o.city}, ${o.state}`,
      color: brandColor,
      regionName,
    }));
    this.provider.fitBounds(regionMarkers, 60);
  }

  selectOffice(office: Office | OfficeWithRegion): void {
    if (!this.provider) return;

    const { lat, lon } = office.coordinates;
    this.provider.flyTo(lat, lon, { zoom: 12, duration: 1000 });
  }

  reset(): void {
    if (!this.provider) return;

    // Fly back to US overview
    this.provider.flyTo(39.8283, -98.5795, { zoom: 4, duration: 1000 });
  }

  updateMarkerStates(states: MarkerVisualState[]): void {
    if (!this.provider) return;
    this.provider.updateMarkerStates(states);
  }

  setTileStyle(style: 'light' | 'dark'): void {
    if (!this.provider) return;
    this.provider.setStyle?.(style);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.provider) {
      this.provider.dispose();
      this.provider = null;
    }

    this.markers = [];
    this.mapContainer.remove();
  }
}
