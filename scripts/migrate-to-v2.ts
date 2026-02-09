/**
 * V1 → V2 Config Migration Script
 *
 * Converts v1 map config files to v2 format with runtime projection support.
 * Handles both calibrated configs (with projection params) and hand-placed configs.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-v2.ts <config-path> [options]
 *
 * Options:
 *   --verify              Dry run — print diff report without writing (default)
 *   --apply               Write the v2 config to disk (overwrites input file)
 *   --output <path>       Write v2 config to a different file
 *   --infer-projection    Compute best-fit projection params via least-squares
 *   --override-threshold  Max projection drift (px) before tagging as svgOverride (default: 2)
 */

import * as fs from 'fs';
import * as path from 'path';
import { geoAlbersUsa } from 'd3-geo';
import { parse } from 'node-html-parser';
import { MapConfigV1Schema, MapConfigV2Schema } from '../src/lib/map-config.schema.js';

// --- Types ---

interface V1Coordinate {
  officeCode: string;
  lat: number;
  lon: number;
  svgX: number;
  svgY: number;
}

interface MigrationRow {
  officeCode: string;
  v1SvgX: number;
  v1SvgY: number;
  v2ProjX: number;
  v2ProjY: number;
  delta: number;
  action: 'projected' | 'svgOverride';
}

interface ProjectionFitResult {
  scale: number;
  translate: [number, number];
  totalError: number;
}

// --- Default projection parameters ---

const DEFAULT_SCALE = 1276;
const DEFAULT_TRANSLATE: [number, number] = [479, 299];

// --- CLI Argument Parsing ---

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const configPath = args.find((a) => !a.startsWith('--'));
  const apply = args.includes('--apply');
  const inferProjection = args.includes('--infer-projection');

  let outputPath: string | undefined;
  const outputIdx = args.indexOf('--output');
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputPath = args[outputIdx + 1];
  }

  let overrideThreshold = 2;
  const thresholdIdx = args.indexOf('--override-threshold');
  if (thresholdIdx !== -1 && args[thresholdIdx + 1]) {
    overrideThreshold = parseFloat(args[thresholdIdx + 1]);
  }

  return { configPath, apply, outputPath, inferProjection, overrideThreshold };
}

// --- Projection helpers ---

function projectCoord(
  lat: number,
  lon: number,
  scale: number,
  translate: [number, number]
): { x: number; y: number } | null {
  const projection = geoAlbersUsa().scale(scale).translate(translate);
  const result = projection([lon, lat]);
  return result ? { x: result[0], y: result[1] } : null;
}

function computeDelta(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// --- Least-squares projection fitting ---

function computeError(coordinates: V1Coordinate[], scale: number, tx: number, ty: number): number {
  const projection = geoAlbersUsa().scale(scale).translate([tx, ty]);
  let totalError = 0;
  for (const coord of coordinates) {
    const result = projection([coord.lon, coord.lat]);
    if (!result) {
      totalError += 1e6;
      continue;
    }
    totalError += (result[0] - coord.svgX) ** 2 + (result[1] - coord.svgY) ** 2;
  }
  return totalError;
}

function inferProjectionParams(coordinates: V1Coordinate[]): ProjectionFitResult {
  let bestScale = DEFAULT_SCALE;
  let bestTx = DEFAULT_TRANSLATE[0];
  let bestTy = DEFAULT_TRANSLATE[1];
  let bestError = Infinity;

  // Coarse search (step 5)
  for (let scale = 1200; scale <= 1400; scale += 5) {
    for (let tx = 450; tx <= 510; tx += 5) {
      for (let ty = 270; ty <= 330; ty += 5) {
        const totalError = computeError(coordinates, scale, tx, ty);
        if (totalError < bestError) {
          bestError = totalError;
          bestScale = scale;
          bestTx = tx;
          bestTy = ty;
        }
      }
    }
  }

  // Medium refinement (step 1)
  const coarseScale = bestScale;
  const coarseTx = bestTx;
  const coarseTy = bestTy;

  for (let scale = coarseScale - 5; scale <= coarseScale + 5; scale += 1) {
    for (let tx = coarseTx - 5; tx <= coarseTx + 5; tx += 1) {
      for (let ty = coarseTy - 5; ty <= coarseTy + 5; ty += 1) {
        const totalError = computeError(coordinates, scale, tx, ty);
        if (totalError < bestError) {
          bestError = totalError;
          bestScale = scale;
          bestTx = tx;
          bestTy = ty;
        }
      }
    }
  }

  // Fine refinement (step 0.1)
  const medScale = bestScale;
  const medTx = bestTx;
  const medTy = bestTy;

  for (let scale = medScale - 1; scale <= medScale + 1; scale += 0.1) {
    for (let tx = medTx - 1; tx <= medTx + 1; tx += 0.1) {
      for (let ty = medTy - 1; ty <= medTy + 1; ty += 0.1) {
        const totalError = computeError(coordinates, scale, tx, ty);
        if (totalError < bestError) {
          bestError = totalError;
          bestScale = Math.round(scale * 10) / 10;
          bestTx = Math.round(tx * 10) / 10;
          bestTy = Math.round(ty * 10) / 10;
        }
      }
    }
  }

  return {
    scale: bestScale,
    translate: [bestTx, bestTy],
    totalError: bestError,
  };
}

// --- SVG ID validation ---

function validateSvgPathIds(
  regions: Array<{ id: string; name: string; svgPathId: string }> | undefined,
  configPath: string
): void {
  if (!regions || regions.length === 0) return;

  const svgPath = path.join(process.cwd(), 'src', 'assets', 'usa-regions.svg');
  if (!fs.existsSync(svgPath)) {
    console.warn(`\n⚠️  SVG file not found: ${svgPath} — skipping svgPathId validation`);
    return;
  }

  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const root = parse(svgContent);
  const allIds = new Set<string>();
  root.querySelectorAll('[id]').forEach((el) => {
    const id = el.getAttribute('id');
    if (id) allIds.add(id);
  });

  const mismatches: string[] = [];
  for (const region of regions) {
    if (!allIds.has(region.svgPathId)) {
      mismatches.push(region.svgPathId);
    }
  }

  if (mismatches.length > 0) {
    console.warn(`\n⚠️  svgPathId mismatches in ${path.basename(configPath)} (FR-010 warning):`);
    for (const id of mismatches) {
      console.warn(`   - "${id}" not found in SVG`);
    }
    console.warn('   Migration continues — these are warnings, not errors.\n');
  }
}

// --- Migration logic ---

function migrate(argv: string[]): number {
  const { configPath, apply, outputPath, inferProjection, overrideThreshold } = parseArgs(argv);

  if (!configPath) {
    console.error(
      'Usage: npx tsx scripts/migrate-to-v2.ts <config-path> [--verify|--apply] [--output <path>] [--infer-projection] [--override-threshold <px>]'
    );
    return 1;
  }

  const resolvedPath = path.resolve(configPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Config file not found: ${resolvedPath}`);
    return 1;
  }

  // Read and parse v1 config
  const rawJson = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));

  // Check if already v2
  if (rawJson.configVersion === 2) {
    console.log('Config is already v2 — no migration needed.');
    return 0;
  }

  const v1Result = MapConfigV1Schema.safeParse(rawJson);
  if (!v1Result.success) {
    console.error('Validation error — input is not valid v1:');
    console.error(v1Result.error.format());
    return 1;
  }

  const v1Config = v1Result.data;
  const configName = path.basename(resolvedPath);
  const hasProjection = !!rawJson.projection;

  // Determine projection params
  let scale: number;
  let translate: [number, number];
  let configType: string;

  if (hasProjection && v1Config.projection) {
    scale = v1Config.projection.scale;
    translate = v1Config.projection.translate;
    configType = 'calibrated (has projection field)';
  } else if (inferProjection) {
    const fit = inferProjectionParams(v1Config.coordinates as V1Coordinate[]);
    scale = fit.scale;
    translate = fit.translate;
    configType = `hand-placed (projection inferred via least-squares: scale=${fit.scale}, translate=[${fit.translate}])`;
  } else {
    scale = DEFAULT_SCALE;
    translate = DEFAULT_TRANSLATE;
    configType =
      'hand-placed (no projection field, using default params — all offices get svgOverride)';
  }

  // Build migration rows
  const rows: MigrationRow[] = [];
  let maxDelta = 0;
  let overrideCount = 0;
  let exitCode = 0;

  for (const coord of v1Config.coordinates) {
    const projected = projectCoord(coord.lat, coord.lon, scale, translate);
    const projX = projected ? projected.x : 0;
    const projY = projected ? projected.y : 0;
    const delta = projected ? computeDelta(coord.svgX, coord.svgY, projX, projY) : Infinity;

    // For hand-placed without --infer-projection, all get svgOverride
    const forceOverride = !hasProjection && !inferProjection;
    const useOverride = forceOverride || !projected || delta > overrideThreshold;

    if (useOverride) overrideCount++;
    if (delta > maxDelta) maxDelta = delta;

    rows.push({
      officeCode: coord.officeCode,
      v1SvgX: coord.svgX,
      v1SvgY: coord.svgY,
      v2ProjX: parseFloat(projX.toFixed(2)),
      v2ProjY: parseFloat(projY.toFixed(2)),
      delta: parseFloat(delta.toFixed(2)),
      action: useOverride ? 'svgOverride' : 'projected',
    });
  }

  // Detect stale calibration (EC-05)
  if (hasProjection && maxDelta > 1) {
    console.warn(
      `\n⚠️  Stale calibration detected (EC-05): max drift is ${maxDelta.toFixed(2)}px (>1px threshold)`
    );
    exitCode = 2;
  }

  // Print diff report
  console.log(`\n=== Migration Report: ${configName} ===`);
  console.log(`Config type: ${configType}`);
  console.log(`Projection params: scale=${scale}, translate=[${translate}]`);
  console.log(`Override threshold: ${overrideThreshold}px`);
  console.log('');

  // Table header
  const header =
    'Office'.padEnd(16) +
    '| v1 svgX  ' +
    '| v1 svgY  ' +
    '| v2 projX ' +
    '| v2 projY ' +
    '| Delta  ' +
    '| Action';
  console.log(header);
  console.log('-'.repeat(header.length));

  for (const row of rows) {
    console.log(
      row.officeCode.padEnd(16) +
        `| ${row.v1SvgX.toFixed(2).padStart(8)} ` +
        `| ${row.v1SvgY.toFixed(2).padStart(8)} ` +
        `| ${row.v2ProjX.toFixed(2).padStart(8)} ` +
        `| ${row.v2ProjY.toFixed(2).padStart(8)} ` +
        `| ${row.delta.toFixed(2).padStart(5)}px ` +
        `| ${row.action}`
    );
  }

  const totalCoords = v1Config.coordinates.length;
  const projectedCount = totalCoords - overrideCount;
  console.log('');
  console.log(
    `Summary: ${overrideCount}/${totalCoords} offices use svgOverride, ${projectedCount}/${totalCoords} use projection`
  );
  console.log(
    `Max drift: ${maxDelta.toFixed(2)}px${rows.length > 0 ? ` (${rows.reduce((max, r) => (r.delta > max.delta ? r : max), rows[0]).officeCode})` : ''}`
  );

  // Validate svgPathIds
  if (v1Config.regions) {
    validateSvgPathIds(
      v1Config.regions.map((r) => ({
        id: r.id,
        name: r.name,
        svgPathId:
          rawJson.regions?.find(
            (raw: { id: string }) => raw.id.trim().toLowerCase() === r.id.toLowerCase()
          )?.svgPathId ?? r.svgPathId,
      })),
      resolvedPath
    );
  }

  // Build v2 config
  const v2Coordinates = v1Config.coordinates.map((coord) => {
    const row = rows.find((r) => r.officeCode === coord.officeCode)!;
    const base: {
      officeCode: string;
      lat: number;
      lon: number;
      svgOverride?: { x: number; y: number };
    } = {
      officeCode: coord.officeCode,
      lat: coord.lat,
      lon: coord.lon,
    };
    if (row.action === 'svgOverride') {
      base.svgOverride = { x: coord.svgX, y: coord.svgY };
    }
    return base;
  });

  // Use raw regions to preserve original svgPathId strings (before normalization)
  const v2Config = {
    configVersion: 2 as const,
    mapId: v1Config.mapId,
    clientId: v1Config.clientId,
    mapAssetHash: v1Config.mapAssetHash,
    viewBox: v1Config.viewBox,
    projection: { type: 'geoAlbersUsa' as const, scale, translate },
    coordinates: v2Coordinates,
    ...(rawJson.pinAsset ? { pinAsset: rawJson.pinAsset } : {}),
    ...(rawJson.regions ? { regions: rawJson.regions } : {}),
  };

  // Validate v2 output
  const v2Result = MapConfigV2Schema.safeParse(v2Config);
  if (!v2Result.success) {
    console.error('\nGenerated v2 config failed validation:');
    console.error(v2Result.error.format());
    return 1;
  }

  // Write or report
  if (apply || outputPath) {
    const writePath = outputPath ? path.resolve(outputPath) : resolvedPath;
    fs.writeFileSync(writePath, JSON.stringify(v2Config, null, 2) + '\n', 'utf-8');
    console.log(`\n✅ V2 config written to: ${writePath}`);
  } else {
    console.log('\n[Verify mode] No files written. Use --apply or --output <path> to write.');
  }

  return exitCode;
}

// --- Main ---

const exitCode = migrate(process.argv);
process.exit(exitCode);
