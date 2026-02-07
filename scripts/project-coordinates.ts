import { readFileSync, writeFileSync } from 'fs';

interface ClientOffice {
  officeCode: string;
  city: string;
  state: string;
  coordinates: { lat: number; lon: number };
}

/**
 * Project lat/lon to SVG coordinates
 * USA bounding box approximation with mercator-like projection
 */
function projectToSVG(lat: number, lon: number): { x: number; y: number } {
  // USA bounds (rough approximation)
  const MIN_LAT = 24.5;
  const MAX_LAT = 49.4;
  const MIN_LON = -125;
  const MAX_LON = -66;

  // SVG viewBox
  const viewBox = { x: 0, y: 0, width: 960, height: 600 };

  // Normalize to 0-1 range
  const normX = (lon - MIN_LON) / (MAX_LON - MIN_LON);
  const normY = (MAX_LAT - lat) / (MAX_LAT - MIN_LAT); // Flip Y

  // Apply to viewBox with padding
  const padding = 50;
  const x = padding + normX * (viewBox.width - 2 * padding);
  const y = padding + normY * (viewBox.height - 2 * padding);

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
  };
}

async function main() {
  // Read offices from client config JSON
  const clientConfig = JSON.parse(readFileSync('config/usg-client.json', 'utf8'));
  const offices: ClientOffice[] = clientConfig.offices;

  console.log(`📍 Projecting ${offices.length} offices to SVG coordinates...\n`);

  const coordinates = offices.map((office) => {
    const { lat, lon } = office.coordinates;
    const svgCoords = projectToSVG(lat, lon);

    console.log(`${office.officeCode}: (${lat}, ${lon}) → (${svgCoords.x}, ${svgCoords.y})`);

    return {
      officeCode: office.officeCode,
      lat,
      lon,
      svgX: svgCoords.x,
      svgY: svgCoords.y,
    };
  });

  // Read current config
  const configPath = 'config/usg-map-config.json';
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  // Update coordinates
  config.coordinates = coordinates;

  // Write back
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(`\n✅ Updated ${configPath} with ${coordinates.length} coordinates`);
  console.log('\n⚠️  Remember to run: npm run generate:map-hash');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
