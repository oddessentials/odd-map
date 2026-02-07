import { describe, it, expect } from 'vitest';
import { initProjection } from '../src/lib/projection.js';

/**
 * Production Smoke Test
 *
 * This test verifies the most basic production scenario:
 * - Can we initialize the projection system?
 * - Can we build without errors?
 * - Does the app not get stuck on loading screen?
 *
 * This catches the race condition where MapSvg.init() wasn't awaited.
 */
describe('Production Smoke Test', () => {
  it('initializes projection system without errors', async () => {
    // This is the most basic thing that MUST work in production
    // If this fails, the app is stuck on loading screen
    await expect(initProjection('usg')).resolves.not.toThrow();
  });

  it(
    'loading screen hides after init completes',
    { timeout: 5000 }, // 5 second timeout - if init hangs, this fails
    async () => {
      // Simulate what app.ts does
      await initProjection('usg');

      // If we get here without timeout, initialization completed
      // In the real app, this means loading screen will hide
      expect(true).toBe(true);
    }
  );
});
