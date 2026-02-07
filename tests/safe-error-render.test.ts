/**
 * Unit Tests - Safe Error Rendering
 *
 * Tests that error messages are rendered safely using textContent
 * instead of innerHTML interpolation (Fix 6 from code review).
 *
 * Verifies the DOM-safe pattern: set innerHTML with an empty <pre>,
 * then populate via textContent to prevent XSS from Error objects.
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ────────────────────────────────────────────────
// Safe error rendering simulation
// ────────────────────────────────────────────────

/**
 * Simulates the safe error rendering pattern from map-svg.ts.
 * Sets HTML structure first, then uses textContent for the error message.
 */
function renderErrorSafely(container: HTMLElement, err: unknown): void {
  container.innerHTML = `
    <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
      <h2>SVG Loading Failed</h2>
      <p>Could not load map SVG. Please check the console for details.</p>
      <pre></pre>
    </div>
  `;
  const pre = container.querySelector('pre');
  if (pre) pre.textContent = String(err);
}

/**
 * The UNSAFE pattern that was replaced — for contrast testing.
 */
function renderErrorUnsafe(container: HTMLElement, err: unknown): void {
  container.innerHTML = `
    <div>
      <pre>${err}</pre>
    </div>
  `;
}

// ────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────

describe('Safe Error Rendering (Fix 6)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders error message in <pre> via textContent', () => {
    const error = new Error('Network timeout');
    renderErrorSafely(container, error);

    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre!.textContent).toBe('Error: Network timeout');
  });

  it('escapes HTML-like content in error messages', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    renderErrorSafely(container, malicious);

    const pre = container.querySelector('pre');
    expect(pre!.textContent).toBe('<img src=x onerror=alert(1)>');
    // textContent should NOT create child elements
    expect(pre!.children.length).toBe(0);
    expect(container.querySelector('img')).toBeNull();
  });

  it('escapes script injection attempts', () => {
    const malicious = '<script>alert("xss")</script>';
    renderErrorSafely(container, malicious);

    const pre = container.querySelector('pre');
    expect(pre!.textContent).toBe('<script>alert("xss")</script>');
    expect(container.querySelector('script')).toBeNull();
  });

  it('handles non-string error values', () => {
    renderErrorSafely(container, 404);
    expect(container.querySelector('pre')!.textContent).toBe('404');

    renderErrorSafely(container, null);
    expect(container.querySelector('pre')!.textContent).toBe('null');

    renderErrorSafely(container, undefined);
    expect(container.querySelector('pre')!.textContent).toBe('undefined');
  });

  it('renders complete error container structure', () => {
    renderErrorSafely(container, new Error('test'));

    expect(container.querySelector('h2')).not.toBeNull();
    expect(container.querySelector('p')).not.toBeNull();
    expect(container.querySelector('pre')).not.toBeNull();
  });

  it('unsafe pattern WOULD inject HTML (contrast test)', () => {
    const malicious = '<b>injected</b>';
    renderErrorUnsafe(container, malicious);

    const pre = container.querySelector('pre');
    // The unsafe pattern creates a <b> child element
    expect(pre!.querySelector('b')).not.toBeNull();
  });
});
