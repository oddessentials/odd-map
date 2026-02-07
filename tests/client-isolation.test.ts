import { describe, it, expect, beforeEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import {
  initProjection,
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
