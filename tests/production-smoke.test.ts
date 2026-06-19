import { describe, it, expect, beforeEach } from 'vitest';
import { loadClientConfig, getClientOffices, __resetConfig } from '../src/lib/client-config.js';

/**
 * Production Smoke Test
 *
 * Verifies the most basic production scenario: the default client config
 * loads, validates, and exposes the office coordinates the tile map needs.
 * If this fails, the app would be stuck on the loading screen.
 */
describe('Production Smoke Test', () => {
  beforeEach(() => {
    __resetConfig();
  });

  it('loads and validates the usg client config without errors', async () => {
    await expect(loadClientConfig('usg')).resolves.toBeDefined();
  });

  it('exposes offices with numeric lat/lon for the tile map', async () => {
    await loadClientConfig('usg');
    const offices = getClientOffices();
    expect(offices.length).toBeGreaterThan(0);
    for (const office of offices) {
      expect(office.coordinates.lat).toBeTypeOf('number');
      expect(office.coordinates.lon).toBeTypeOf('number');
    }
  });
});
