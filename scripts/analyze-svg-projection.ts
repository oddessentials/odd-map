/**
 * SVG Projection Analysis
 *
 * Compares D3 geoAlbersUsa projected coordinates with actual SVG path bounding boxes
 * to identify the scale/translate mismatch.
 *
 * Run: npx tsx scripts/analyze-svg-projection.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { geoAlbersUsa } from 'd3-geo';
import { parse } from 'node-html-parser';

interface StateInfo {
  id: string;
  pathD: string;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    centerX: number;
    centerY: number;
  };
}

// Known state centroids (approximate geographic centers)
const stateCentroids: Record<string, { lat: number; lon: number }> = {
  PA: { lat: 40.9, lon: -77.8 },
  MA: { lat: 42.3, lon: -71.8 },
  NY: { lat: 43.0, lon: -75.5 },
  CA: { lat: 37.2, lon: -119.4 },
  IL: { lat: 40.0, lon: -89.2 },
  TX: { lat: 31.5, lon: -99.4 },
  WA: { lat: 47.4, lon: -120.5 },
  FL: { lat: 28.6, lon: -82.5 },
  OH: { lat: 40.4, lon: -82.8 },
  GA: { lat: 32.7, lon: -83.5 },
  MI: { lat: 44.3, lon: -85.4 },
  MN: { lat: 46.3, lon: -94.3 },
};

function parseSvgPath(d: string): { minX: number; minY: number; maxX: number; maxY: number } {
  // Extract all numeric coordinates from path d attribute
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  if (nums.length < 2) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  // Rough bounding box from all numbers (pairs of x,y)
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return { minX, minY, maxX, maxY };
}

function loadSvgStates(): StateInfo[] {
  const svgPath = path.join(process.cwd(), 'src', 'assets', 'usa-regions.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const root = parse(svgContent);

  const states: StateInfo[] = [];
  const pathElements = root.querySelectorAll('path.state');

  for (const el of pathElements) {
    const id = el.getAttribute('id');
    const d = el.getAttribute('d');
    if (!id || !d) continue;

    const bounds = parseSvgPath(d);
    states.push({
      id,
      pathD: d,
      bounds: {
        ...bounds,
        centerX: (bounds.minX + bounds.maxX) / 2,
        centerY: (bounds.minY + bounds.maxY) / 2,
      },
    });
  }

  return states;
}

function analyzeProjection() {
  console.log('📊 SVG Projection Analysis\n');

  const states = loadSvgStates();
  console.log(`Loaded ${states.length} state paths from SVG\n`);

  // Test different projection parameters
  const testParams = [
    { scale: 1300, x: 480, y: 300, label: 'Current (calibration.html default)' },
    { scale: 1070, x: 480, y: 300, label: 'Standard AlbersUSA 960x600' },
    { scale: 1000, x: 490, y: 310, label: 'Slightly adjusted' },
  ];

  for (const params of testParams) {
    console.log(`\n🔍 Testing: ${params.label}`);
    console.log(`   scale=${params.scale}, translate=[${params.x}, ${params.y}]\n`);

    const projection = geoAlbersUsa().scale(params.scale).translate([params.x, params.y]);

    console.log('   State   | SVG Center     | D3 Projected   | Δx      | Δy');
    console.log('   --------|----------------|----------------|---------|--------');

    let totalError = 0;
    let count = 0;

    for (const stateId of Object.keys(stateCentroids)) {
      const state = states.find((s) => s.id === stateId);
      if (!state) continue;

      const centroid = stateCentroids[stateId];
      const projected = projection([centroid.lon, centroid.lat]);
      if (!projected) continue;

      const dx = projected[0] - state.bounds.centerX;
      const dy = projected[1] - state.bounds.centerY;
      const error = Math.sqrt(dx * dx + dy * dy);
      totalError += error;
      count++;

      console.log(
        `   ${stateId.padEnd(7)} | (${state.bounds.centerX.toFixed(1)}, ${state.bounds.centerY.toFixed(1)})`.padEnd(
          38
        ) +
          ` | (${projected[0].toFixed(1)}, ${projected[1].toFixed(1)})`.padEnd(17) +
          ` | ${dx > 0 ? '+' : ''}${dx.toFixed(1)}`.padEnd(8) +
          ` | ${dy > 0 ? '+' : ''}${dy.toFixed(1)}`
      );
    }

    console.log(`\n   Average error: ${(totalError / count).toFixed(1)} pixels`);
  }

  // Grid search for best fit
  console.log('\n\n🎯 Grid Search for Best Projection Parameters...');

  let bestError = Infinity;
  let bestParams = { scale: 0, x: 0, y: 0 };

  for (let scale = 900; scale <= 1500; scale += 10) {
    for (let x = 400; x <= 550; x += 5) {
      for (let y = 250; y <= 350; y += 5) {
        const projection = geoAlbersUsa().scale(scale).translate([x, y]);
        let totalError = 0;
        let count = 0;

        for (const stateId of Object.keys(stateCentroids)) {
          const state = states.find((s) => s.id === stateId);
          if (!state) continue;

          const centroid = stateCentroids[stateId];
          const projected = projection([centroid.lon, centroid.lat]);
          if (!projected) continue;

          const dx = projected[0] - state.bounds.centerX;
          const dy = projected[1] - state.bounds.centerY;
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

  console.log(`\n✨ BEST FIT FOUND:`);
  console.log(`   Scale: ${bestParams.scale}`);
  console.log(`   Translate X: ${bestParams.x}`);
  console.log(`   Translate Y: ${bestParams.y}`);
  console.log(`   Average Error: ${bestError.toFixed(1)} pixels`);

  // Show details for best fit
  console.log('\n📋 Details for best projection:');
  const bestProjection = geoAlbersUsa()
    .scale(bestParams.scale)
    .translate([bestParams.x, bestParams.y]);
  console.log('   State   | SVG Center     | D3 Projected   | Δx      | Δy');
  console.log('   --------|----------------|----------------|---------|--------');

  for (const stateId of Object.keys(stateCentroids)) {
    const state = states.find((s) => s.id === stateId);
    if (!state) continue;

    const centroid = stateCentroids[stateId];
    const projected = bestProjection([centroid.lon, centroid.lat]);
    if (!projected) continue;

    const dx = projected[0] - state.bounds.centerX;
    const dy = projected[1] - state.bounds.centerY;

    console.log(
      `   ${stateId.padEnd(7)} | (${state.bounds.centerX.toFixed(1)}, ${state.bounds.centerY.toFixed(1)})`.padEnd(
        38
      ) +
        ` | (${projected[0].toFixed(1)}, ${projected[1].toFixed(1)})`.padEnd(17) +
        ` | ${dx > 0 ? '+' : ''}${dx.toFixed(1)}`.padEnd(8) +
        ` | ${dy > 0 ? '+' : ''}${dy.toFixed(1)}`
    );
  }
}

analyzeProjection();
