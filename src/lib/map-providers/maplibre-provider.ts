/**
 * MapLibre GL JS Provider
 *
 * Implements MapProvider interface using MapLibre GL JS
 * with OpenFreeMap vector tiles (no API key required).
 * Library is lazy-loaded via dynamic import on first use.
 */

import type {
  TileMapProvider,
  MapProviderOptions,
  MarkerOptions,
  FlyToOptions,
  TileMapMarker,
  MarkerVisualState,
} from './types.js';

// Default OpenFreeMap style URLs
const STYLE_URLS = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

// Cached module reference after first dynamic import
let maplibreModule: typeof import('maplibre-gl') | null = null;

export class MapLibreProvider implements TileMapProvider {
  private map: import('maplibre-gl').Map | null = null;
  private marker: import('maplibre-gl').Marker | null = null;
  private mapContainer: HTMLElement | null = null;
  private customStyleUrl: string | undefined;
  private disposed = false;
  private markerClickHandler: ((officeCode: string) => void) | null = null;
  private markersSourceId = 'office-markers';
  private markersLoaded = false;

  constructor(customStyleUrl?: string) {
    this.customStyleUrl = customStyleUrl;
  }

  async initialize(container: HTMLElement, options: MapProviderOptions): Promise<void> {
    // Lazy-load MapLibre GL JS and its CSS (cached after first import)
    if (!maplibreModule) {
      maplibreModule = await import('maplibre-gl');
      await import('maplibre-gl/dist/maplibre-gl.css');
    }

    if (this.disposed) return;

    // Create a wrapper div for the map (this is what gets reparented)
    this.mapContainer = document.createElement('div');
    this.mapContainer.style.width = '100%';
    this.mapContainer.style.height = '100%';
    container.appendChild(this.mapContainer);

    const styleUrl = this.customStyleUrl ?? STYLE_URLS[options.style ?? 'light'];

    this.map = new maplibreModule.Map({
      container: this.mapContainer,
      style: styleUrl,
      center: [0, 0],
      zoom: options.zoom,
      interactive: options.interactive,
      // MapLibre accepts false to disable, or omit for default (enabled)
      attributionControl: options.attributionControl ? undefined : false,
    });

    // Wait for map to be ready
    await new Promise<void>((resolve, reject) => {
      if (!this.map) {
        reject(new Error('Map not initialized'));
        return;
      }
      this.map.on('load', () => resolve());
      this.map.on('error', (e) => reject(e.error ?? e));
    });

    // Persistent error listener for tile load failures (after initial load)
    this.map.on('error', (e) => {
      console.warn('[MapLibre] Tile error:', e.error?.message ?? e);
    });

    // WebGL context loss handler (critical for DOM reparenting in expand overlay)
    const canvas = this.mapContainer.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('[MapLibre] WebGL context lost, attempting recovery');
      });
      canvas.addEventListener('webglcontextrestored', () => {
        this.map?.triggerRepaint();
      });
    }
  }

  setLocation(lat: number, lon: number, options?: MarkerOptions): void {
    if (!this.map || !maplibreModule) return;

    this.map.setCenter([lon, lat]);

    // Remove existing marker
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }

    // Create custom HTML marker for brand styling
    const el = document.createElement('div');
    el.className = 'minimap-marker';

    const pin = document.createElement('div');
    pin.className = 'minimap-marker-pin';
    pin.style.backgroundColor = options?.color ?? 'var(--color-primary, #00396c)';
    el.appendChild(pin);

    const shadow = document.createElement('div');
    shadow.className = 'minimap-marker-shadow';
    el.appendChild(shadow);

    this.marker = new maplibreModule.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lon, lat])
      .addTo(this.map);
  }

  flyTo(lat: number, lon: number, options?: FlyToOptions): void {
    if (!this.map) return;

    this.map.flyTo({
      center: [lon, lat],
      zoom: options?.zoom ?? this.map.getZoom(),
      duration: options?.duration ?? 1500,
      essential: true,
    });

    // Move marker to new location
    if (this.marker) {
      this.marker.setLngLat([lon, lat]);
    }
  }

  updateMarkerStyle(options: MarkerOptions): void {
    if (!this.marker) return;

    const el = this.marker.getElement();
    const pin = el.querySelector('.minimap-marker-pin') as HTMLElement | null;
    if (pin) {
      pin.style.backgroundColor = options.color;
    }
  }

  resize(): void {
    this.map?.resize();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.mapContainer = null;
  }

  setMarkers(markers: TileMapMarker[]): void {
    if (!this.map || !maplibreModule) return;

    // Build GeoJSON feature collection
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: markers.map((m) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [m.lon, m.lat] },
        properties: {
          officeCode: m.officeCode,
          label: m.label,
          color: m.color,
          regionName: m.regionName,
        },
      })),
    };

    // Remove existing source/layers if re-setting markers
    if (this.markersLoaded) {
      for (const id of ['clusters', 'cluster-count', 'unclustered-point']) {
        if (this.map.getLayer(id)) this.map.removeLayer(id);
      }
      if (this.map.getSource(this.markersSourceId)) {
        this.map.removeSource(this.markersSourceId);
      }
    }

    // Add GeoJSON source with clustering
    this.map.addSource(this.markersSourceId, {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Cluster circle layer
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: this.markersSourceId,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 30, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
      },
    });

    // Cluster count label layer
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: this.markersSourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12,
      },
    });

    // Individual (unclustered) marker layer
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: this.markersSourceId,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': ['case', ['boolean', ['feature-state', 'dimmed'], false], 0.4, 1],
      },
    });

    // Wire click handler for unclustered markers
    this.map.on('click', 'unclustered-point', (e) => {
      const feature = e.features?.[0];
      if (feature && this.markerClickHandler) {
        this.markerClickHandler(feature.properties?.officeCode);
      }
    });

    // Click on clusters to zoom in
    this.map.on('click', 'clusters', async (e) => {
      const feature = e.features?.[0];
      if (!feature || !this.map) return;
      const source = this.map.getSource(this.markersSourceId);
      if (source && 'getClusterExpansionZoom' in source) {
        try {
          const zoom = await (
            source as import('maplibre-gl').GeoJSONSource
          ).getClusterExpansionZoom(feature.properties?.cluster_id);
          if (zoom == null || !this.map) return;
          const coords = (feature.geometry as GeoJSON.Point).coordinates;
          this.map.easeTo({ center: [coords[0], coords[1]] as [number, number], zoom });
        } catch {
          // Cluster expansion zoom not available
        }
      }
    });

    // Change cursor on hover over clickable markers
    this.map.on('mouseenter', 'unclustered-point', () => {
      if (this.map) this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'unclustered-point', () => {
      if (this.map) this.map.getCanvas().style.cursor = '';
    });
    this.map.on('mouseenter', 'clusters', () => {
      if (this.map) this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'clusters', () => {
      if (this.map) this.map.getCanvas().style.cursor = '';
    });

    this.markersLoaded = true;
  }

  updateMarkerStates(states: MarkerVisualState[]): void {
    if (!this.map || !this.markersLoaded) return;

    const source = this.map.getSource(this.markersSourceId);
    if (!source) return;

    for (const state of states) {
      // Find the feature ID by officeCode — use feature index matching
      // MapLibre feature-state requires numeric IDs, so we set state by querying
      const features = this.map.querySourceFeatures(this.markersSourceId, {
        filter: ['==', ['get', 'officeCode'], state.officeCode],
      });
      for (const f of features) {
        if (f.id != null) {
          this.map.setFeatureState(
            { source: this.markersSourceId, id: f.id },
            { dimmed: state.dimmed, selected: state.selected, highlighted: state.highlighted }
          );
        }
      }
    }
  }

  fitBounds(markers: TileMapMarker[], padding = 50): void {
    if (!this.map || !maplibreModule || markers.length === 0) return;

    const bounds = new maplibreModule.LngLatBounds();
    for (const m of markers) {
      bounds.extend([m.lon, m.lat]);
    }
    this.map.fitBounds(bounds, { padding, duration: 1000 });
  }

  onMarkerClick(handler: (officeCode: string) => void): void {
    this.markerClickHandler = handler;
  }

  getMapElement(): HTMLElement {
    if (!this.mapContainer) {
      throw new Error('Map not initialized. Call initialize() first.');
    }
    return this.mapContainer;
  }
}
