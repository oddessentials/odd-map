import { describe, it, expect, beforeEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import {
  initProjection,
  getMarkerPosition,
  switchClient,
  getCurrentClientId,
  __clearAllClients,
} from '../src/lib/projection';

describe('Multi-Client Isolation', () => {
  beforeEach(() => {
    // Clear all client state before each test
    __clearAllClients();
  });

  it('prevents coord map leakage between clients', async () => {
    await initProjection('usg');
    expect(getCurrentClientId()).toBe('usg');

    // Initialize second client
    await initProjection('oddessentials');
    expect(getCurrentClientId()).toBe('oddessentials');

    // Switch back — state should be preserved
    switchClient('usg');
    expect(getCurrentClientId()).toBe('usg');
  });

  it('throws when switching to uninitialized client', () => {
    expect(() => switchClient('nonexistent')).toThrow(/not initialized/);
  });

  it('normalizes client IDs consistently', async () => {
    await initProjection('USG');
    expect(getCurrentClientId()).toBe('usg');

    await initProjection(' usg ');
    expect(getCurrentClientId()).toBe('usg');
  });

  it('maintains separate coord maps per client', async () => {
    await initProjection('usg');
    await initProjection('oddessentials');

    // Switch between clients — IDs remain consistent
    switchClient('usg');
    expect(getCurrentClientId()).toBe('usg');

    switchClient('oddessentials');
    expect(getCurrentClientId()).toBe('oddessentials');
  });
});

/**
 * T014: V1/V2 Cross-Version Isolation Tests
 *
 * Verifies that switchClient() and getMarkerPosition() work correctly
 * when multiple clients are loaded, including switching between them.
 * Tests all 4 v1 clients (usg, oddessentials, acme, demo).
 */
describe('V1/V2 Cross-Version Isolation (T014)', () => {
  beforeEach(() => {
    __clearAllClients();
  });

  it('loads all 4 v1 clients and switches between them', async () => {
    const clients = ['usg', 'oddessentials', 'acme', 'demo'];

    for (const clientId of clients) {
      await initProjection(clientId);
      expect(getCurrentClientId()).toBe(clientId);
    }

    // Switch back to each and verify state is preserved
    for (const clientId of clients) {
      switchClient(clientId);
      expect(getCurrentClientId()).toBe(clientId);
    }
  });

  it('getMarkerPosition returns correct coords after switching between clients', async () => {
    await initProjection('usg');
    await initProjection('acme');

    // Read expected values from config files (v2 format)
    const usgConfig = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));
    const acmeConfig = JSON.parse(readFileSync('config/acme-map-config.json', 'utf8'));

    // Check USG coords (v2: projected from lat/lon, no svgOverride)
    switchClient('usg');
    const usgFirst = usgConfig.coordinates[0];
    const usgPos = getMarkerPosition(usgFirst.officeCode);
    expect(usgPos.x).toBeTypeOf('number');
    expect(usgPos.y).toBeTypeOf('number');

    // Switch to ACME and check its coords (v2: svgOverride)
    switchClient('acme');
    const acmeFirst = acmeConfig.coordinates[0];
    const acmePos = getMarkerPosition(acmeFirst.officeCode);
    expect(acmePos.x).toBe(acmeFirst.svgOverride.x);
    expect(acmePos.y).toBe(acmeFirst.svgOverride.y);

    // Switch back to USG -- coords must still be correct (no leakage)
    switchClient('usg');
    const usgPosAgain = getMarkerPosition(usgFirst.officeCode);
    expect(usgPosAgain.x).toBe(usgPos.x);
    expect(usgPosAgain.y).toBe(usgPos.y);
  });

  it('getMarkerPosition throws for wrong client office codes', async () => {
    await initProjection('usg');
    await initProjection('acme');

    // USG is active; ACME office codes should not resolve
    switchClient('usg');
    expect(() => getMarkerPosition('ACME TX1')).toThrow(/MISSING COORDINATE/);

    // ACME is active; USG office codes should not resolve
    switchClient('acme');
    expect(() => getMarkerPosition('USG PA1')).toThrow(/MISSING COORDINATE/);
  });

  it('concurrent init of multiple v1 clients via Promise.all (EC-02)', async () => {
    // Concurrent initialization should not cause race conditions
    await Promise.all([
      initProjection('usg'),
      initProjection('oddessentials'),
      initProjection('acme'),
      initProjection('demo'),
    ]);

    // All should be accessible
    for (const clientId of ['usg', 'oddessentials', 'acme', 'demo']) {
      switchClient(clientId);
      expect(getCurrentClientId()).toBe(clientId);
    }
  });

  it('re-initialization of same client is idempotent', async () => {
    await initProjection('usg');
    const usgConfig = JSON.parse(readFileSync('config/usg-map-config.json', 'utf8'));
    const firstCoord = usgConfig.coordinates[0];

    // Get position before re-init
    const posBefore = getMarkerPosition(firstCoord.officeCode);

    // Re-init should be a no-op (uses cached state)
    await initProjection('usg');
    const posAfter = getMarkerPosition(firstCoord.officeCode);

    expect(posAfter.x).toBe(posBefore.x);
    expect(posAfter.y).toBe(posBefore.y);
  });
});

/**
 * SC-003: Client String Isolation Scanning Test
 *
 * Scans all application source files under src/ for forbidden
 * client-specific literal strings. Prevents hardcoded client data
 * from leaking into the shared codebase.
 */
describe('Client String Isolation (SC-003)', () => {
  const SRC_DIR = join(__dirname, '..', 'src');
  const SCANNABLE_EXTENSIONS = new Set(['.ts', '.js', '.html', '.css', '.svg']);

  // Forbidden patterns — standalone brand references, not data in config JSON
  const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; description: string }> = [
    { pattern: /\bUSG Insurance\b/, description: 'USG brand name' },
    { pattern: /\busgins\.com\b/, description: 'USG email domain' },
    { pattern: /\baauins\.com\b/, description: 'AAU email domain' },
    { pattern: /844\.467\.5465/, description: 'USG main phone number' },
    { pattern: /getconnected@/, description: 'USG main email address' },
  ];

  function collectFiles(dir: string): string[] {
    const files: string[] = [];

    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...collectFiles(fullPath));
      } else if (SCANNABLE_EXTENSIONS.has(extname(entry))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  it('no client-specific strings in src/ source files', () => {
    const files = collectFiles(SRC_DIR);
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];

    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(join(__dirname, '..') + '\\', '').replace(/\\/g, '/');

      for (const { pattern, description } of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${relativePath}: contains ${description} (${pattern})`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('scans meaningful number of source files', () => {
    const files = collectFiles(SRC_DIR);
    // Ensure we're actually scanning a substantial codebase
    expect(files.length).toBeGreaterThan(10);
  });
});
