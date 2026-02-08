/**
 * Apple MapKit JS Provider
 *
 * Implements MapProvider interface using Apple MapKit JS.
 * Library is loaded via CDN script injection on first use.
 * Requires a JWT token from client config for authentication.
 */

import type {
  TileMapProvider,
  MapProviderOptions,
  MarkerOptions,
  FlyToOptions,
  TileMapMarker,
  MarkerVisualState,
} from './types.js';

// Pinned Apple MapKit JS CDN URL (exact version per Constitution Principle VI)
const MAPKIT_CDN_URL = 'https://cdn.apple-mapkit.com/mk/5.78.1/mapkit.core.js';

// Cached in-flight promise to prevent duplicate script injection on concurrent calls
let mapkitLoadPromise: Promise<void> | null = null;

/**
 * Load Apple MapKit JS from CDN via script injection.
 * Returns a promise that resolves when the library is ready.
 * Concurrent calls share the same in-flight promise.
 */
function loadMapKitJS(): Promise<void> {
  // Already loaded
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).mapkit) {
    return Promise.resolve();
  }

  // Return existing in-flight promise if already loading
  if (mapkitLoadPromise) return mapkitLoadPromise;

  mapkitLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = MAPKIT_CDN_URL;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => {
      mapkitLoadPromise = null; // allow retry on failure
      reject(new Error('Failed to load Apple MapKit JS from CDN'));
    };
    document.head.appendChild(script);
  });
  return mapkitLoadPromise;
}

/**
 * Get the mapkit global (CDN-loaded, untyped).
 * Returns null if not loaded.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMapKit(): any {
  return (window as unknown as Record<string, unknown>).mapkit ?? null;
}

// Track whether mapkit.init() has been called to prevent double-init
let mapkitInitialized = false;

export class AppleProvider implements TileMapProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mk: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private marker: any = null;
  private mapContainer: HTMLElement | null = null;
  private token: string;
  private disposed = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectHandler: ((event: any) => void) | null = null;

  constructor(token: string) {
    this.token = token;
  }

  async initialize(container: HTMLElement, options: MapProviderOptions): Promise<void> {
    await loadMapKitJS();

    if (this.disposed) return;

    this.mk = getMapKit();
    if (!this.mk) {
      throw new Error('Apple MapKit JS failed to initialize');
    }

    // Initialize MapKit with JWT token (idempotent — safe if multiple providers created)
    if (!mapkitInitialized) {
      this.mk.init({
        authorizationCallback: (done: (token: string) => void) => {
          done(this.token);
        },
      });
      mapkitInitialized = true;
    }

    // Create wrapper container
    this.mapContainer = document.createElement('div');
    this.mapContainer.style.width = '100%';
    this.mapContainer.style.height = '100%';
    container.appendChild(this.mapContainer);

    const colorScheme =
      options.style === 'dark' ? this.mk.Map.ColorScheme.Dark : this.mk.Map.ColorScheme.Light;

    this.map = new this.mk.Map(this.mapContainer, {
      center: new this.mk.Coordinate(0, 0),
      showsCompass: 'hidden',
      isZoomEnabled: options.interactive,
      isScrollEnabled: options.interactive,
      isRotateEnabled: false,
      showsMapTypeControl: false,
      colorScheme,
    });
  }

  setLocation(lat: number, lon: number, options?: MarkerOptions): void {
    if (!this.map || !this.mk) return;

    const coordinate = new this.mk.Coordinate(lat, lon);
    this.map.setCenterAnimated(coordinate, false);

    // Remove existing marker
    if (this.marker) {
      this.map.removeAnnotation(this.marker);
      this.marker = null;
    }

    // Create new marker
    this.marker = new this.mk.MarkerAnnotation(coordinate, {
      color: options?.color ?? '#00396c',
      glyphColor: '#ffffff',
      title: options?.label ?? '',
    });

    this.map.addAnnotation(this.marker);
  }

  flyTo(lat: number, lon: number, options?: FlyToOptions): void {
    if (!this.map || !this.mk) return;

    const coordinate = new this.mk.Coordinate(lat, lon);

    // Apple MapKit uses region-based animation
    const spanVal = this.zoomToSpan(options?.zoom ?? 15);
    const span = new this.mk.CoordinateSpan(spanVal, spanVal);
    const region = new this.mk.CoordinateRegion(coordinate, span);
    this.map.setRegionAnimated(region, true);

    // Move marker
    if (this.marker) {
      this.marker.coordinate = coordinate;
    }
  }

  updateMarkerStyle(options: MarkerOptions): void {
    if (!this.marker) return;
    this.marker.color = options.color;
  }

  resize(): void {
    // Apple MapKit handles resize automatically
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.map) {
      if (this.selectHandler) {
        this.map.removeEventListener('select', this.selectHandler);
        this.selectHandler = null;
      }
      this.map.destroy();
      this.map = null;
    }

    this.marker = null;
    this.mk = null;

    if (this.mapContainer) {
      this.mapContainer.remove();
      this.mapContainer = null;
    }
  }

  setMarkers(markers: TileMapMarker[]): void {
    if (!this.map || !this.mk) return;

    // Remove all existing annotations (including single-location marker if present)
    if (this.map.annotations?.length > 0) {
      this.map.removeAnnotations(this.map.annotations);
      this.marker = null;
    }

    const annotations = markers.map((m) => {
      const coord = new this.mk.Coordinate(m.lat, m.lon);
      return new this.mk.MarkerAnnotation(coord, {
        color: m.color,
        title: m.label,
        glyphColor: '#ffffff',
        data: { officeCode: m.officeCode },
      });
    });

    this.map.addAnnotations(annotations);
  }

  updateMarkerStates(_states: MarkerVisualState[]): void {
    // Apple MapKit JS has limited support for per-marker state styling.
    // For demo purposes, this is a no-op. Full implementation would
    // iterate annotations and update color/opacity.
  }

  fitBounds(markers: TileMapMarker[], _padding = 50, maxZoom = 10): void {
    if (!this.map || !this.mk || markers.length === 0) return;

    // Calculate bounding region from markers
    const lats = markers.map((m) => m.lat);
    const lons = markers.map((m) => m.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const center = new this.mk.Coordinate((minLat + maxLat) / 2, (minLon + maxLon) / 2);

    // Enforce maxZoom by computing a minimum span from the zoom cap
    const minSpan = this.zoomToSpan(maxZoom);
    const latSpan = Math.max((maxLat - minLat) * 1.2, minSpan);
    const lonSpan = Math.max((maxLon - minLon) * 1.2, minSpan);

    const span = new this.mk.CoordinateSpan(latSpan, lonSpan);
    const region = new this.mk.CoordinateRegion(center, span);
    this.map.setRegionAnimated(region, true);
  }

  onMarkerClick(handler: (officeCode: string) => void): void {
    if (!this.map) return;
    // Remove previous listener if any
    if (this.selectHandler) {
      this.map.removeEventListener('select', this.selectHandler);
    }
    this.selectHandler = (event: {
      annotation?: { title?: string; data?: { officeCode?: string } };
    }) => {
      const code = event.annotation?.data?.officeCode;
      if (code) handler(code);
    };
    this.map.addEventListener('select', this.selectHandler);
  }

  getMapElement(): HTMLElement {
    if (!this.mapContainer) {
      throw new Error('Map not initialized. Call initialize() first.');
    }
    return this.mapContainer;
  }

  /**
   * Convert a zoom level (1-20) to a coordinate span delta.
   * Approximation: higher zoom = smaller span.
   */
  private zoomToSpan(zoom: number): number {
    return 360 / Math.pow(2, zoom);
  }
}
