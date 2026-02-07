/**
 * Normalization Contract - Single Source of Truth
 *
 * These normalization rules MUST be used consistently across:
 * - Config schema validation
 * - Coordinate capture tool
 * - Runtime lookups
 * - Verification scripts
 *
 * Any deviation will cause heisenbugs and false failures.
 */

/**
 * Normalize office code for consistent lookups.
 * RULE: trim whitespace + uppercase
 *
 * @example
 * normalizeOfficeCode("  usg pa1  ") // => "USG PA1"
 * normalizeOfficeCode("USG PA1")     // => "USG PA1"
 */
export function normalizeOfficeCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Normalize region ID for consistent lookups.
 * RULE: trim whitespace + lowercase
 *
 * @example
 * normalizeRegionId("  Northeast  ") // => "northeast"
 * normalizeRegionId("NORTHEAST")     // => "northeast"
 */
export function normalizeRegionId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Normalize client ID for consistent lookups.
 * RULE: trim whitespace + lowercase
 *
 * @example
 * normalizeClientId("  USG  ") // => "usg"
 * normalizeClientId("Acme")    // => "acme"
 */
export function normalizeClientId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Normalize SVG path ID for consistent lookups.
 * RULE: trim whitespace + lowercase
 *
 * @example
 * normalizeSvgPathId("Region-USG-Northeast") // => "region-usg-northeast"
 */
export function normalizeSvgPathId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Validate SVG path ID follows naming convention.
 * PATTERN: region-{clientId}-{regionId}
 * All components must be lowercase alphanumeric with hyphens.
 *
 * @throws Error if pattern doesn't match
 */
export function validateSvgPathId(id: string, clientId?: string): string {
  const normalized = normalizeSvgPathId(id);

  if (!/^region-[a-z0-9]+-[a-z0-9-]+$/.test(normalized)) {
    throw new Error(`Invalid svgPathId: "${id}". Must match pattern: region-{clientId}-{regionId}`);
  }

  // Optionally validate client ID matches
  if (clientId) {
    const normalizedClient = normalizeClientId(clientId);
    const expectedPrefix = `region-${normalizedClient}-`;
    if (!normalized.startsWith(expectedPrefix)) {
      throw new Error(
        `Invalid svgPathId: "${id}". Must start with "${expectedPrefix}" for client "${clientId}"`
      );
    }
  }

  return normalized;
}
