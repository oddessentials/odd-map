/**
 * Unit Tests - Tile Map Component
 *
 * Tests for TileMap lifecycle, provider creation, region/office navigation,
 * marker states, and disposal.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the provider factory, MapLibre fallback, and client config BEFORE importing TileMap
vi.mock('../src/lib/map-providers/provider-factory', () => ({
  createTileMapProvider: vi.fn(),
}));

// MapLibre mock — instance is set per-test in the fallback suite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const maplibreMockState: { instance: any } = { instance: null };
vi.mock('../src/lib/map-providers/maplibre-provider', () => {
  return {
    MapLibreProvider: vi.fn().mockImplementation(function () {
      return maplibreMockState.instance;
    }),
  };
});

vi.mock('../src/lib/client-config', () => ({
  getMapProviderConfig: vi.fn(() => ({
    provider: 'maplibre',
    defaultZoom: 15,
    defaultTileStyle: 'light',
  })),
  getClientOffices: vi.fn(() => [
    {
      officeCode: 'NYC',
      city: 'New York',
      state: 'NY',
      officeType: 'Branch Office',
      address: '123 Broadway',
      region: 'Northeast',
      regionName: 'Northeast',
      coordinates: {
        lat: 40.7128,
        lon: -74.006,
        source: 'verified',
        confidence: 'high',
        approximate: false,
      },
    },
    {
      officeCode: 'LAX',
      city: 'Los Angeles',
      state: 'CA',
      officeType: 'Branch Office',
      address: '456 Sunset Blvd',
      region: 'West',
      regionName: 'West',
      coordinates: {
        lat: 34.0522,
        lon: -118.2437,
        source: 'verified',
        confidence: 'high',
        approximate: false,
      },
    },
    {
      officeCode: 'CHI',
      city: 'Chicago',
      state: 'IL',
      officeType: 'Branch Office',
      address: '789 Michigan Ave',
      region: 'Midwest',
      regionName: 'Midwest',
      coordinates: {
        lat: 41.8781,
        lon: -87.6298,
        source: 'verified',
        confidence: 'high',
        approximate: false,
      },
    },
  ]),
  getOfficesByRegion: vi.fn((regionName: string) => {
    const offices: Record<
      string,
      Array<{
        officeCode: string;
        city: string;
        state: string;
        coordinates: { lat: number; lon: number };
      }>
    > = {
      Northeast: [
        {
          officeCode: 'NYC',
          city: 'New York',
          state: 'NY',
          coordinates: { lat: 40.7128, lon: -74.006 },
        },
      ],
      West: [
        {
          officeCode: 'LAX',
          city: 'Los Angeles',
          state: 'CA',
          coordinates: { lat: 34.0522, lon: -118.2437 },
        },
      ],
    };
    return offices[regionName] || [];
  }),
}));

import { TileMap } from '../src/components/tile-map';
import { createTileMapProvider } from '../src/lib/map-providers/provider-factory';
import { MapLibreProvider } from '../src/lib/map-providers/maplibre-provider';
import type { TileMapProvider } from '../src/lib/map-providers/types';

function createMockProvider(): TileMapProvider {
  const mapElement = document.createElement('div');
  mapElement.className = 'mock-map-element';

  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    setLocation: vi.fn(),
    flyTo: vi.fn(),
    updateMarkerStyle: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    getMapElement: vi.fn(() => mapElement),
    setMarkers: vi.fn(),
    updateMarkerStates: vi.fn(),
    fitBounds: vi.fn(),
    onMarkerClick: vi.fn(),
  };
}

describe('TileMap', () => {
  let container: HTMLElement;
  let mockProvider: TileMapProvider;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mockProvider = createMockProvider();
    vi.mocked(createTileMapProvider).mockClear();
    vi.mocked(createTileMapProvider).mockReturnValue(mockProvider);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('creates tile-map-container element in constructor', () => {
    const tileMap = new TileMap(container, {});
    expect(container.querySelector('.tile-map-container')).toBeTruthy();
    tileMap.dispose();
  });

  it('creates provider and initializes on init()', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    expect(createTileMapProvider).toHaveBeenCalled();
    expect(mockProvider.initialize).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        zoom: 4,
        interactive: true,
        attributionControl: true,
      })
    );
    // Loads markers and fits bounds
    expect(mockProvider.setMarkers).toHaveBeenCalled();
    expect(mockProvider.fitBounds).toHaveBeenCalled();

    tileMap.dispose();
  });

  it('selectRegion fits bounds to region offices', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    tileMap.selectRegion('Northeast');

    expect(mockProvider.fitBounds).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ officeCode: 'NYC', lat: 40.7128, lon: -74.006 }),
      ]),
      60
    );

    tileMap.dispose();
  });

  it('selectRegion does nothing for unknown region', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    // Clear fitBounds calls from init
    vi.mocked(mockProvider.fitBounds).mockClear();

    tileMap.selectRegion('Unknown Region');

    expect(mockProvider.fitBounds).not.toHaveBeenCalled();

    tileMap.dispose();
  });

  it('selectOffice flies to office coordinates', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    const office = {
      officeCode: 'NYC',
      city: 'New York',
      state: 'NY',
      officeType: 'Branch Office' as const,
      address: '123 Broadway',
      region: 'Northeast',
      coordinates: {
        lat: 40.7128,
        lon: -74.006,
        source: 'verified' as const,
        confidence: 'high' as const,
        approximate: false,
      },
    };

    tileMap.selectOffice(office);

    expect(mockProvider.flyTo).toHaveBeenCalledWith(40.7128, -74.006, { zoom: 12, duration: 1000 });

    tileMap.dispose();
  });

  it('reset flies back to US center', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    tileMap.reset();

    expect(mockProvider.flyTo).toHaveBeenCalledWith(39.8283, -98.5795, { zoom: 4, duration: 1000 });

    tileMap.dispose();
  });

  it('updateMarkerStates delegates to provider', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    const states = [
      {
        officeCode: 'NYC',
        regionName: 'Northeast',
        visible: true,
        selected: true,
        highlighted: false,
        dimmed: false,
        subdued: false,
      },
      {
        officeCode: 'LAX',
        regionName: 'West',
        visible: true,
        selected: false,
        highlighted: false,
        dimmed: true,
        subdued: false,
      },
    ];

    tileMap.updateMarkerStates(states);

    expect(mockProvider.updateMarkerStates).toHaveBeenCalledWith(states);

    tileMap.dispose();
  });

  it('dispose cleans up provider and DOM', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    tileMap.dispose();

    expect(mockProvider.dispose).toHaveBeenCalled();
    expect(container.querySelector('.tile-map-container')).toBeNull();
  });

  it('dispose is safe to call multiple times', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    tileMap.dispose();
    tileMap.dispose();

    expect(mockProvider.dispose).toHaveBeenCalledTimes(1);
  });

  it('selectRegion is no-op before init', () => {
    const tileMap = new TileMap(container, {});
    // Should not throw
    tileMap.selectRegion('Northeast');
    expect(mockProvider.fitBounds).not.toHaveBeenCalled();
    tileMap.dispose();
  });

  it('setTileStyle delegates to provider.setStyle()', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    // Add setStyle mock to the provider
    (mockProvider as unknown as Record<string, unknown>).setStyle = vi.fn();

    tileMap.setTileStyle('dark');

    expect((mockProvider as unknown as Record<string, unknown>).setStyle).toHaveBeenCalledWith(
      'dark'
    );

    tileMap.dispose();
  });

  it('setTileStyle is no-op before init', () => {
    const tileMap = new TileMap(container, {});
    // Should not throw
    tileMap.setTileStyle('dark');
    tileMap.dispose();
  });

  it('setTileStyle is safe when provider has no setStyle', async () => {
    const tileMap = new TileMap(container, {});
    await tileMap.init();

    // Provider does not have setStyle by default in mock
    expect(() => tileMap.setTileStyle('dark')).not.toThrow();

    tileMap.dispose();
  });

  it('passes defaultTileStyle from config to provider initialize()', async () => {
    // Reconfigure mock to return dark style
    const { getMapProviderConfig } = await import('../src/lib/client-config');
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'maplibre',
      defaultZoom: 15,
      defaultTileStyle: 'dark',
    });

    const tileMap = new TileMap(container, {});
    await tileMap.init();

    expect(mockProvider.initialize).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        style: 'dark',
      })
    );

    tileMap.dispose();

    // Reset to default
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'maplibre',
      defaultZoom: 15,
      defaultTileStyle: 'light',
    });
  });

  it('defaults to light style when defaultTileStyle is not in config', async () => {
    const { getMapProviderConfig } = await import('../src/lib/client-config');
    // Simulate legacy config missing defaultTileStyle — tile-map.ts uses ?? 'light' fallback
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'maplibre',
      defaultZoom: 15,
    } as ReturnType<typeof getMapProviderConfig>);

    const tileMap = new TileMap(container, {});
    await tileMap.init();

    expect(mockProvider.initialize).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        style: 'light',
      })
    );

    tileMap.dispose();

    // Reset
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'maplibre',
      defaultZoom: 15,
      defaultTileStyle: 'light',
    });
  });

  it('handles dispose during init gracefully', async () => {
    const slowProvider = createMockProvider();
    (slowProvider.initialize as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    vi.mocked(createTileMapProvider).mockReturnValue(slowProvider);

    const tileMap = new TileMap(container, {});
    const initPromise = tileMap.init();
    tileMap.dispose();
    await initPromise;

    // Provider should be cleaned up even though init was in progress
    expect(slowProvider.dispose).toHaveBeenCalled();
  });
});

describe('TileMap provider fallback', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.mocked(createTileMapProvider).mockClear();
    vi.mocked(MapLibreProvider).mockClear();
    maplibreMockState.instance = null;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('falls back to MapLibre when Apple provider initialize() fails', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Configure as Apple provider
    const { getMapProviderConfig } = await import('../src/lib/client-config');
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'apple',
      appleMapToken: 'test-token',
      defaultZoom: 15,
      defaultTileStyle: 'light',
    });

    // Create a failing provider
    const failingProvider = createMockProvider();
    (failingProvider.initialize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('MapKit CDN load failed')
    );
    vi.mocked(createTileMapProvider).mockReturnValue(failingProvider);

    // Set up MapLibre mock to succeed
    const mockMapLibreInstance = createMockProvider();
    maplibreMockState.instance = mockMapLibreInstance;

    const tileMap = new TileMap(container, {});
    await tileMap.init();

    // Should have warned about the fallback
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('apple provider failed'),
      expect.any(Error)
    );

    // Should have disposed the failing provider
    expect(failingProvider.dispose).toHaveBeenCalled();

    // Should have initialized MapLibre as fallback
    expect(MapLibreProvider).toHaveBeenCalled();
    expect(mockMapLibreInstance.initialize).toHaveBeenCalled();

    tileMap.dispose();
  });

  it('falls back to MapLibre when Google provider initialize() fails', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { getMapProviderConfig } = await import('../src/lib/client-config');
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'google',
      googleMapsApiKey: 'test-key',
      defaultZoom: 14,
      defaultTileStyle: 'light',
    });

    const failingProvider = createMockProvider();
    (failingProvider.initialize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Google Maps CDN load failed')
    );
    vi.mocked(createTileMapProvider).mockReturnValue(failingProvider);

    const mockMapLibreInstance = createMockProvider();
    maplibreMockState.instance = mockMapLibreInstance;

    const tileMap = new TileMap(container, {});
    await tileMap.init();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('google provider failed'),
      expect.any(Error)
    );
    expect(failingProvider.dispose).toHaveBeenCalled();
    expect(mockMapLibreInstance.initialize).toHaveBeenCalled();

    tileMap.dispose();
  });

  it('throws when MapLibre itself fails (no further fallback)', async () => {
    const { getMapProviderConfig } = await import('../src/lib/client-config');
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'maplibre',
      defaultZoom: 15,
      defaultTileStyle: 'light',
    });

    const failingProvider = createMockProvider();
    (failingProvider.initialize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('MapLibre failed')
    );
    vi.mocked(createTileMapProvider).mockReturnValue(failingProvider);

    const tileMap = new TileMap(container, {});
    await expect(tileMap.init()).rejects.toThrow('MapLibre failed');

    tileMap.dispose();
  });

  it('fallback provider still loads markers and fits bounds', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { getMapProviderConfig } = await import('../src/lib/client-config');
    vi.mocked(getMapProviderConfig).mockReturnValue({
      provider: 'apple',
      appleMapToken: 'test-token',
      defaultZoom: 15,
      defaultTileStyle: 'light',
    });

    const failingProvider = createMockProvider();
    (failingProvider.initialize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('CDN failed')
    );
    vi.mocked(createTileMapProvider).mockReturnValue(failingProvider);

    const mockMapLibreInstance = createMockProvider();
    maplibreMockState.instance = mockMapLibreInstance;

    const tileMap = new TileMap(container, {});
    await tileMap.init();

    // After fallback, markers and bounds should still be loaded
    expect(mockMapLibreInstance.setMarkers).toHaveBeenCalled();
    expect(mockMapLibreInstance.fitBounds).toHaveBeenCalled();

    tileMap.dispose();
  });
});
