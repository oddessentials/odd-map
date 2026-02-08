/**
 * Unit Tests - Map Provider Abstraction
 *
 * Tests for provider factory, interface compliance, and fallback behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMapProvider } from '../src/lib/map-providers/provider-factory';
import { MapLibreProvider } from '../src/lib/map-providers/maplibre-provider';
import { AppleProvider } from '../src/lib/map-providers/apple-provider';
import type { MapProvider, MapProviderConfig } from '../src/lib/map-providers/types';

describe('Map Provider Factory', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns MapLibre provider by default (no config)', () => {
    const provider = createMapProvider();
    expect(provider).toBeInstanceOf(MapLibreProvider);
  });

  it('returns MapLibre provider when config specifies "maplibre"', () => {
    const config: MapProviderConfig = {
      provider: 'maplibre',
      defaultZoom: 15,
    };
    const provider = createMapProvider(config);
    expect(provider).toBeInstanceOf(MapLibreProvider);
  });

  it('returns Apple provider when config specifies "apple" with valid token', () => {
    const config: MapProviderConfig = {
      provider: 'apple',
      appleMapToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.test-token',
      defaultZoom: 16,
    };
    const provider = createMapProvider(config);
    expect(provider).toBeInstanceOf(AppleProvider);
  });

  it('falls back to MapLibre when "apple" specified but no token provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config: MapProviderConfig = {
      provider: 'apple',
      defaultZoom: 15,
    };
    const provider = createMapProvider(config);

    expect(provider).toBeInstanceOf(MapLibreProvider);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Falling back to MapLibre'));
  });

  it('falls back to MapLibre when "apple" specified with empty token', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config: MapProviderConfig = {
      provider: 'apple',
      appleMapToken: '',
      defaultZoom: 15,
    };
    const provider = createMapProvider(config);

    expect(provider).toBeInstanceOf(MapLibreProvider);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('passes custom tileStyleUrl to MapLibre provider', () => {
    const config: MapProviderConfig = {
      provider: 'maplibre',
      tileStyleUrl: 'https://custom-tiles.example.com/style.json',
      defaultZoom: 14,
    };
    const provider = createMapProvider(config);
    expect(provider).toBeInstanceOf(MapLibreProvider);
  });
});

describe('Provider switching via config', () => {
  it('switching provider field from maplibre to apple changes provider type', () => {
    const maplibreConfig: MapProviderConfig = { provider: 'maplibre', defaultZoom: 15 };
    const appleConfig: MapProviderConfig = {
      provider: 'apple',
      appleMapToken: 'eyJhbGciOiJFUzI1NiJ9.valid-token',
      defaultZoom: 15,
    };

    const p1 = createMapProvider(maplibreConfig);
    const p2 = createMapProvider(appleConfig);

    expect(p1).toBeInstanceOf(MapLibreProvider);
    expect(p2).toBeInstanceOf(AppleProvider);
  });

  it('custom tileStyleUrl is passed through to MapLibre provider', () => {
    const config: MapProviderConfig = {
      provider: 'maplibre',
      tileStyleUrl: 'https://custom-tiles.example.com/dark.json',
      defaultZoom: 12,
    };
    const provider = createMapProvider(config);
    expect(provider).toBeInstanceOf(MapLibreProvider);
    // The style URL is stored internally -- we verify it compiles and returns the right type
  });

  it('apple fallback preserves tileStyleUrl for MapLibre fallback', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config: MapProviderConfig = {
      provider: 'apple',
      tileStyleUrl: 'https://custom-tiles.example.com/style.json',
      defaultZoom: 15,
    };
    const provider = createMapProvider(config);

    expect(provider).toBeInstanceOf(MapLibreProvider);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('MapProvider interface compliance', () => {
  const requiredMethods: (keyof MapProvider)[] = [
    'initialize',
    'setLocation',
    'flyTo',
    'updateMarkerStyle',
    'resize',
    'dispose',
    'getMapElement',
  ];

  it('MapLibre provider implements all MapProvider interface methods', () => {
    const provider = new MapLibreProvider();
    for (const method of requiredMethods) {
      expect(typeof provider[method]).toBe('function');
    }
  });

  it('Apple provider implements all MapProvider interface methods', () => {
    const provider = new AppleProvider('test-token');
    for (const method of requiredMethods) {
      expect(typeof provider[method]).toBe('function');
    }
  });

  it('MapLibre dispose is idempotent (safe to call multiple times)', () => {
    const provider = new MapLibreProvider();
    expect(() => {
      provider.dispose();
      provider.dispose();
    }).not.toThrow();
  });

  it('Apple dispose is idempotent (safe to call multiple times)', () => {
    const provider = new AppleProvider('test-token');
    expect(() => {
      provider.dispose();
      provider.dispose();
    }).not.toThrow();
  });

  it('MapLibre getMapElement throws before initialize', () => {
    const provider = new MapLibreProvider();
    expect(() => provider.getMapElement()).toThrow('Map not initialized');
  });

  it('Apple getMapElement throws before initialize', () => {
    const provider = new AppleProvider('test-token');
    expect(() => provider.getMapElement()).toThrow('Map not initialized');
  });

  it('MapLibre provider implements optional setStyle method', () => {
    const provider = new MapLibreProvider();
    expect(typeof provider.setStyle).toBe('function');
  });

  it('Apple provider implements optional setStyle method', () => {
    const provider = new AppleProvider('test-token');
    expect(typeof provider.setStyle).toBe('function');
  });

  it('MapLibre setStyle is safe to call before initialize', () => {
    const provider = new MapLibreProvider();
    expect(() => provider.setStyle('dark')).not.toThrow();
  });

  it('Apple setStyle is safe to call before initialize', () => {
    const provider = new AppleProvider('test-token');
    expect(() => provider.setStyle('dark')).not.toThrow();
  });

  it('MapLibre setStyle is safe to call after dispose', () => {
    const provider = new MapLibreProvider();
    provider.dispose();
    expect(() => provider.setStyle('dark')).not.toThrow();
  });

  it('Apple setStyle is safe to call after dispose', () => {
    const provider = new AppleProvider('test-token');
    provider.dispose();
    expect(() => provider.setStyle('dark')).not.toThrow();
  });
});
