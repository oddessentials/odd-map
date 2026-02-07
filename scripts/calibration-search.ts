/**
 * Automated Projection Calibration Search
 *
 * Finds optimal d3.geoAlbersUsa() parameters by testing containment
 * of known cities within their expected state boundaries.
 *
 * Run: npx tsx scripts/calibration-search.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { geoAlbersUsa, geoPath, geoContains, GeoProjection } from 'd3-geo';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

interface StateProperties {
  name: string;
}

interface TestCity {
  name: string;
  lon: number;
  lat: number;
  expectedState: string;
}

const testCities: TestCity[] = [
  { name: 'Canonsburg, PA', lon: -80.1631, lat: 40.2628, expectedState: 'Pennsylvania' },
  { name: 'Boston, MA', lon: -71.064, lat: 42.3554, expectedState: 'Massachusetts' },
  { name: 'Philadelphia, PA', lon: -75.1645, lat: 39.9512, expectedState: 'Pennsylvania' },
  { name: 'New York, NY', lon: -74.006, lat: 40.7128, expectedState: 'New York' },
  { name: 'Los Angeles, CA', lon: -118.2437, lat: 34.0522, expectedState: 'California' },
  { name: 'Chicago, IL', lon: -87.6298, lat: 41.8781, expectedState: 'Illinois' },
  { name: 'Houston, TX', lon: -95.3698, lat: 29.7604, expectedState: 'Texas' },
  { name: 'Seattle, WA', lon: -122.3321, lat: 47.6062, expectedState: 'Washington' },
  { name: 'Miami, FL', lon: -80.1918, lat: 25.7617, expectedState: 'Florida' },
];

function loadTopoJson() {
  const filePath = path.join(process.cwd(), 'data', 'us-states-topo.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Topology<{
    states: GeometryCollection<StateProperties>;
  }>;
  return topojson.feature(data, data.objects.states);
}

function getContainmentScore(
  projection: GeoProjection,
  features: GeoJSON.FeatureCollection<GeoJSON.Geometry, StateProperties>
): { score: number; details: string[] } {
  const _pathGenerator = geoPath().projection(projection);
  let score = 0;
  const details: string[] = [];

  for (const city of testCities) {
    const expectedFeature = features.features.find((f) => f.properties.name === city.expectedState);
    if (!expectedFeature) {
      details.push(`❌ ${city.name}: State "${city.expectedState}" not found in data`);
      continue;
    }

    // Check if the point projects inside the state boundary
    const projected = projection([city.lon, city.lat]);
    if (!projected) {
      details.push(`❌ ${city.name}: Point not projectable (outside projection bounds)`);
      continue;
    }

    // Use geoContains to check if geographic point is inside the state polygon
    const isInside = geoContains(expectedFeature, [city.lon, city.lat]);
    if (isInside) {
      score++;
      details.push(`✅ ${city.name}: Correctly inside ${city.expectedState}`);
    } else {
      details.push(
        `❌ ${city.name}: NOT inside ${city.expectedState} (projected to ${projected[0].toFixed(1)}, ${projected[1].toFixed(1)})`
      );
    }
  }

  return { score, details };
}

function runSearch() {
  console.log('🔍 Loading TopoJSON data...');
  const geoData = loadTopoJson();
  console.log(`✅ Loaded ${geoData.features.length} state features\n`);

  // First, test current values
  console.log('📍 Testing CURRENT values (scale=1300, x=480, y=300):');
  const currentProjection = geoAlbersUsa().scale(1300).translate([480, 300]);
  const currentResult = getContainmentScore(currentProjection, geoData);
  currentResult.details.forEach((d) => console.log(`   ${d}`));
  console.log(`   Score: ${currentResult.score}/${testCities.length}\n`);

  // Grid search
  console.log('🔎 Running coarse grid search...');
  let best = { score: -1, scale: 0, x: 0, y: 0 };

  for (let scale = 1000; scale <= 1600; scale += 50) {
    for (let x = 400; x <= 600; x += 20) {
      for (let y = 200; y <= 400; y += 20) {
        const projection = geoAlbersUsa().scale(scale).translate([x, y]);
        const { score } = getContainmentScore(projection, geoData);
        if (score > best.score) {
          best = { score, scale, x, y };
        }
      }
    }
  }

  console.log(
    `   Coarse best: scale=${best.scale}, x=${best.x}, y=${best.y}, score=${best.score}\n`
  );

  // Refine search
  console.log('🎯 Refining search around best values...');
  const refined = { ...best };

  for (let scale = best.scale - 60; scale <= best.scale + 60; scale += 5) {
    for (let x = best.x - 30; x <= best.x + 30; x += 5) {
      for (let y = best.y - 30; y <= best.y + 30; y += 5) {
        const projection = geoAlbersUsa().scale(scale).translate([x, y]);
        const { score } = getContainmentScore(projection, geoData);
        if (score > refined.score) {
          refined.score = score;
          refined.scale = scale;
          refined.x = x;
          refined.y = y;
        }
      }
    }
  }

  console.log(`\n✨ BEST CALIBRATION FOUND:`);
  console.log(`   Scale: ${refined.scale}`);
  console.log(`   Translate X: ${refined.x}`);
  console.log(`   Translate Y: ${refined.y}`);
  console.log(`   Containment Score: ${refined.score}/${testCities.length}\n`);

  // Show details for best projection
  const bestProjection = geoAlbersUsa().scale(refined.scale).translate([refined.x, refined.y]);
  const bestResult = getContainmentScore(bestProjection, geoData);
  console.log('📋 Details for best projection:');
  bestResult.details.forEach((d) => console.log(`   ${d}`));

  // Generate code snippet
  console.log('\n📋 D3.js Code Snippet:');
  console.log(`d3.geoAlbersUsa()
    .scale(${refined.scale})
    .translate([${refined.x}, ${refined.y}])`);

  return refined;
}

runSearch();
