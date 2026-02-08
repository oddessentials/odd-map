/**
 * Unit Tests - Mobile Viewport & Layout
 *
 * Tests that CSS layout rules are correctly structured for mobile responsiveness,
 * including dynamic viewport height and minimum map section height.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Mobile Viewport CSS', () => {
  let cssContent: string;

  beforeEach(() => {
    cssContent = readFileSync(resolve(__dirname, '../src/styles/app.css'), 'utf-8');
  });

  it('uses dynamic viewport height (100dvh) for mobile browser compatibility', () => {
    // 100dvh accounts for mobile browser URL bar resizing
    expect(cssContent).toContain('100dvh');
  });

  it('preserves 100vh fallback for browsers without dvh support', () => {
    // The 100vh declaration should come BEFORE 100dvh as a fallback
    const vhIndex = cssContent.indexOf('min-height: 100vh');
    const dvhIndex = cssContent.indexOf('min-height: 100dvh');

    expect(vhIndex).toBeGreaterThan(-1);
    expect(dvhIndex).toBeGreaterThan(-1);
    expect(vhIndex).toBeLessThan(dvhIndex); // vh fallback comes first
  });

  it('mobile map section has minimum usable height', () => {
    // Extract the mobile media query section
    const mobileQuery = cssContent.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)?.[0];
    expect(mobileQuery).toBeDefined();
    // map-section should have a min-height for usability
    expect(mobileQuery).toContain('.map-section');
    expect(mobileQuery).toContain('min-height');
  });

  it('layout overrides desktop min-height on mobile', () => {
    // Desktop has min-height: 500px; mobile should override
    expect(cssContent).toContain('min-height: 500px');

    // Mobile media query should change layout behavior
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toContain('.layout');
  });

  it('uses safe-area-insets for notched devices', () => {
    expect(cssContent).toContain('env(safe-area-inset-top');
    expect(cssContent).toContain('env(safe-area-inset-bottom');
  });

  it('bottom sheet has proper mobile positioning', () => {
    expect(cssContent).toContain('.sidebar-right');
    expect(cssContent).toContain('position: fixed');
    expect(cssContent).toContain('transform: translateY(100%)');
    expect(cssContent).toContain('will-change: transform');
  });

  it('touch targets meet 44px minimum (WCAG / Apple HIG)', () => {
    const matches = cssContent.match(/min-height:\s*44px/g) || [];
    // Multiple elements should have 44px minimum
    expect(matches.length).toBeGreaterThanOrEqual(5);
  });

  it('prefers-reduced-motion media query is present', () => {
    expect(cssContent).toContain('prefers-reduced-motion');
    expect(cssContent).toContain('animation-duration: 0.01ms');
  });
});
