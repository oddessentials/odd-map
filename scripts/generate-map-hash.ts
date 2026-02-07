import * as crypto from 'crypto';
import * as fs from 'fs';
import config from '../config/usg-map-config.json';

const svgPath = `src/assets/${config.mapId}.svg`;
const svgContent = fs.readFileSync(svgPath, 'utf8');
const hash = crypto.createHash('sha256').update(svgContent).digest('hex');

console.log('Generated hash for', svgPath);
console.log(hash);
console.log('\nUpdate config.mapAssetHash with this value.');
