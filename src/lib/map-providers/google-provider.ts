/**
 * Google Maps JS API Provider
 *
 * Implements MapProvider interface using Google Maps JavaScript API.
 * Library is loaded via CDN script injection on first use.
 * Requires an API key from client config for authentication.
 */

import type {
  TileMapProvider,
  MapProviderOptions,
  MarkerOptions,
  FlyToOptions,
  TileMapMarker,
  MarkerVisualState,
} from './types.js';

// Google Maps JS API CDN URL (v=weekly for latest stable)
const GMAPS_CDN_URL = 'https://maps.googleapis.com/maps/api/js';

// Cached in-flight promise to prevent duplicate script injection on concurrent calls
let gmapsLoadPromise: Promise<void> | null = null;

/**
 * Load Google Maps JS API from CDN via script injection.
 * Returns a promise that resolves when the library is ready.
 * Concurrent calls share the same in-flight promise.
 */
function loadGoogleMapsJS(apiKey: string): Promise<void> {
  // Already loaded
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).google) {
    const g = (window as unknown as Record<string, unknown>).google as Record<string, unknown>;
    if (g.maps) return Promise.resolve();
  }

  // Return existing in-flight promise if already loading
  if (gmapsLoadPromise) return gmapsLoadPromise;

  gmapsLoadPromise = new Promise((resolve, reject) => {
    // Use callback parameter for clean init
    const callbackName = '__oddMapGoogleInit';
    (window as unknown as Record<string, unknown>)[callbackName] = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      resolve();
    };

    const script = document.createElement('script');
    script.src = `${GMAPS_CDN_URL}?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      gmapsLoadPromise = null; // allow retry on failure
      reject(new Error('Failed to load Google Maps JS API from CDN'));
    };
    document.head.appendChild(script);
  });
  return gmapsLoadPromise;
}

/**
 * Get the google.maps global (CDN-loaded, untyped).
 * Returns null if not loaded.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGoogleMaps(): any {
  const g = (window as unknown as Record<string, unknown>).google as
    | Record<string, unknown>
    | undefined;
  return g?.maps ?? null;
}

export class GoogleProvider implements TileMapProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gm: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private marker: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private markers: any[] = [];
  private mapContainer: HTMLElement | null = null;
  private apiKey: string;
  private disposed = false;
  private markerClickHandler: ((officeCode: string) => void) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventListeners: Array<any> = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initialize(container: HTMLElement, options: MapProviderOptions): Promise<void> {
    await loadGoogleMapsJS(this.apiKey);

    if (this.disposed) return;

    this.gm = getGoogleMaps();
    if (!this.gm) {
      throw new Error('Google Maps JS API failed to initialize');
    }

    // Create wrapper container
    this.mapContainer = document.createElement('div');
    this.mapContainer.style.width = '100%';
    this.mapContainer.style.height = '100%';
    container.appendChild(this.mapContainer);

    const mapId = options.style === 'dark' ? 'DEMO_MAP_ID' : undefined;

    this.map = new this.gm.Map(this.mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: options.zoom,
      disableDefaultUI: true,
      zoomControl: options.interactive,
      scrollwheel: options.interactive,
      draggable: options.interactive,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapId,
      colorScheme: options.style === 'dark' ? 'DARK' : 'LIGHT',
    });
  }

  setLocation(lat: number, lon: number, options?: MarkerOptions): void {
    if (!this.map || !this.gm) return;

    this.map.setCenter({ lat, lng: lon });

    // Remove existing marker
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }

    // Create new marker (Advanced Markers if available, else fallback)
    if (this.gm.marker?.AdvancedMarkerElement) {
      const pinEl = document.createElement('div');
      pinEl.style.width = '24px';
      pinEl.style.height = '24px';
      pinEl.style.borderRadius = '50%';
      pinEl.style.backgroundColor = options?.color ?? '#00396c';
      pinEl.style.border = '3px solid #ffffff';
      pinEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

      this.marker = new this.gm.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat, lng: lon },
        content: pinEl,
        title: options?.label ?? '',
      });
    } else {
      this.marker = new this.gm.Marker({
        map: this.map,
        position: { lat, lng: lon },
        title: options?.label ?? '',
      });
    }
  }

  flyTo(lat: number, lon: number, options?: FlyToOptions): void {
    if (!this.map || !this.gm) return;

    // Google Maps panTo provides smooth animation
    this.map.panTo({ lat, lng: lon });

    if (options?.zoom != null) {
      this.map.setZoom(options.zoom);
    }

    // Move marker
    if (this.marker) {
      if (this.marker.position !== undefined && typeof this.marker.position === 'object') {
        // AdvancedMarkerElement
        this.marker.position = { lat, lng: lon };
      } else if (typeof this.marker.setPosition === 'function') {
        // Legacy Marker
        this.marker.setPosition({ lat, lng: lon });
      }
    }
  }

  updateMarkerStyle(options: MarkerOptions): void {
    if (!this.marker) return;
    // For AdvancedMarkerElement, update the pin element
    const content = this.marker.content;
    if (content instanceof HTMLElement) {
      content.style.backgroundColor = options.color;
    }
  }

  resize(): void {
    if (!this.map || !this.gm) return;
    this.gm.event.trigger(this.map, 'resize');
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    // Remove all marker click listeners
    for (const listener of this.eventListeners) {
      if (typeof listener === 'object' && listener !== null && 'remove' in listener) {
        listener.remove();
      } else if (this.gm?.event?.removeListener) {
        this.gm.event.removeListener(listener);
      }
    }
    this.eventListeners = [];

    // Remove markers
    if (this.marker) {
      this.marker.setMap?.(null);
      this.marker = null;
    }

    for (const m of this.markers) {
      m.setMap?.(null);
    }
    this.markers = [];

    // Google Maps doesn't have a built-in destroy, but we remove the container
    this.map = null;
    this.gm = null;

    if (this.mapContainer) {
      this.mapContainer.remove();
      this.mapContainer = null;
    }
  }

  setMarkers(markers: TileMapMarker[]): void {
    if (!this.map || !this.gm) return;

    // Clear existing markers
    for (const m of this.markers) {
      m.setMap?.(null);
    }
    this.markers = [];

    // Clear click listeners
    for (const listener of this.eventListeners) {
      if (typeof listener === 'object' && listener !== null && 'remove' in listener) {
        listener.remove();
      } else if (this.gm?.event?.removeListener) {
        this.gm.event.removeListener(listener);
      }
    }
    this.eventListeners = [];

    // Remove single-location marker if present
    if (this.marker) {
      this.marker.setMap?.(null);
      this.marker = null;
    }

    for (const m of markers) {
      const position = { lat: m.lat, lng: m.lon };

      if (this.gm.marker?.AdvancedMarkerElement) {
        const pinEl = document.createElement('div');
        pinEl.style.width = '18px';
        pinEl.style.height = '18px';
        pinEl.style.borderRadius = '50%';
        pinEl.style.backgroundColor = m.color || '#0066cc';
        pinEl.style.border = '2.5px solid #ffffff';
        pinEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        pinEl.style.cursor = 'pointer';

        const gMarker = new this.gm.marker.AdvancedMarkerElement({
          map: this.map,
          position,
          content: pinEl,
          title: m.label,
        });

        // Wire click handler
        const listener = gMarker.addListener('click', () => {
          if (this.markerClickHandler) {
            this.markerClickHandler(m.officeCode);
          }
        });
        this.eventListeners.push(listener);
        this.markers.push(gMarker);
      } else {
        const gMarker = new this.gm.Marker({
          map: this.map,
          position,
          title: m.label,
        });

        const listener = this.gm.event.addListener(gMarker, 'click', () => {
          if (this.markerClickHandler) {
            this.markerClickHandler(m.officeCode);
          }
        });
        this.eventListeners.push(listener);
        this.markers.push(gMarker);
      }
    }
  }

  updateMarkerStates(_states: MarkerVisualState[]): void {
    // Google Maps has limited built-in support for per-marker visual states.
    // For a full implementation, iterate markers and update opacity/color.
    // This is a no-op for demo purposes, same as AppleProvider.
  }

  fitBounds(markers: TileMapMarker[], padding = 50, maxZoom = 10): void {
    if (!this.map || !this.gm || markers.length === 0) return;

    const bounds = new this.gm.LatLngBounds();
    for (const m of markers) {
      bounds.extend({ lat: m.lat, lng: m.lon });
    }

    this.map.fitBounds(bounds, padding);

    // Enforce maxZoom after fitBounds
    const listener = this.gm.event.addListenerOnce(this.map, 'idle', () => {
      if (this.map && this.map.getZoom() > maxZoom) {
        this.map.setZoom(maxZoom);
      }
    });
    this.eventListeners.push(listener);
  }

  onMarkerClick(handler: (officeCode: string) => void): void {
    this.markerClickHandler = handler;
  }

  setStyle(style: 'light' | 'dark'): void {
    if (!this.map || !this.gm || this.disposed) return;
    // Google Maps v3 supports colorScheme property on map options
    try {
      this.map.setOptions({
        colorScheme: style === 'dark' ? 'DARK' : 'LIGHT',
      });
    } catch {
      // colorScheme may not be supported in older API versions
    }
  }

  getMapElement(): HTMLElement {
    if (!this.mapContainer) {
      throw new Error('Map not initialized. Call initialize() first.');
    }
    return this.mapContainer;
  }
}
