/**
 * Generate USA SVG map from us-atlas TopoJSON using D3 Geo
 * Properly projects coordinates into SVG viewport
 */

import { feature } from 'topojson-client';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load the us-atlas data
const us = require('us-atlas/states-10m.json');

// USG Region mappings (state FIPS codes)
const REGIONS = {
  'Northeast Region': ['42', '36', '34', '09', '44', '25', '50', '33', '23', '10', '24'], // PA, NY, NJ, CT, RI, MA, VT, NH, ME, DE, MD
  'Southeast Region': ['12', '13', '22', '01', '45'], // FL, GA, LA, AL, SC
  'South Region': ['48', '40'], // TX, OK
  'Southern California': ['06'], // CA
  'West Region': ['16', '53', '41', '30', '56', '32', '49', '08', '04', '35'], // ID, WA, OR, MT, WY, NV, UT, CO, AZ, NM
  'Midwest Region': ['27', '26', '17', '55', '19', '29', '20', '31', '46', '38', '18', '39'], // MN, MI, IL, WI, IA, MO, KS, NE, SD, ND, IN, OH
};

// State FIPS to abbreviation
const FIPS_TO_ABBR = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  10: 'DE',
  11: 'DC',
  12: 'FL',
  13: 'GA',
  15: 'HI',
  16: 'ID',
  17: 'IL',
  18: 'IN',
  19: 'IA',
  20: 'KS',
  21: 'KY',
  22: 'LA',
  23: 'ME',
  24: 'MD',
  25: 'MA',
  26: 'MI',
  27: 'MN',
  28: 'MS',
  29: 'MO',
  30: 'MT',
  31: 'NE',
  32: 'NV',
  33: 'NH',
  34: 'NJ',
  35: 'NM',
  36: 'NY',
  37: 'NC',
  38: 'ND',
  39: 'OH',
  40: 'OK',
  41: 'OR',
  42: 'PA',
  44: 'RI',
  45: 'SC',
  46: 'SD',
  47: 'TN',
  48: 'TX',
  49: 'UT',
  50: 'VT',
  51: 'VA',
  53: 'WA',
  54: 'WV',
  55: 'WI',
  56: 'WY',
  72: 'PR',
};

// Create state to region lookup
const stateToRegion = {};
for (const [region, states] of Object.entries(REGIONS)) {
  for (const fips of states) {
    stateToRegion[fips] = region;
  }
}

// Set up projection and path generator
const width = 960;
const height = 600;
const projection = geoAlbersUsa()
  .scale(1280)
  .translate([width / 2, height / 2]);
const pathGenerator = geoPath(projection);

// Convert TopoJSON to GeoJSON features
const states = feature(us, us.objects.states);

// Group states by region
const regionStates = {};
for (const region of Object.keys(REGIONS)) {
  regionStates[region] = [];
}
const inactiveStates = [];

for (const state of states.features) {
  const fips = state.id;
  const abbr = FIPS_TO_ABBR[fips] || fips;
  const pathD = pathGenerator(state);

  if (!pathD) continue;

  const region = stateToRegion[fips];
  if (region) {
    regionStates[region].push({ abbr, path: pathD });
  } else {
    inactiveStates.push({ abbr, path: pathD });
  }
}

// Generate SVG
const svgParts = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="USG Insurance Locations Map">`,
  '  <title>USG Insurance Regions</title>',
  '  <defs>',
  '    <style>',
  '      .state { fill: #d3d3d3; stroke: #fff; stroke-width: 0.5; cursor: pointer; transition: fill 0.2s; }',
  '      .state:hover { fill: #b0b0b0; }',
  '      [data-region="Northeast Region"] .state { fill: #1a5276; }',
  '      [data-region="Northeast Region"]:hover .state { fill: #2980b9; }',
  '      [data-region="Southeast Region"] .state { fill: #196f3d; }',
  '      [data-region="Southeast Region"]:hover .state { fill: #27ae60; }',
  '      [data-region="South Region"] .state { fill: #b9770e; }',
  '      [data-region="South Region"]:hover .state { fill: #f39c12; }',
  '      [data-region="Southern California"] .state { fill: #7d3c98; }',
  '      [data-region="Southern California"]:hover .state { fill: #9b59b6; }',
  '      [data-region="West Region"] .state { fill: #2874a6; }',
  '      [data-region="West Region"]:hover .state { fill: #3498db; }',
  '      [data-region="Midwest Region"] .state { fill: #a04000; }',
  '      [data-region="Midwest Region"]:hover .state { fill: #e67e22; }',
  '      .inactive .state { fill: #e8e8e8; cursor: default; }',
  '      .inactive .state:hover { fill: #ddd; }',
  '      .marker { fill: #fff; stroke: #003366; stroke-width: 2; cursor: pointer; }',
  '      .marker:hover { fill: #ffd700; }',
  '    </style>',
  '  </defs>',
  '',
];

// Add region groups
for (const [region, states] of Object.entries(regionStates)) {
  if (!states.length) continue;
  const regionId = region.toLowerCase().replace(/\s+/g, '-');
  svgParts.push(
    `  <g id="region-${regionId}" data-region="${region}" role="button" tabindex="0" aria-label="${region} - Click to view offices">`
  );
  for (const { abbr, path } of states) {
    svgParts.push(`    <path id="${abbr}" class="state" d="${path}"/>`);
  }
  svgParts.push('  </g>');
  svgParts.push('');
}

// Add inactive states
if (inactiveStates.length) {
  svgParts.push('  <g id="inactive-states" class="inactive">');
  for (const { abbr, path } of inactiveStates) {
    svgParts.push(`    <path id="${abbr}" class="state" d="${path}"/>`);
  }
  svgParts.push('  </g>');
  svgParts.push('');
}

// Add markers placeholder
svgParts.push('  <g id="markers" class="markers"></g>');
svgParts.push('</svg>');

// Write output
const output = svgParts.join('\n');
writeFileSync('src/assets/usa-regions.svg', output);

console.log('Generated SVG: src/assets/usa-regions.svg');
console.log(`Regions: ${Object.keys(regionStates).length}`);
console.log(`States in regions: ${Object.values(regionStates).reduce((a, b) => a + b.length, 0)}`);
console.log(`Inactive states: ${inactiveStates.length}`);
