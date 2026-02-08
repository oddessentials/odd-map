/**
 * Unit Tests - Mobile Header Compact Layout
 *
 * Tests that header elements are properly optimized for narrow iPhone
 * viewports (320-430px): reduced gap, icon-only reset, compact mode buttons.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Mobile Header CSS', () => {
  let cssContent: string;

  beforeEach(() => {
    cssContent = readFileSync(resolve(__dirname, '../src/styles/app.css'), 'utf-8');
  });

  it('reduces header-inner gap on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toMatch(/\.header-inner\s*\{[^}]*gap:\s*var\(--space-2\)/);
  });

  it('reduces header-inner padding on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toMatch(/\.header-inner\s*\{[^}]*padding:\s*0\s+var\(--space-2\)/);
  });

  it('shrinks logo text on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toMatch(/\.logo-text\s*\{[^}]*font-size:\s*var\(--text-lg\)/);
  });

  it('hides reset button text on mobile (icon-only)', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toContain('.reset-btn-text');
    expect(mobileSection).toMatch(/\.reset-btn-text\s*\{[^}]*display:\s*none/);
  });

  it('compacts mode-btn padding on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toMatch(
      /\.mode-btn\s*\{[^}]*padding:\s*var\(--space-1\)\s+var\(--space-2\)/
    );
  });

  it('reduces mode-btn font-size on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toMatch(/\.mode-btn\s*\{[^}]*font-size:\s*var\(--text-xs\)/);
  });
});

describe('Mobile Header HTML', () => {
  let htmlContent: string;

  beforeEach(() => {
    htmlContent = readFileSync(resolve(__dirname, '../src/index.html'), 'utf-8');
  });

  it('reset button text is wrapped in a span for CSS control', () => {
    expect(htmlContent).toContain('class="reset-btn-text"');
    expect(htmlContent).toMatch(/<span\s+class="reset-btn-text">Reset View<\/span>/);
  });

  it('reset button still has the SVG icon', () => {
    // SVG icon should be a direct child of the button, not inside the text span
    const resetBtnMatch = htmlContent.match(/id="reset-btn"[^>]*>[\s\S]*?<\/button>/);
    expect(resetBtnMatch).toBeTruthy();
    expect(resetBtnMatch![0]).toContain('<svg');
    expect(resetBtnMatch![0]).toContain('reset-btn-text');
  });

  it('mode selector buttons are present with data-mode attributes', () => {
    expect(htmlContent).toContain('data-mode="tile"');
    expect(htmlContent).toContain('data-mode="2d"');
    expect(htmlContent).toContain('data-mode="3d"');
  });
});
