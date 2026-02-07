import * as fs from 'fs';
import { parse } from 'node-html-parser';
import config from '../config/usg-map-config.json';
import { normalizeClientId } from '../src/lib/normalization.js';

/**
 * SVG Region ID Generator
 *
 * Automatically adds id="region-{clientId}-{regionId}" attributes
 * to SVG paths based on [data-region] attributes.
 *
 * Usage:
 *   npx tsx scripts/add-region-ids.ts [--dry-run]
 */

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const clientId = normalizeClientId(config.clientId);
const svgPath = `src/assets/${config.mapId}.svg`;

console.log('🔧 SVG Region ID Generator\n');
console.log(`Client: ${clientId}`);
console.log(`SVG: ${svgPath}`);
console.log(`Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}\n`);

// Load and parse SVG
const svgContent = fs.readFileSync(svgPath, 'utf8');
const root = parse(svgContent);
const svgEl = root.querySelector('svg');

if (!svgEl) {
  console.error('❌ No <svg> element found');
  process.exit(1);
}

// Find all elements with [data-region] attribute
const regionElements = svgEl.querySelectorAll('[data-region]');

if (regionElements.length === 0) {
  console.warn('⚠️  No [data-region] elements found in SVG');
  console.warn('   Add data-region="region-name" to region groups');
  process.exit(0);
}

console.log(`📋 Found ${regionElements.length} region element(s)\n`);

let changesMade = 0;
const changes: Array<{ region: string; oldId: string | null; newId: string }> = [];

regionElements.forEach((el) => {
  const regionAttr = el.getAttribute('data-region');
  if (!regionAttr) return;

  // Generate ID: region-{clientId}-{regionId}
  // Normalize region name to lowercase with hyphens
  const regionId = regionAttr.toLowerCase().replace(/\s+/g, '-');
  const newId = `region-${clientId}-${regionId}`;

  const currentId = el.getAttribute('id');

  if (currentId === newId) {
    console.log(`✅ ${regionAttr}: Already has correct ID (${newId})`);
    return;
  }

  changes.push({
    region: regionAttr,
    oldId: currentId,
    newId,
  });

  if (!dryRun) {
    el.setAttribute('id', newId);
    changesMade++;
  }
});

// Report changes
if (changes.length > 0) {
  console.log('\n📝 Changes to apply:\n');
  changes.forEach(({ region, oldId, newId }) => {
    const oldDisplay = oldId || '(none)';
    console.log(`  ${region}:`);
    console.log(`    Old ID: ${oldDisplay}`);
    console.log(`    New ID: ${newId}`);
  });
}

// Write back to file
if (!dryRun && changesMade > 0) {
  console.log(`\n💾 Writing ${changesMade} change(s) to ${svgPath}...`);

  // Create backup first
  const backupPath = `${svgPath}.backup`;
  fs.copyFileSync(svgPath, backupPath);
  console.log(`   Backup: ${backupPath}`);

  // Write updated SVG
  fs.writeFileSync(svgPath, root.toString(), 'utf8');
  console.log('   ✅ SVG updated successfully');

  console.log('\n⚠️  IMPORTANT: Regenerate SVG hash after verifying changes:');
  console.log('   npm run generate:map-hash');
} else if (dryRun && changes.length > 0) {
  console.log(`\n🔍 DRY RUN: Would update ${changes.length} region(s)`);
  console.log('   Run without --dry-run to apply changes');
} else {
  console.log('\n✅ No changes needed - all region IDs are correct');
}

// Summary
console.log('\n' + '='.repeat(60));
if (dryRun) {
  console.log('DRY RUN complete. No files modified.');
} else if (changesMade > 0) {
  console.log(`✅ Success! Updated ${changesMade} region ID(s)`);
  console.log('Next steps:');
  console.log('  1. Verify SVG still displays correctly');
  console.log('  2. npm run generate:map-hash');
  console.log('  3. npm run verify:svg-ids');
} else {
  console.log('✅ All region IDs already correct');
}
