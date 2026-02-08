/**
 * MapLibre GL JS Provider
 *
 * Implements MapProvider interface using MapLibre GL JS
 * with CartoDB basemap tiles (no API key required).
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

// Default basemap style URLs (CartoDB — free, no API key, excellent data-viz contrast)
const STYLE_URLS = {
  light: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
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
  private pendingMarkers: TileMapMarker[] = [];
  private currentStyle: 'light' | 'dark' = 'light';
  private styleGeneration = 0;
  private markerEventHandlers: Array<{
    event: string;
    layer: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (...args: any[]) => void;
  }> = [];

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

    this.currentStyle = options.style ?? 'light';
    const styleUrl = this.customStyleUrl ?? STYLE_URLS[this.currentStyle];

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

  private removeMarkerEventHandlers(): void {
    if (!this.map) return;
    for (const { event, layer, handler } of this.markerEventHandlers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.map.off(event as any, layer, handler as any);
    }
    this.markerEventHandlers = [];
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.removeMarkerEventHandlers();

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

    // Store markers for replay after style switch
    this.pendingMarkers = markers;

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
    // promoteId ensures each feature gets a stable ID for setFeatureState()
    this.map.addSource(this.markersSourceId, {
      type: 'geojson',
      data: geojson,
      promoteId: 'officeCode',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Cluster circle layer — warm brand-aligned gradient for visibility
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: this.markersSourceId,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#2a6db5', 10, '#3580c8', 30, '#4a90d9'],
        'circle-radius': ['step', ['get', 'point_count'], 22, 10, 32, 30, 42],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9,
      },
    });

    // Cluster count label layer — white text with halo for readability
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: this.markersSourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 13,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': 'rgba(0, 0, 0, 0.3)',
        'text-halo-width': 1,
      },
    });

    // Individual (unclustered) marker layer — larger with stroke for visibility
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: this.markersSourceId,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#0066cc',
        'circle-radius': 9,
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': ['case', ['boolean', ['feature-state', 'dimmed'], false], 0.4, 1],
      },
    });

    // Remove previous event handlers before adding new ones
    this.removeMarkerEventHandlers();

    // Wire click handler for unclustered markers
    const onUnclusteredClick = (
      e: import('maplibre-gl').MapMouseEvent & {
        features?: import('maplibre-gl').MapGeoJSONFeature[];
      }
    ) => {
      const feature = e.features?.[0];
      const officeCode = feature?.properties?.officeCode;
      if (typeof officeCode === 'string' && this.markerClickHandler) {
        this.markerClickHandler(officeCode);
      }
    };
    this.map.on('click', 'unclustered-point', onUnclusteredClick);
    this.markerEventHandlers.push({
      event: 'click',
      layer: 'unclustered-point',
      handler: onUnclusteredClick,
    });

    // Click on clusters to zoom in
    const onClusterClick = async (
      e: import('maplibre-gl').MapMouseEvent & {
        features?: import('maplibre-gl').MapGeoJSONFeature[];
      }
    ) => {
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
    };
    this.map.on('click', 'clusters', onClusterClick);
    this.markerEventHandlers.push({ event: 'click', layer: 'clusters', handler: onClusterClick });

    // Change cursor on hover over clickable markers
    const onUnclusteredEnter = () => {
      if (this.map) this.map.getCanvas().style.cursor = 'pointer';
    };
    const onUnclusteredLeave = () => {
      if (this.map) this.map.getCanvas().style.cursor = '';
    };
    const onClusterEnter = () => {
      if (this.map) this.map.getCanvas().style.cursor = 'pointer';
    };
    const onClusterLeave = () => {
      if (this.map) this.map.getCanvas().style.cursor = '';
    };
    this.map.on('mouseenter', 'unclustered-point', onUnclusteredEnter);
    this.map.on('mouseleave', 'unclustered-point', onUnclusteredLeave);
    this.map.on('mouseenter', 'clusters', onClusterEnter);
    this.map.on('mouseleave', 'clusters', onClusterLeave);
    this.markerEventHandlers.push(
      { event: 'mouseenter', layer: 'unclustered-point', handler: onUnclusteredEnter },
      { event: 'mouseleave', layer: 'unclustered-point', handler: onUnclusteredLeave },
      { event: 'mouseenter', layer: 'clusters', handler: onClusterEnter },
      { event: 'mouseleave', layer: 'clusters', handler: onClusterLeave }
    );

    this.markersLoaded = true;
  }

  updateMarkerStates(states: MarkerVisualState[]): void {
    if (!this.map || !this.markersLoaded) return;

    const source = this.map.getSource(this.markersSourceId);
    if (!source) return;

    for (const state of states) {
      // promoteId: 'officeCode' makes the officeCode property the feature ID,
      // so we can call setFeatureState directly with string IDs (no query needed).
      this.map.setFeatureState(
        { source: this.markersSourceId, id: state.officeCode },
        { dimmed: state.dimmed, selected: state.selected, highlighted: state.highlighted }
      );
    }
  }

  fitBounds(markers: TileMapMarker[], padding = 50, maxZoom = 10): void {
    if (!this.map || !maplibreModule || markers.length === 0) return;

    const bounds = new maplibreModule.LngLatBounds();
    for (const m of markers) {
      bounds.extend([m.lon, m.lat]);
    }
    this.map.fitBounds(bounds, { padding, maxZoom, duration: 1000 });
  }

  onMarkerClick(handler: (officeCode: string) => void): void {
    this.markerClickHandler = handler;
  }

  setStyle(style: 'light' | 'dark'): void {
    if (!this.map || this.disposed) return;
    if (style === this.currentStyle) return;

    this.currentStyle = style;
    const styleUrl = this.customStyleUrl ?? STYLE_URLS[style];

    // setStyle() removes all sources and layers — re-add after load
    this.markersLoaded = false;
    this.removeMarkerEventHandlers();

    // Increment generation to discard stale style.load callbacks from rapid switches
    const gen = ++this.styleGeneration;

    this.map.setStyle(styleUrl);

    const previousStyle = style === 'dark' ? 'light' : 'dark';

    // Replay pending markers after a style finishes loading
    const replayMarkers = () => {
      if (this.disposed || !this.map || gen !== this.styleGeneration) return;
      if (this.pendingMarkers.length > 0) {
        this.setMarkers(this.pendingMarkers);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onError = (e: any) => {
      // Cancel style.load handler to prevent duplicate marker replay
      this.map?.off('style.load', onStyleLoad);
      if (this.disposed || !this.map || gen !== this.styleGeneration) return;
      // Only revert if the style hasn't actually loaded (avoid false positives from tile errors)
      if (this.map.isStyleLoaded()) return;
      console.warn('[MapLibre] Style load failed, reverting to', previousStyle, e.error?.message);
      this.currentStyle = previousStyle;
      const fallbackUrl = this.customStyleUrl ?? STYLE_URLS[previousStyle];
      this.map.setStyle(fallbackUrl);
      // Wire style.load for fallback so markers are re-added
      this.map.once('style.load', replayMarkers);
    };

    const onStyleLoad = () => {
      // Cancel error handler — style loaded successfully
      this.map?.off('error', onError);
      replayMarkers();
    };

    this.map.once('style.load', onStyleLoad);
    this.map.once('error', onError);
  }

  getMapElement(): HTMLElement {
    if (!this.mapContainer) {
      throw new Error('Map not initialized. Call initialize() first.');
    }
    return this.mapContainer;
  }
}
