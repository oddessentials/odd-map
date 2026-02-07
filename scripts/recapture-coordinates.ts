/**
 * Recapture Marker Coordinates
 *
 * This script finds the correct projection parameters that align D3's geoAlbersUsa
 * with our usa-regions.svg paths, then regenerates the coordinate config.
 *
 * Run: npx tsx scripts/recapture-coordinates.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { geoAlbersUsa } from 'd3-geo';
import { parse } from 'node-html-parser';

interface OfficeLocation {
  officeCode: string;
  city: string;
  state: string;
  lat: number;
  lon: number;
}

interface StateInfo {
  id: string;
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
}

// Load office locations from client config JSON
function loadOfficeLocations(): OfficeLocation[] {
  const configPath = path.join(process.cwd(), 'config', 'usg-client.json');
  const clientConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  return clientConfig.offices.map(
    (office: {
      officeCode: string;
      city: string;
      state: string;
      coordinates: { lat: number; lon: number };
    }) => ({
      officeCode: office.officeCode,
      city: office.city,
      state: office.state,
      lat: office.coordinates.lat,
      lon: office.coordinates.lon,
    })
  );
}

// Parse SVG to get state bounding boxes
function loadStateBboxes(): Map<string, StateInfo['bbox']> {
  const svgPath = path.join(process.cwd(), 'src', 'assets', 'usa-regions.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const root = parse(svgContent);

  const bboxes = new Map<string, StateInfo['bbox']>();
  const pathElements = root.querySelectorAll('path.state');

  for (const el of pathElements) {
    const id = el.getAttribute('id');
    const d = el.getAttribute('d');
    if (!id || !d) continue;

    // Extract bounding box from path coordinates
    const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) || [];
    if (nums.length < 2) continue;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      if (nums[i] < minX) minX = nums[i];
      if (nums[i] > maxX) maxX = nums[i];
      if (nums[i + 1] < minY) minY = nums[i + 1];
      if (nums[i + 1] > maxY) maxY = nums[i + 1];
    }

    bboxes.set(id, { minX, minY, maxX, maxY });
  }

  return bboxes;
}

// State abbreviation to centroid mapping (approximate)
const stateCentroids: Record<string, { lat: number; lon: number; name: string }> = {
  PA: { lat: 40.9, lon: -77.8, name: 'Pennsylvania' },
  MA: { lat: 42.3, lon: -71.8, name: 'Massachusetts' },
  FL: { lat: 28.6, lon: -82.5, name: 'Florida' },
  GA: { lat: 32.7, lon: -83.5, name: 'Georgia' },
  LA: { lat: 31.0, lon: -92.0, name: 'Louisiana' },
  TX: { lat: 31.5, lon: -99.4, name: 'Texas' },
  CA: { lat: 37.2, lon: -119.4, name: 'California' },
  ID: { lat: 44.0, lon: -114.7, name: 'Idaho' },
  MN: { lat: 46.3, lon: -94.3, name: 'Minnesota' },
  MI: { lat: 44.3, lon: -85.4, name: 'Michigan' },
  IL: { lat: 40.0, lon: -89.2, name: 'Illinois' },
};

function findBestProjection(bboxes: Map<string, StateInfo['bbox']>) {
  console.log('🔎 Searching for optimal projection parameters...\n');

  let bestError = Infinity;
  let bestParams = { scale: 0, x: 0, y: 0 };

  // Coarse search
  for (let scale = 1200; scale <= 1400; scale += 10) {
    for (let x = 460; x <= 520; x += 5) {
      for (let y = 280; y <= 320; y += 5) {
        const projection = geoAlbersUsa().scale(scale).translate([x, y]);
        let totalError = 0;
        let count = 0;

        for (const [stateAbbr, centroid] of Object.entries(stateCentroids)) {
          const bbox = bboxes.get(stateAbbr);
          if (!bbox) continue;

          const projected = projection([centroid.lon, centroid.lat]);
          if (!projected) continue;

          const svgCenterX = (bbox.minX + bbox.maxX) / 2;
          const svgCenterY = (bbox.minY + bbox.maxY) / 2;

          const dx = projected[0] - svgCenterX;
          const dy = projected[1] - svgCenterY;
          totalError += Math.sqrt(dx * dx + dy * dy);
          count++;
        }

        const avgError = totalError / count;
        if (avgError < bestError) {
          bestError = avgError;
          bestParams = { scale, x, y };
        }
      }
    }
  }

  // Fine-tune
  const { scale: cs, x: cx, y: cy } = bestParams;
  for (let scale = cs - 15; scale <= cs + 15; scale += 1) {
    for (let x = cx - 10; x <= cx + 10; x += 1) {
      for (let y = cy - 10; y <= cy + 10; y += 1) {
        const projection = geoAlbersUsa().scale(scale).translate([x, y]);
        let totalError = 0;
        let count = 0;

        for (const [stateAbbr, centroid] of Object.entries(stateCentroids)) {
          const bbox = bboxes.get(stateAbbr);
          if (!bbox) continue;

          const projected = projection([centroid.lon, centroid.lat]);
          if (!projected) continue;

          const svgCenterX = (bbox.minX + bbox.maxX) / 2;
          const svgCenterY = (bbox.minY + bbox.maxY) / 2;

          const dx = projected[0] - svgCenterX;
          const dy = projected[1] - svgCenterY;
          totalError += Math.sqrt(dx * dx + dy * dy);
          count++;
        }

        const avgError = totalError / count;
        if (avgError < bestError) {
          bestError = avgError;
          bestParams = { scale, x, y };
        }
      }
    }
  }

  console.log(`✨ Best Projection Found:`);
  console.log(`   Scale: ${bestParams.scale}`);
  console.log(`   Translate: [${bestParams.x}, ${bestParams.y}]`);
  console.log(`   Average Error: ${bestError.toFixed(1)} pixels\n`);

  return bestParams;
}

function generateCoordinates(
  offices: OfficeLocation[],
  projectionParams: { scale: number; x: number; y: number }
) {
  const projection = geoAlbersUsa()
    .scale(projectionParams.scale)
    .translate([projectionParams.x, projectionParams.y]);

  const coordinates = offices
    .map((office) => {
      const projected = projection([office.lon, office.lat]);
      if (!projected) {
        console.warn(`⚠️  ${office.officeCode}: Could not project (outside bounds)`);
        return null;
      }

      return {
        officeCode: office.officeCode,
        lat: office.lat,
        lon: office.lon,
        svgX: Math.round(projected[0] * 100) / 100,
        svgY: Math.round(projected[1] * 100) / 100,
      };
    })
    .filter(Boolean);

  return coordinates;
}

function updateConfig(
  coordinates: Array<{ officeCode: string; lat: number; lon: number; svgX: number; svgY: number }>,
  projectionParams: { scale: number; x: number; y: number }
) {
  const configPath = path.join(process.cwd(), 'config', 'usg-map-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Update coordinates
  config.coordinates = coordinates;

  // Add projection parameters for reference
  config.projection = {
    type: 'geoAlbersUsa',
    scale: projectionParams.scale,
    translate: [projectionParams.x, projectionParams.y],
  };

  // Write back
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  console.log(`✅ Updated ${configPath} with ${coordinates.length} coordinates\n`);
}

function main() {
  console.log('📍 Recapturing Marker Coordinates\n');
  console.log('─'.repeat(50));

  // Parse manual offset from command line (--offset-x=-10)
  let manualOffsetX = 0;
  const offsetArg = process.argv.find((arg) => arg.startsWith('--offset-x='));
  if (offsetArg) {
    manualOffsetX = parseFloat(offsetArg.split('=')[1]) || 0;
    console.log(`📐 Manual X offset: ${manualOffsetX} pixels\n`);
  }

  // Load data
  const offices = loadOfficeLocations();
  console.log(`📂 Loaded ${offices.length} office locations\n`);

  if (offices.length === 0) {
    console.error('❌ No offices found. Check config/usg-client.json.');
    process.exit(1);
  }

  // Get state bboxes from SVG
  const bboxes = loadStateBboxes();
  console.log(`📐 Loaded ${bboxes.size} state bounding boxes from SVG\n`);

  // Find best projection
  const projectionParams = findBestProjection(bboxes);

  // Apply manual offset
  if (manualOffsetX !== 0) {
    projectionParams.x += manualOffsetX;
    console.log(`🔧 Adjusted translateX to ${projectionParams.x} (offset: ${manualOffsetX})\n`);
  }

  // Generate new coordinates
  const coordinates = generateCoordinates(offices, projectionParams);
  console.log(`🗺️  Generated ${coordinates.length} coordinate mappings\n`);

  // Show comparison with old coordinates
  const configPath = path.join(process.cwd(), 'config', 'usg-map-config.json');
  const oldConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log('📊 Coordinate Changes:');
  console.log('─'.repeat(50));
  for (const newCoord of coordinates) {
    const oldCoord = oldConfig.coordinates.find(
      (c: { officeCode: string }) => c.officeCode === newCoord.officeCode
    );
    if (oldCoord) {
      const dx = newCoord.svgX - oldCoord.svgX;
      const dy = newCoord.svgY - oldCoord.svgY;
      const emoji =
        Math.abs(dx) > 20 || Math.abs(dy) > 20
          ? '🔴'
          : Math.abs(dx) > 5 || Math.abs(dy) > 5
            ? '🟡'
            : '🟢';
      console.log(
        `${emoji} ${newCoord.officeCode}: (${oldCoord.svgX}, ${oldCoord.svgY}) → (${newCoord.svgX}, ${newCoord.svgY}) [Δx: ${dx > 0 ? '+' : ''}${dx.toFixed(1)}, Δy: ${dy > 0 ? '+' : ''}${dy.toFixed(1)}]`
      );
    } else {
      console.log(`🆕 ${newCoord.officeCode}: NEW (${newCoord.svgX}, ${newCoord.svgY})`);
    }
  }

  // Ask for confirmation
  console.log('\n─'.repeat(50));
  console.log('Would you like to update the config? Run with --apply to update.\n');
  console.log('To shift pins west, use: --offset-x=-10 (negative = west)\n');

  if (process.argv.includes('--apply')) {
    updateConfig(coordinates, projectionParams);
    console.log('✅ Config updated. Run `npm run dev` and verify visually.');
  }
}

main();
