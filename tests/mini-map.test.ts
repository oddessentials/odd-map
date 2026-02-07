/**
 * Unit Tests - Mini-Map Component
 *
 * Tests for MiniMap lifecycle, provider creation, fly-to, expand/collapse, and disposal.
 * Uses mocked providers to avoid network requests in tests.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the provider factory and client config BEFORE importing MiniMap
vi.mock('../src/lib/map-providers/provider-factory', () => ({
  createMapProvider: vi.fn(),
}));

vi.mock('../src/lib/client-config', () => ({
  getMapProviderConfig: vi.fn(() => ({
    provider: 'maplibre',
    defaultZoom: 15,
  })),
  getActiveConfig: vi.fn(() => ({
    name: 'Test Client',
    theme: {},
  })),
}));

// Mock MapExpandOverlay to avoid real DOM overlay creation
vi.mock('../src/components/map-expand-overlay', () => {
  const MapExpandOverlay = vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    options: { onClose: () => void }
  ) {
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'mock-overlay';
    document.body.appendChild(overlayContainer);
    this.setMapElement = vi.fn((el: HTMLElement) => {
      overlayContainer.appendChild(el);
    });
    this.close = vi.fn(() => {
      options.onClose();
      overlayContainer.remove();
    });
  });
  return { MapExpandOverlay };
});

import { MiniMap } from '../src/components/mini-map';
import { createMapProvider } from '../src/lib/map-providers/provider-factory';
import type { MapProvider } from '../src/lib/map-providers/types';

function createMockProvider(): MapProvider {
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
  };
}

function createTestOffice(code: string, lat: number, lon: number) {
  return {
    officeCode: code,
    city: 'Test City',
    state: 'Test State',
    officeType: 'Branch Office' as const,
    address: '123 Test St',
    region: 'Test Region',
    coordinates: {
      lat,
      lon,
      source: 'verified' as const,
      confidence: 'high' as const,
      approximate: false,
    },
  };
}

describe('MiniMap', () => {
  let container: HTMLElement;
  let mockProvider: MapProvider;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mockProvider = createMockProvider();
    vi.mocked(createMapProvider).mockClear();
    vi.mocked(createMapProvider).mockReturnValue(mockProvider);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('creates internal DOM structure on construction', () => {
    const miniMap = new MiniMap(container);
    expect(container.querySelector('.mini-map-wrapper')).toBeTruthy();
    expect(container.querySelector('.mini-map-expand-btn')).toBeTruthy();
    miniMap.dispose();
  });

  it('creates provider on first show()', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');

    expect(createMapProvider).toHaveBeenCalled();
    expect(mockProvider.initialize).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        zoom: 15,
        interactive: true,
        attributionControl: true,
      })
    );
    expect(mockProvider.setLocation).toHaveBeenCalledWith(40.7, -74.0, { color: '#ff0000' });

    miniMap.dispose();
  });

  it('does not recreate provider on show() with same office', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');
    await miniMap.show(office, '#ff0000');

    expect(createMapProvider).toHaveBeenCalledTimes(1);
    expect(mockProvider.initialize).toHaveBeenCalledTimes(1);

    miniMap.dispose();
  });

  it('calls flyTo on show() with different office', async () => {
    const miniMap = new MiniMap(container);
    const office1 = createTestOffice('TST1', 40.7, -74.0);
    const office2 = createTestOffice('TST2', 34.0, -118.2);

    await miniMap.show(office1, '#ff0000');
    await miniMap.show(office2, '#ff0000');

    expect(mockProvider.flyTo).toHaveBeenCalledWith(34.0, -118.2, { duration: 1000 });

    miniMap.dispose();
  });

  it('calls flyTo() directly with correct coordinates', async () => {
    const miniMap = new MiniMap(container);
    const office1 = createTestOffice('TST1', 40.7, -74.0);
    const office2 = createTestOffice('TST2', 34.0, -118.2);

    await miniMap.show(office1, '#ff0000');
    miniMap.flyTo(office2);

    expect(mockProvider.flyTo).toHaveBeenCalledWith(34.0, -118.2, { duration: 1000 });

    miniMap.dispose();
  });

  it('disposes provider on dispose()', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');
    miniMap.dispose();

    expect(mockProvider.dispose).toHaveBeenCalled();
  });

  it('dispose is safe to call multiple times', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');
    miniMap.dispose();
    miniMap.dispose();

    expect(mockProvider.dispose).toHaveBeenCalledTimes(1);
  });

  it('clears container innerHTML on dispose', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');
    miniMap.dispose();

    expect(container.innerHTML).toBe('');
  });

  it('shows fallback message when provider initialization fails', async () => {
    const failingProvider = createMockProvider();
    (failingProvider.initialize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );
    vi.mocked(createMapProvider).mockReturnValue(failingProvider);

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);

    await miniMap.show(office, '#ff0000');

    expect(container.querySelector('.mini-map-fallback')).toBeTruthy();
    expect(errorSpy).toHaveBeenCalled();
    expect(failingProvider.dispose).toHaveBeenCalled();

    miniMap.dispose();
  });

  it('does nothing after dispose when show is called', async () => {
    const miniMap = new MiniMap(container);
    miniMap.dispose();

    const office = createTestOffice('TST1', 40.7, -74.0);
    await miniMap.show(office, '#ff0000');

    expect(createMapProvider).not.toHaveBeenCalled();
  });

  it('expand reparents map element into overlay and calls resize', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);
    await miniMap.show(office, '#ff0000');

    miniMap.expand();

    // Provider resize should be called after reparenting into overlay
    expect(mockProvider.resize).toHaveBeenCalled();
    expect(mockProvider.getMapElement).toHaveBeenCalled();
  });

  it('expand does nothing before provider is initialized', () => {
    const miniMap = new MiniMap(container);

    // Should not throw
    miniMap.expand();
    expect(mockProvider.getMapElement).not.toHaveBeenCalled();

    miniMap.dispose();
  });

  it('expand does nothing after dispose', async () => {
    const miniMap = new MiniMap(container);
    const office = createTestOffice('TST1', 40.7, -74.0);
    await miniMap.show(office, '#ff0000');
    miniMap.dispose();

    // Reset call counts after dispose
    vi.mocked(mockProvider.getMapElement).mockClear();

    miniMap.expand();
    expect(mockProvider.getMapElement).not.toHaveBeenCalled();
  });
});
