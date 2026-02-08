/**
 * Unit Tests - Sidebar Collapse/Expand
 *
 * Tests that sidebar collapse toggles correctly manage layout grid classes,
 * sidebar visibility, button ARIA state, and chevron direction.
 *
 * Tests CSS structural rules for collapsed sidebar states.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// CSS structural tests
// ---------------------------------------------------------------------------
describe('Sidebar Collapse CSS', () => {
  let cssContent: string;

  beforeEach(() => {
    cssContent = readFileSync(resolve(__dirname, '../src/styles/app.css'), 'utf-8');
  });

  it('defines left-collapsed grid-template-columns', () => {
    expect(cssContent).toContain('.layout.left-collapsed');
    expect(cssContent).toMatch(/\.layout\.left-collapsed\s*\{[^}]*grid-template-columns:\s*0px/);
  });

  it('defines right-collapsed grid-template-columns', () => {
    expect(cssContent).toContain('.layout.right-collapsed');
    expect(cssContent).toMatch(/\.layout\.right-collapsed\s*\{[^}]*grid-template-columns:[^}]*0px/);
  });

  it('defines both-collapsed grid-template-columns', () => {
    expect(cssContent).toContain('.layout.left-collapsed.right-collapsed');
  });

  it('layout has transition on grid-template-columns', () => {
    // Transition should be on the base .layout, not inside collapsed
    expect(cssContent).toMatch(/\.layout\s*\{[^}]*transition:[^}]*grid-template-columns/);
  });

  it('collapsed sidebar hides overflow and removes padding', () => {
    expect(cssContent).toContain('.sidebar.collapsed');
    expect(cssContent).toMatch(/\.sidebar\.collapsed\s*\{[^}]*overflow:\s*hidden/);
    expect(cssContent).toMatch(/\.sidebar\.collapsed\s*\{[^}]*padding:\s*0/);
  });

  it('sidebar collapse buttons have absolute positioning', () => {
    expect(cssContent).toContain('.sidebar-collapse-btn');
    expect(cssContent).toMatch(/\.sidebar-collapse-btn\s*\{[^}]*position:\s*absolute/);
  });

  it('collapse buttons are hidden on mobile', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toContain('.sidebar-collapse-btn');
    expect(mobileSection).toMatch(/\.sidebar-collapse-btn\s*\{[^}]*display:\s*none/);
  });

  it('resets collapsed sidebar state on mobile breakpoint', () => {
    const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
    expect(mobileSection).toContain('.sidebar.collapsed');
    expect(mobileSection).toMatch(/\.sidebar\.collapsed\s*\{[^}]*overflow:\s*visible/);
  });

  it('chevron flips when expanded class is applied', () => {
    expect(cssContent).toMatch(
      /\.sidebar-collapse-btn\.expanded\s+svg\s*\{[^}]*transform:\s*rotate\(180deg\)/
    );
  });
});

// ---------------------------------------------------------------------------
// DOM behavior tests — simulating toggleSidebar() logic from app.ts
// ---------------------------------------------------------------------------

/**
 * Minimal simulation of toggleSidebar() logic from app.ts.
 */
function toggleSidebar(
  side: 'left' | 'right',
  els: {
    layout: HTMLElement;
    sidebar: HTMLElement;
    btn: HTMLElement;
  }
): boolean {
  const className = side === 'left' ? 'left-collapsed' : 'right-collapsed';
  const isCollapsed = els.layout.classList.toggle(className);

  els.sidebar.classList.toggle('collapsed', isCollapsed);
  els.btn.classList.toggle('expanded', isCollapsed);

  const panelName = side === 'left' ? 'region panel' : 'details panel';
  const action = isCollapsed ? 'Expand' : 'Collapse';
  els.btn.setAttribute('aria-label', `${action} ${panelName}`);
  els.btn.setAttribute('title', `${action} ${panelName}`);
  els.btn.setAttribute('aria-expanded', String(!isCollapsed));

  return isCollapsed;
}

describe('Sidebar Collapse Toggle Logic', () => {
  let layout: HTMLElement;
  let sidebarLeft: HTMLElement;
  let sidebarRight: HTMLElement;
  let btnLeft: HTMLElement;
  let btnRight: HTMLElement;

  beforeEach(() => {
    layout = document.createElement('div');
    layout.className = 'layout';

    sidebarLeft = document.createElement('aside');
    sidebarLeft.className = 'sidebar sidebar-left';

    sidebarRight = document.createElement('aside');
    sidebarRight.className = 'sidebar sidebar-right';

    btnLeft = document.createElement('button');
    btnLeft.className = 'sidebar-collapse-btn sidebar-collapse-left';
    btnLeft.setAttribute('aria-label', 'Collapse region panel');

    btnRight = document.createElement('button');
    btnRight.className = 'sidebar-collapse-btn sidebar-collapse-right';
    btnRight.setAttribute('aria-label', 'Collapse details panel');
  });

  it('collapses left sidebar on first toggle', () => {
    const collapsed = toggleSidebar('left', {
      layout,
      sidebar: sidebarLeft,
      btn: btnLeft,
    });

    expect(collapsed).toBe(true);
    expect(layout.classList.contains('left-collapsed')).toBe(true);
    expect(sidebarLeft.classList.contains('collapsed')).toBe(true);
    expect(btnLeft.classList.contains('expanded')).toBe(true);
    expect(btnLeft.getAttribute('aria-label')).toBe('Expand region panel');
  });

  it('expands left sidebar on second toggle', () => {
    // Collapse first
    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    // Expand
    const collapsed = toggleSidebar('left', {
      layout,
      sidebar: sidebarLeft,
      btn: btnLeft,
    });

    expect(collapsed).toBe(false);
    expect(layout.classList.contains('left-collapsed')).toBe(false);
    expect(sidebarLeft.classList.contains('collapsed')).toBe(false);
    expect(btnLeft.classList.contains('expanded')).toBe(false);
    expect(btnLeft.getAttribute('aria-label')).toBe('Collapse region panel');
  });

  it('collapses right sidebar on first toggle', () => {
    const collapsed = toggleSidebar('right', {
      layout,
      sidebar: sidebarRight,
      btn: btnRight,
    });

    expect(collapsed).toBe(true);
    expect(layout.classList.contains('right-collapsed')).toBe(true);
    expect(sidebarRight.classList.contains('collapsed')).toBe(true);
    expect(btnRight.getAttribute('aria-label')).toBe('Expand details panel');
  });

  it('collapses both sidebars independently', () => {
    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    toggleSidebar('right', { layout, sidebar: sidebarRight, btn: btnRight });

    expect(layout.classList.contains('left-collapsed')).toBe(true);
    expect(layout.classList.contains('right-collapsed')).toBe(true);
    expect(sidebarLeft.classList.contains('collapsed')).toBe(true);
    expect(sidebarRight.classList.contains('collapsed')).toBe(true);
  });

  it('can expand one sidebar while other remains collapsed', () => {
    // Collapse both
    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    toggleSidebar('right', { layout, sidebar: sidebarRight, btn: btnRight });

    // Expand left only
    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });

    expect(layout.classList.contains('left-collapsed')).toBe(false);
    expect(layout.classList.contains('right-collapsed')).toBe(true);
    expect(sidebarLeft.classList.contains('collapsed')).toBe(false);
    expect(sidebarRight.classList.contains('collapsed')).toBe(true);
  });

  it('updates title attribute on toggle', () => {
    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    expect(btnLeft.getAttribute('title')).toBe('Expand region panel');

    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    expect(btnLeft.getAttribute('title')).toBe('Collapse region panel');
  });

  it('toggles aria-expanded between true and false', () => {
    btnLeft.setAttribute('aria-expanded', 'true');

    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    expect(btnLeft.getAttribute('aria-expanded')).toBe('false');

    toggleSidebar('left', { layout, sidebar: sidebarLeft, btn: btnLeft });
    expect(btnLeft.getAttribute('aria-expanded')).toBe('true');
  });
});

// ---------------------------------------------------------------------------
// HTML structural tests
// ---------------------------------------------------------------------------
describe('Sidebar Collapse HTML Structure', () => {
  let htmlContent: string;

  beforeEach(() => {
    htmlContent = readFileSync(resolve(__dirname, '../src/index.html'), 'utf-8');
  });

  it('has left collapse button in map section', () => {
    expect(htmlContent).toContain('id="collapse-left"');
    expect(htmlContent).toContain('sidebar-collapse-left');
  });

  it('has right collapse button in map section', () => {
    expect(htmlContent).toContain('id="collapse-right"');
    expect(htmlContent).toContain('sidebar-collapse-right');
  });

  it('collapse buttons have accessible aria-labels', () => {
    expect(htmlContent).toContain('aria-label="Collapse region panel"');
    expect(htmlContent).toContain('aria-label="Collapse details panel"');
  });

  it('collapse buttons have aria-expanded and aria-controls', () => {
    expect(htmlContent).toContain('aria-expanded="true"');
    expect(htmlContent).toContain('aria-controls="region-list"');
    expect(htmlContent).toContain('aria-controls="details-panel"');
  });
});
