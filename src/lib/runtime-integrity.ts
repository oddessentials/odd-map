/**
 * Runtime Integrity Verification
 *
 * Verifies that SVG assets match config expectations at runtime.
 * Uses Vite `?raw` imports for build compatibility.
 *
 * DEPLOY-TIME INVARIANT: The SVG content used for rendering MUST match
 * the content hashed in the config. No minification/transform differences.
 */

import type { MapConfig } from './map-config.schema.js';

export interface IntegrityResult {
  valid: boolean;
  errors: string[];
}

/**
 * Verify runtime integrity of SVG asset against config
 * @param config - Validated map configuration
 * @returns Integrity check result
 */
export async function verifyRuntimeIntegrity(config: MapConfig): Promise<IntegrityResult> {
  const errors: string[] = [];

  let svgContent: string;

  try {
    // Use Vite `?raw` import for text content - works in dev and prod
    // Vite will inline/bundle this correctly post-build
    const svgModule = await import(`../assets/${config.mapId}.svg?raw`);
    svgContent = svgModule.default;
  } catch (err) {
    const error = err as Error;
    errors.push(`Failed to load SVG asset "${config.mapId}.svg": ${error.message}`);
    return { valid: false, errors };
  }

  // Compute SHA-256 hash (browser-compatible)
  const computedHash = await computeSHA256(svgContent);

  if (computedHash !== config.mapAssetHash) {
    errors.push(
      `SVG hash mismatch - deployment artifact error detected!\\n` +
        `Expected: ${config.mapAssetHash}\\n` +
        `Actual:   ${computedHash}\\n` +
        `\\n` +
        `This indicates the SVG file and config are out of sync.\\n` +
        `Possible causes:\\n` +
        `  - Config not updated after SVG changes\\n` +
        `  - Mixed artifacts from different builds\\n` +
        `  - Build transform changed SVG content\\n` +
        `\\n` +
        `Remediation: Run 'npm run generate:map-hash' to update config`
    );
  }

  // Parse SVG and verify viewBox
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgEl = svgDoc.querySelector('svg');

  if (!svgEl) {
    errors.push('No <svg> element found in SVG content');
    return { valid: false, errors };
  }

  // Check for parse errors
  const parseError = svgDoc.querySelector('parsererror');
  if (parseError) {
    errors.push(`SVG parse error: ${parseError.textContent}`);
    return { valid: false, errors };
  }

  // Verify viewBox attribute matches config
  const viewBoxAttr = svgEl.getAttribute('viewBox');
  if (viewBoxAttr) {
    const [x, y, width, height] = viewBoxAttr.split(/\\s+/).map(Number);

    if (
      x !== config.viewBox.x ||
      y !== config.viewBox.y ||
      width !== config.viewBox.width ||
      height !== config.viewBox.height
    ) {
      errors.push(
        `ViewBox mismatch!\\n` +
          `Config: ${JSON.stringify(config.viewBox)}\\n` +
          `SVG:    ${viewBoxAttr}\\n` +
          `\\n` +
          `Remediation: Update config.viewBox to match SVG, or vice versa`
      );
    }
  } else {
    errors.push('SVG missing viewBox attribute');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Compute SHA-256 hash of text content (browser-compatible)
 */
async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
