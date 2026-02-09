import * as crypto from 'crypto';
import * as fs from 'fs';
import { parse } from 'node-html-parser';
import { geoAlbersUsa } from 'd3-geo';

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

// Load config dynamically based on target client
const configPath = `config/${targetClient}-map-config.json`;
if (!fs.existsSync(configPath)) {
  console.error(`❌ Config file not found: ${configPath}`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

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
const clientConfigPath = `config/${targetClient}-client.json`;
if (!fs.existsSync(clientConfigPath)) {
  if (strictMode) {
    fail(
      `Client config not found: ${clientConfigPath}`,
      `Create the client config or remove this client from the registry`
    );
  } else {
    console.warn(
      `⚠️  Client config not found: ${clientConfigPath} — skipping office coverage check`
    );
  }
} else {
  const clientConfig = JSON.parse(fs.readFileSync(clientConfigPath, 'utf8'));
  const allOffices: ClientOffice[] = clientConfig.offices;
  const configCodes = new Set(
    config.coordinates.map((c: { officeCode: string }) => normalizeOfficeCode(c.officeCode))
  );

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
}

// 4. Verify coordinates are within viewBox (v1 and v2 compatible)
function resolveCoordinate(coord: {
  officeCode: string;
  svgX?: number;
  svgY?: number;
  svgOverride?: { x: number; y: number };
  lat?: number;
  lon?: number;
}): { officeCode: string; x: number; y: number } | null {
  // V1: direct svgX/svgY
  if (typeof coord.svgX === 'number' && typeof coord.svgY === 'number') {
    return { officeCode: coord.officeCode, x: coord.svgX, y: coord.svgY };
  }

  // V2 with svgOverride
  if (coord.svgOverride) {
    return { officeCode: coord.officeCode, x: coord.svgOverride.x, y: coord.svgOverride.y };
  }

  // V2 with projection
  if (config.projection && typeof coord.lat === 'number' && typeof coord.lon === 'number') {
    const projection = geoAlbersUsa()
      .scale(config.projection.scale)
      .translate(config.projection.translate);
    const result = projection([coord.lon, coord.lat]);
    if (result) {
      return { officeCode: coord.officeCode, x: result[0], y: result[1] };
    }
  }

  return null;
}

for (const coord of config.coordinates) {
  const resolved = resolveCoordinate(coord);
  if (!resolved) {
    fail(
      `Cannot resolve coordinate for: ${coord.officeCode}`,
      `Ensure valid lat/lon or svgOverride is set`
    );
    continue;
  }

  if (
    resolved.x < config.viewBox.x ||
    resolved.x > config.viewBox.x + config.viewBox.width ||
    resolved.y < config.viewBox.y ||
    resolved.y > config.viewBox.y + config.viewBox.height
  ) {
    fail(
      `Coordinate out of bounds: ${resolved.officeCode} (${resolved.x.toFixed(2)}, ${resolved.y.toFixed(2)})`,
      `Re-capture this office in coordinate-capture tool`
    );
  }
}

// 5. Verify all svgPathIds exist and are unique (normalized)
if (config.regions) {
  const normalizeId = (id: string) => id.trim().toLowerCase();

  config.regions.forEach(({ id, svgPathId }: { id: string; svgPathId: string }) => {
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
console.log(`   Version: ${config.configVersion}`);
console.log(`   Hash: ${actualHash.slice(0, 16)}...`);
console.log(`   ViewBox: ${viewBoxAttr}`);
console.log(`   Coordinates: ${config.coordinates.length} offices`);

if (strictMode) {
  console.log('   Mode: STRICT (production release)');
}
