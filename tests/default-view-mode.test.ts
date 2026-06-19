/**
 * Unit Tests - Tile-only Map
 *
 * The 2D SVG and 3D globe renderers were removed; the interactive tile map
 * is the only renderer. These tests assert the mode selector is gone from the
 * UI and that the app initializes the tile map.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ────────────────────────────────────────────────
// HTML contract: no mode selector, tile is the only map
// ────────────────────────────────────────────────

describe('Tile-only map: no mode selector in UI', () => {
  const html = readFileSync(resolve(__dirname, '../src/index.html'), 'utf-8');

  it('does not render a mode selector', () => {
    expect(html).not.toContain('mode-selector');
  });

  it('has no 2D/3D mode buttons', () => {
    expect(html).not.toMatch(/data-mode=/);
  });

  it('does not render a 3D spin toggle', () => {
    expect(html).not.toContain('spin-toggle');
  });

  it('keeps the tile style (light/dark) toggle', () => {
    expect(html).toContain('id="tile-style-toggle"');
  });
});

// ────────────────────────────────────────────────
// Runtime: app.ts initializes the tile map only
// ────────────────────────────────────────────────

describe('App initializes the tile map', () => {
  const appSource = readFileSync(resolve(__dirname, '../src/app.ts'), 'utf-8');

  it('constructs the TileMap renderer', () => {
    expect(appSource).toContain('new TileMap(');
  });

  it('sets the map mode dataset to tile', () => {
    expect(appSource).toMatch(/dataset\.mapMode\s*=\s*'tile'/);
  });

  it('no longer references the 2D or 3D renderers', () => {
    expect(appSource).not.toContain('map-svg');
    expect(appSource).not.toContain('map-3d');
  });
});
