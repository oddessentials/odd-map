import type { OfficeWithRegion } from '../types/index.js';

/**
 * Coordinate Sanity Validation
 *
 * Validates captured coordinates are within reasonable bounds
 * based on office location (city, state) and region.
 */

// Approximate bounding boxes for US regions (viewBox coordinates)
const REGION_BOUNDS: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {
  'Northeast Region': { minX: 680, maxX: 900, minY: 100, maxY: 250 },
  'Southeast Region': { minX: 600, maxX: 850, minY: 300, maxY: 500 },
  'Midwest Region': { minX: 400, maxX: 650, minY: 150, maxY: 350 },
  'South Central Region': { minX: 350, maxX: 550, minY: 300, maxY: 450 },
  'Mountain Region': { minX: 200, maxX: 450, minY: 150, maxY: 400 },
  'West Region': { minX: 50, maxX: 250, minY: 100, maxY: 400 },
};

// Known problematic coordinates (ocean, outside USA)
const OCEAN_ZONES = [
  { minX: 0, maxX: 50, minY: 0, maxY: 600 }, // Far west (Pacific)
  { minX: 900, maxX: 960, minY: 0, maxY: 600 }, // Far east (Atlantic)
  { minX: 0, maxX: 960, minY: 0, maxY: 80 }, // Far north (Canada)
  { minX: 0, maxX: 960, minY: 520, maxY: 600 }, // Far south (Gulf/Caribbean)
];

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validate a coordinate is within expected region bounds
 */
export function validateCoordinate(
  office: OfficeWithRegion,
  svgX: number,
  svgY: number
): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 1. Check if in ocean/water
  const inOcean = OCEAN_ZONES.some(
    (zone) => svgX >= zone.minX && svgX <= zone.maxX && svgY >= zone.minY && svgY <= zone.maxY
  );

  if (inOcean) {
    errors.push(`Coordinate (${svgX}, ${svgY}) is in ocean/water zone`);
  }

  // 2. Check if in expected region
  const regionBounds = REGION_BOUNDS[office.regionName];
  if (regionBounds) {
    const inRegion =
      svgX >= regionBounds.minX &&
      svgX <= regionBounds.maxX &&
      svgY >= regionBounds.minY &&
      svgY <= regionBounds.maxY;

    if (!inRegion) {
      warnings.push(
        `Coordinate outside expected region bounds. ` +
          `Expected: x=${regionBounds.minX}-${regionBounds.maxX}, y=${regionBounds.minY}-${regionBounds.maxY}. ` +
          `Got: x=${svgX}, y=${svgY}`
      );
    }
  }

  // 3. Check for exact duplicates (likely error)
  // This would need access to all captured coords - placeholder for now

  // 4. State-specific validation (if we have state boundaries)
  // Future enhancement: validate coord is in correct state

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Validate all coordinates in a capture session
 */
export function validateCaptureSession(
  coordinates: Array<{ officeCode: string; svgX: number; svgY: number; office: OfficeWithRegion }>
): { valid: boolean; results: Map<string, ValidationResult> } {
  const results = new Map<string, ValidationResult>();
  let allValid = true;

  // Check for duplicates
  const coordMap = new Map<string, string[]>();
  coordinates.forEach(({ officeCode, svgX, svgY }) => {
    const key = `${Math.round(svgX)},${Math.round(svgY)}`;
    if (!coordMap.has(key)) {
      coordMap.set(key, []);
    }
    coordMap.get(key)!.push(officeCode);
  });

  // Validate each coordinate
  coordinates.forEach(({ officeCode, svgX, svgY, office }) => {
    const result = validateCoordinate(office, svgX, svgY);

    // Add duplicate warning
    const key = `${Math.round(svgX)},${Math.round(svgY)}`;
    const duplicates = coordMap.get(key)!;
    if (duplicates.length > 1) {
      result.warnings.push(
        `Coordinate duplicated with: ${duplicates.filter((c) => c !== officeCode).join(', ')}`
      );
    }

    results.set(officeCode, result);
    if (!result.valid) {
      allValid = false;
    }
  });

  return { valid: allValid, results };
}

/**
 * Format validation results for display
 */
export function formatValidationResults(results: Map<string, ValidationResult>): string {
  const lines: string[] = [];
  let hasErrors = false;
  let hasWarnings = false;

  results.forEach((result, officeCode) => {
    if (result.errors.length > 0) {
      hasErrors = true;
      lines.push(`❌ ${officeCode}:`);
      result.errors.forEach((err) => lines.push(`   ${err}`));
    }

    if (result.warnings.length > 0) {
      hasWarnings = true;
      lines.push(`⚠️  ${officeCode}:`);
      result.warnings.forEach((warn) => lines.push(`   ${warn}`));
    }
  });

  if (!hasErrors && !hasWarnings) {
    return '✅ All coordinates validated successfully';
  }

  const summary = [];
  if (hasErrors) summary.push('❌ Errors found - fix before saving');
  if (hasWarnings) summary.push('⚠️  Warnings - review carefully');

  return [summary.join('\n'), '', ...lines].join('\n');
}
