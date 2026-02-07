import * as crypto from 'crypto';
import * as fs from 'fs';
import { parse } from 'node-html-parser';
import config from '../config/usg-map-config.json';

interface ClientOffice {
  officeCode: string;
  city: string;
  state: string;
}

let hasErrors = false;
let hasWarnings = false;

// Parse command line args
const args = process.argv.slice(2);
const strictMode = args.includes('--strict');
const clientArg = args.find((arg) => arg.startsWith('--client='));
const targetClient = clientArg ? clientArg.split('=')[1] : 'usg';

// Only verify if this is the target client
if (config.clientId !== targetClient) {
  console.log(
    `⏭️  Skipping verification - config is for client '${config.clientId}', target is '${targetClient}'`
  );
  process.exit(0);
}

function fail(message: string, remediation?: string, isWarning = false) {
  const symbol = isWarning ? '⚠️ ' : '❌';
  console.error(`${symbol} ${message}`);
  if (remediation) console.error(`   → ${remediation}`);
  if (isWarning) {
    hasWarnings = true;
  } else {
    hasErrors = true;
  }
}

// 1. Verify hash
const svgPath = `src/assets/${config.mapId}.svg`;
const svgContent = fs.readFileSync(svgPath, 'utf8');
const actualHash = crypto.createHash('sha256').update(svgContent).digest('hex');

if (actualHash !== config.mapAssetHash) {
  fail(`SVG hash mismatch for ${svgPath}`, `Run: npm run generate:map-hash`);
  console.error(`   Expected: ${config.mapAssetHash}`);
  console.error(`   Actual:   ${actualHash}`);
}

// 2. Verify viewBox matches
const root = parse(svgContent);
const svgEl = root.querySelector('svg');

if (!svgEl) {
  fail(`No <svg> element found in ${svgPath}`);
  process.exit(1);
}

const viewBoxAttr = svgEl.getAttribute('viewBox');
if (!viewBoxAttr) {
  fail(`SVG missing viewBox attribute`);
  process.exit(1);
}

const [x, y, width, height] = viewBoxAttr.split(/\s+/).map(Number);
const actualViewBox = { x, y, width, height };

if (
  actualViewBox.x !== config.viewBox.x ||
  actualViewBox.y !== config.viewBox.y ||
  actualViewBox.width !== config.viewBox.width ||
  actualViewBox.height !== config.viewBox.height
) {
  fail(`ViewBox mismatch`, `Update config.viewBox to match SVG: ${viewBoxAttr}`);
  console.error(`   Config: ${JSON.stringify(config.viewBox)}`);
  console.error(`   SVG:    ${JSON.stringify(actualViewBox)}`);
}

// 3. Verify all offices have coordinates (with normalization)
const normalizeOfficeCode = (code: string) => code.trim().toUpperCase();
const clientConfig = JSON.parse(fs.readFileSync(`config/${targetClient}-client.json`, 'utf8'));
const allOffices: ClientOffice[] = clientConfig.offices;
const configCodes = new Set(config.coordinates.map((c) => normalizeOfficeCode(c.officeCode)));

const missingCoords = allOffices.filter(
  (office) => !configCodes.has(normalizeOfficeCode(office.officeCode))
);

if (missingCoords.length > 0) {
  const isError = strictMode;
  fail(
    `${missingCoords.length} offices missing coordinates`,
    `Re-run tools/coordinate-capture.html and capture all offices`,
    !isError
  );
  missingCoords.forEach((o) => console.error(`   - ${o.officeCode}: ${o.city}, ${o.state}`));

  if (isError) {
    console.error(`\n🚫 STRICT MODE: Cannot release with missing coordinates`);
  }
}

// 4. Verify coordinates are within viewBox
config.coordinates.forEach(({ officeCode, svgX, svgY }) => {
  if (
    svgX < config.viewBox.x ||
    svgX > config.viewBox.width ||
    svgY < config.viewBox.y ||
    svgY > config.viewBox.height
  ) {
    fail(
      `Coordinate out of bounds: ${officeCode} (${svgX}, ${svgY})`,
      `Re-capture this office in coordinate-capture tool`
    );
  }
});

// 5. Verify all svgPathIds exist and are unique (normalized)
if (config.regions) {
  const normalizeId = (id: string) => id.trim().toLowerCase();

  config.regions.forEach(({ id, svgPathId }) => {
    const normalizedId = normalizeId(svgPathId);
    const elements = svgEl.querySelectorAll(`#${normalizedId}, [id="${normalizedId}" i]`);

    if (elements.length === 0) {
      fail(
        `Region '${id}' references missing SVG path ID: ${normalizedId}`,
        `Add id="${normalizedId}" to the region path in ${svgPath}`
      );
    } else if (elements.length > 1) {
      fail(
        `Region '${id}' svgPathId '${normalizedId}' matches ${elements.length} elements (must be unique)`,
        `Ensure ${normalizedId} appears exactly once in ${svgPath}`
      );
    }
  });
}

// Summary
if (hasErrors) {
  console.error('\n❌ Map integrity check failed. See remediation steps above.');
  process.exit(1);
}

if (hasWarnings && !strictMode) {
  console.warn('\n⚠️  Map integrity check passed with warnings (development mode).');
  console.warn('   Use --strict flag for production release validation.');
}

console.log('✅ Map integrity verified');
console.log(`   Client: ${config.clientId}`);
console.log(`   Hash: ${actualHash.slice(0, 16)}...`);
console.log(`   ViewBox: ${viewBoxAttr}`);
console.log(`   Coordinates: ${config.coordinates.length}/${allOffices.length} offices`);

if (strictMode) {
  console.log('   Mode: STRICT (production release)');
}
