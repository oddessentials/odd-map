/**
 * Unit Tests - Default View Mode & Button Order
 *
 * Validates that the Tile map is the default view mode and that the
 * mode selector buttons appear in the correct order (Tile, 2D, 3D).
 *
 * Tests the static HTML contract and the runtime default from app.ts.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ────────────────────────────────────────────────
// HTML contract: button order and default active state
// ────────────────────────────────────────────────

describe('Mode Selector HTML Contract', () => {
  const html = readFileSync(resolve(__dirname, '../src/index.html'), 'utf-8');

  it('Tile button appears first in mode-selector', () => {
    const selectorMatch = html.match(/<div[^>]*class="mode-selector"[^>]*>([\s\S]*?)<\/div>/);
    expect(selectorMatch).not.toBeNull();

    const buttons = selectorMatch![1].match(/data-mode="(\w+)"/g);
    expect(buttons).not.toBeNull();
    expect(buttons!.length).toBe(3);
    expect(buttons![0]).toBe('data-mode="tile"');
    expect(buttons![1]).toBe('data-mode="2d"');
    expect(buttons![2]).toBe('data-mode="3d"');
  });

  it('Tile button has active class and aria-pressed=true', () => {
    const tileBtn = html.match(/<button[^>]*data-mode="tile"[^>]*>/);
    expect(tileBtn).not.toBeNull();
    expect(tileBtn![0]).toContain('active');
    expect(tileBtn![0]).toContain('aria-pressed="true"');
  });

  it('2D and 3D buttons are not active', () => {
    const twoDBtn = html.match(/<button[^>]*data-mode="2d"[^>]*>/);
    const threeDBtn = html.match(/<button[^>]*data-mode="3d"[^>]*>/);

    expect(twoDBtn).not.toBeNull();
    expect(threeDBtn).not.toBeNull();
    expect(twoDBtn![0]).not.toContain('active');
    expect(threeDBtn![0]).not.toContain('active');
    expect(twoDBtn![0]).toContain('aria-pressed="false"');
    expect(threeDBtn![0]).toContain('aria-pressed="false"');
  });
});

// ────────────────────────────────────────────────
// Runtime default: app.ts initializes with 'tile'
// ────────────────────────────────────────────────

describe('App Default Map Mode', () => {
  const appSource = readFileSync(resolve(__dirname, '../src/app.ts'), 'utf-8');

  it('initializes mapMode to tile', () => {
    // Match the constructor assignment pattern
    const assignment = appSource.match(/this\.mapMode\s*=\s*'(\w+)'/);
    expect(assignment).not.toBeNull();
    expect(assignment![1]).toBe('tile');
  });

  it('MapMode type includes tile as a valid option', () => {
    expect(appSource).toContain("'tile'");
    expect(appSource).toMatch(/type\s+MapMode\s*=.*'tile'/);
  });
});
