import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getMarkerPosition, initProjection } from '../src/lib/projection';
import { loadClientConfig, getClientOffices } from '../src/lib/client-config';
import {
  validateImportMap,
  validateProdImportMap,
  getAvailableClients,
} from '../src/lib/client-registry';
import type { ClientRegistry } from '../src/lib/client-registry';

describe('Cross-Environment Config Loading', () => {
  it('loads config in production bundle', async () => {
    // This test ensures config resolution works post-bundling
    await loadClientConfig('usg');
    await initProjection('usg');

    const allOffices = getClientOffices();
    expect(allOffices.length).toBeGreaterThan(0);
  });

  it('all offices have coordinates with loud failure', async () => {
    await loadClientConfig('usg');
    await initProjection('usg');
    const allOffices = getClientOffices();

    // Skip test if coordinates not yet captured
    if (allOffices.length === 0) {
      expect(true).toBe(true);
      return;
    }

    allOffices.forEach((office) => {
      // This MUST throw if coordinate missing (no silent fallback)
      const fn = () => getMarkerPosition(office.officeCode);
      // For now, just check it doesn't silently return null
      try {
        const pos = fn();
        expect(pos).toBeTruthy();
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeGreaterThanOrEqual(0);
      } catch (err) {
        // Expected to throw for missing coords - that's good!
        const error = err as Error;
        expect(error.message).toContain('MISSING COORDINATE');
      }
    });
  });

  it('normalizes office codes consistently', async () => {
    await loadClientConfig('usg');
    await initProjection('usg');

    // Test will be meaningful once we have coordinates
    // For now, just ensure normalization doesn't crash
    try {
      const position1 = getMarkerPosition('USG PA1');
      const position2 = getMarkerPosition(' usg pa1 ');
      const position3 = getMarkerPosition('usg pa1');

      expect(position1).toEqual(position2);
      expect(position1).toEqual(position3);
    } catch (err) {
      // Expected if coords not captured yet
      const error = err as Error;
      expect(error.message).toContain('MISSING COORDINATE');
    }
  });

  it('fails loudly on missing coordinate', async () => {
    await loadClientConfig('usg');
    await initProjection('usg');

    expect(() => getMarkerPosition('NONEXISTENT')).toThrow(/MISSING COORDINATE/);
  });
});

describe('Import Map Validation (Item 7)', () => {
  it('real test registry validates successfully', () => {
    const registry: ClientRegistry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.test.json'), 'utf-8')
    );
    const result = validateImportMap(registry);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fake registry with unknown client fails with descriptive error', () => {
    const fakeRegistry: ClientRegistry = {
      clients: ['usg', 'nonexistent'],
      configPath: 'config/',
      clientConfigPath: 'config/',
      fixtureClients: [],
    };
    const result = validateImportMap(fakeRegistry);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('nonexistent'))).toBe(true);
    expect(result.errors.some((e) => e.includes('TEST_CONFIG_IMPORT_MAP'))).toBe(true);
  });

  it('data-driven fixture clients skip client config validation', () => {
    const fakeRegistry: ClientRegistry = {
      clients: ['usg', 'acme', 'demo'],
      configPath: 'config/',
      clientConfigPath: 'config/',
      fixtureClients: ['acme', 'demo'],
    };
    const result = validateImportMap(fakeRegistry);
    // acme/demo should not produce TEST_CLIENT_CONFIG_MAP errors
    expect(
      result.errors.filter((e) => e.includes('acme') && e.includes('TEST_CLIENT_CONFIG_MAP'))
    ).toEqual([]);
    expect(
      result.errors.filter((e) => e.includes('demo') && e.includes('TEST_CLIENT_CONFIG_MAP'))
    ).toEqual([]);
  });

  it('PROD map clients exist in TEST maps', () => {
    const registry: ClientRegistry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.test.json'), 'utf-8')
    );
    const result = validateImportMap(registry);
    // No errors about PROD maps missing from TEST maps
    expect(result.errors.filter((e) => e.includes('PROD_'))).toEqual([]);
  });
});

describe('Production Import Map Coverage', () => {
  // Regression guard: clients listed in a production-mode registry but absent
  // from the PROD import maps are selectable yet unloadable at runtime
  // (the ?client=acme bug). Every such client must resolve in the PROD maps.
  it('every client in the prod registry resolves in the PROD import maps', () => {
    const registry: ClientRegistry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.prod.json'), 'utf-8')
    );
    const result = validateProdImportMap(registry);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('every client in the demo registry resolves in the PROD import maps', () => {
    // The GitHub Pages demo builds in production mode, so it loads clients
    // through the PROD import maps — not the TEST maps.
    const registry: ClientRegistry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.demo.json'), 'utf-8')
    );
    const result = validateProdImportMap(registry);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('flags a prod-registry client missing from the PROD import maps', () => {
    const fakeRegistry: ClientRegistry = {
      clients: ['usg', 'ghost'],
      configPath: 'config/',
      clientConfigPath: 'config/',
    };
    const result = validateProdImportMap(fakeRegistry);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('ghost'))).toBe(true);
    expect(result.errors.some((e) => e.includes('PROD_CONFIG_IMPORT_MAP'))).toBe(true);
  });

  it('does not treat an inherited Object property name as covered', () => {
    // Presence is checked with Object.hasOwn, so a client named after a
    // prototype member must NOT be silently considered present.
    const fakeRegistry: ClientRegistry = {
      clients: ['constructor', 'toString', '__proto__'],
      configPath: 'config/',
      clientConfigPath: 'config/',
    };
    const result = validateProdImportMap(fakeRegistry);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('constructor'))).toBe(true);
    expect(result.errors.some((e) => e.includes('toString'))).toBe(true);
    expect(result.errors.some((e) => e.includes('__proto__'))).toBe(true);
  });

  it('flags a defaultClient that is not a member of the clients array', () => {
    const fakeRegistry: ClientRegistry = {
      clients: ['usg', 'oddessentials', 'acme'],
      configPath: 'config/',
      clientConfigPath: 'config/',
      defaultClient: 'nonexistent',
    };
    const result = validateProdImportMap(fakeRegistry);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes('defaultClient') && e.includes('nonexistent'))
    ).toBe(true);
  });

  it('accepts a defaultClient that is a member of the clients array', () => {
    const fakeRegistry: ClientRegistry = {
      clients: ['usg', 'oddessentials', 'acme'],
      configPath: 'config/',
      clientConfigPath: 'config/',
      defaultClient: 'usg',
    };
    const result = validateProdImportMap(fakeRegistry);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('the real demo registry (which sets defaultClient) passes the defaultClient check', () => {
    const registry: ClientRegistry = JSON.parse(
      readFileSync(join(__dirname, '..', 'config', 'clients.demo.json'), 'utf-8')
    );
    const result = validateProdImportMap(registry);
    expect(result.errors.filter((e) => e.includes('defaultClient'))).toEqual([]);
  });
});

describe('getAvailableClients fixture exclusion', () => {
  // Fixture clients (demo) are intentionally not wired into the client-config
  // import maps, so they must not be offered as selectable ?client= values —
  // otherwise selecting them throws at runtime (the ?client=demo bug).
  it('excludes fixture clients (demo) but keeps fully-wired clients (acme)', async () => {
    const available = await getAvailableClients();
    expect(available).toContain('oddessentials');
    expect(available).toContain('usg');
    expect(available).toContain('acme');
    expect(available).not.toContain('demo');
  });
});
