import * as fs from 'fs';
import { parse } from 'node-html-parser';
import config from '../config/usg-map-config.json';

/**
 * Build-time verification of SVG ID contract.
 * Ensures all required region IDs exist in SVG before deployment.
 */

const svgPath = `src/assets/${config.mapId}.svg`;
const svgContent = fs.readFileSync(svgPath, 'utf8');
const root = parse(svgContent);
const svgEl = root.querySelector('svg');

if (!svgEl) {
  console.error('❌ No <svg> element found');
  process.exit(1);
}

// Get all IDs in SVG
const allIds = new Set<string>();
svgEl.querySelectorAll('[id]').forEach((el) => {
  const id = el.getAttribute('id');
  if (id) allIds.add(id.trim().toLowerCase());
});

console.log(`📋 Found ${allIds.size} elements with IDs in ${svgPath}`);

// Verify required region IDs
let hasErrors = false;
const missingIds: string[] = [];
const foundIds: string[] = [];

if (config.regions) {
  const normalizeId = (id: string) => id.trim().toLowerCase();
  const requiredPattern = new RegExp(`^region-${config.clientId}-`);

  config.regions.forEach(({ id, svgPathId }) => {
    const normalizedId = normalizeId(svgPathId);

    // Verify naming convention
    if (!requiredPattern.test(normalizedId)) {
      console.error(`❌ Region '${id}' has invalid svgPathId: '${normalizedId}'`);
      console.error(`   → Must start with 'region-${config.clientId}-'`);
      hasErrors = true;
      return;
    }

    // Check if exists in SVG
    if (allIds.has(normalizedId)) {
      foundIds.push(normalizedId);
    } else {
      missingIds.push(normalizedId);
    }
  });
}

// Report results
if (foundIds.length > 0) {
  console.log(`\n✅ Found ${foundIds.length} required region IDs:`);
  foundIds.forEach((id) => console.log(`   - ${id}`));
}

if (missingIds.length > 0) {
  console.error(`\n❌ Missing ${missingIds.length} required region IDs:`);
  missingIds.forEach((id) => {
    console.error(`   - ${id}`);
    console.error(`     Add to ${svgPath}: <path id="${id}" .../>`);
  });
  hasErrors = true;
}

// Show all region-* IDs in SVG for reference
const regionIds = Array.from(allIds).filter((id) => id.startsWith('region-'));
if (regionIds.length > 0) {
  console.log(`\n📍 All region IDs in SVG (${regionIds.length}):`);
  regionIds.forEach((id) => {
    const required = foundIds.includes(id);
    const symbol = required ? '✓' : ' ';
    console.log(`   ${symbol} ${id}`);
  });
}

if (hasErrors) {
  console.error('\n❌ SVG ID contract verification failed');
  console.error('   → Update SVG to include all required region IDs');
  process.exit(1);
}

console.log('\n✅ SVG ID contract verified - all required IDs present');
