/**
 * Unit Tests - V1 → V2 Migration Script
 *
 * Tests the migration script by spawning child processes.
 * Validates output config against MapConfigV2Schema.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { MapConfigV2Schema } from '../src/lib/map-config.schema';

const ROOT = process.cwd();
const FIXTURE_DIR = path.join(ROOT, 'tests', 'fixtures');
const TMP_DIR = path.join(ROOT, 'tests', '.tmp-migration');

function runMigrate(
  args: string,
  timeout = 30000
): { stdout: string; stderr: string; exitCode: number } {
  // Normalize Windows backslash paths to forward slashes for shell compatibility
  const normalizedArgs = args.replace(/\\/g, '/');
  const result = spawnSync(`npx tsx scripts/migrate-to-v2.ts ${normalizedArgs}`, {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout,
    shell: true,
  });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 1,
  };
}

describe('Migration Script', () => {
  beforeEach(() => {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  });

  describe('calibrated config (USG)', () => {
    it('migrates with no svgOverride and all deltas <= 0.5px', () => {
      const outputPath = path.join(TMP_DIR, 'usg-v2.json');
      const { stdout, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-usg-fixture.json')} --output "${outputPath}"`
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('calibrated');
      expect(stdout).toContain('0/13 offices use svgOverride');

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(v2Config.configVersion).toBe(2);
      expect(v2Config.projection).toBeDefined();

      // No svgOverride on any coordinate
      for (const coord of v2Config.coordinates) {
        expect(coord.svgOverride).toBeUndefined();
      }

      // svgX/svgY removed
      for (const coord of v2Config.coordinates) {
        expect(coord.svgX).toBeUndefined();
        expect(coord.svgY).toBeUndefined();
      }
    });

    it('round-trips through MapConfigV2Schema', () => {
      const outputPath = path.join(TMP_DIR, 'usg-v2-roundtrip.json');
      runMigrate(`${path.join(FIXTURE_DIR, 'v1-usg-fixture.json')} --output "${outputPath}"`);

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      const result = MapConfigV2Schema.safeParse(v2Config);
      expect(result.success).toBe(true);
    });
  });

  describe('calibrated config with stale calibration (oddessentials)', () => {
    it('warns about stale calibration (EC-05) with exit code 2', () => {
      const outputPath = path.join(TMP_DIR, 'oe-v2.json');
      const { stderr, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-oddessentials-fixture.json')} --output "${outputPath}"`
      );

      expect(exitCode).toBe(2);
      expect(stderr).toContain('Stale calibration detected');

      // All offices should get svgOverride due to large drift
      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      for (const coord of v2Config.coordinates) {
        expect(coord.svgOverride).toBeDefined();
      }
    });
  });

  describe('hand-placed config without --infer-projection (ACME)', () => {
    it('tags all offices with svgOverride', () => {
      const outputPath = path.join(TMP_DIR, 'acme-v2.json');
      const { stdout, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-acme-fixture.json')} --output "${outputPath}"`
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('hand-placed');
      expect(stdout).toContain('3/3 offices use svgOverride');

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(v2Config.configVersion).toBe(2);

      for (const coord of v2Config.coordinates) {
        expect(coord.svgOverride).toBeDefined();
        expect(coord.svgOverride.x).toBeGreaterThan(0);
        expect(coord.svgOverride.y).toBeGreaterThan(0);
      }
    });

    it('round-trips through MapConfigV2Schema', () => {
      const outputPath = path.join(TMP_DIR, 'acme-v2-roundtrip.json');
      runMigrate(`${path.join(FIXTURE_DIR, 'v1-acme-fixture.json')} --output "${outputPath}"`);

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      const result = MapConfigV2Schema.safeParse(v2Config);
      expect(result.success).toBe(true);
    });
  });

  describe('verify mode (default)', () => {
    it('does NOT write a file', () => {
      // Copy v1 fixture to tmp so we can verify it stays v1
      const tmpFixture = path.join(TMP_DIR, 'usg-verify-test.json');
      fs.copyFileSync(path.join(FIXTURE_DIR, 'v1-usg-fixture.json'), tmpFixture);

      const { exitCode } = runMigrate(tmpFixture);
      expect(exitCode).toBe(0);

      // Verify the file is still v1 (not overwritten)
      const config = JSON.parse(fs.readFileSync(tmpFixture, 'utf-8'));
      expect(config.configVersion).toBe(1);
    });

    it('prints verify mode message', () => {
      const { stdout } = runMigrate(path.join(FIXTURE_DIR, 'v1-usg-fixture.json'));

      expect(stdout).toContain('Verify mode');
      expect(stdout).toContain('No files written');
    });
  });

  describe('svgPathId preservation', () => {
    it('preserves regions in v2 output', () => {
      const outputPath = path.join(TMP_DIR, 'usg-regions.json');
      runMigrate(`${path.join(FIXTURE_DIR, 'v1-usg-fixture.json')} --output "${outputPath}"`);

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(v2Config.regions).toBeDefined();
      expect(v2Config.regions.length).toBe(6);
      expect(v2Config.regions[0].svgPathId).toBe('region-usg-northeast-region');
    });
  });

  describe('svgPathId validation warnings', () => {
    it('warns about missing SVG IDs for ACME regions (FR-010)', () => {
      const { stderr, exitCode } = runMigrate(path.join(FIXTURE_DIR, 'v1-acme-fixture.json'));

      // Migration succeeds despite warnings
      expect(exitCode).toBe(0);
      expect(stderr).toContain('svgPathId mismatches');
      expect(stderr).toContain('region-acme-south-region');
    });
  });

  describe('exit codes', () => {
    it('returns 0 for successful migration', () => {
      const { exitCode } = runMigrate(path.join(FIXTURE_DIR, 'v1-usg-fixture.json'));
      expect(exitCode).toBe(0);
    });

    it('returns 1 for missing config file', () => {
      const { exitCode } = runMigrate('nonexistent-file.json');
      expect(exitCode).toBe(1);
    });

    it('returns 2 for stale calibration', () => {
      const { exitCode } = runMigrate(path.join(FIXTURE_DIR, 'v1-oddessentials-fixture.json'));
      expect(exitCode).toBe(2);
    });
  });

  describe('already v2 config', () => {
    it('skips migration for v2 configs', () => {
      // Copy an on-disk v2 config to tmp dir and verify it's detected as v2
      const v2Source = path.join(ROOT, 'config', 'usg-map-config.json');
      const tmpV2 = path.join(TMP_DIR, 'already-v2.json');
      fs.copyFileSync(v2Source, tmpV2);

      const { stdout, exitCode } = runMigrate(tmpV2);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('already v2');
    });

    it('skips migration for on-disk v2 configs', () => {
      // On-disk configs are now v2 post-migration
      const { stdout, exitCode } = runMigrate(path.join(ROOT, 'config', 'usg-map-config.json'));
      expect(exitCode).toBe(0);
      expect(stdout).toContain('already v2');
    });
  });

  describe('--infer-projection (T024)', () => {
    it('infers projection for ACME config', () => {
      const outputPath = path.join(TMP_DIR, 'acme-inferred.json');
      const { stdout, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-acme-fixture.json')} --infer-projection --output "${outputPath}"`,
        60000
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('inferred via least-squares');

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(v2Config.configVersion).toBe(2);
      expect(v2Config.projection).toBeDefined();
      expect(v2Config.projection.scale).toBeGreaterThan(1000);
      expect(v2Config.projection.translate).toHaveLength(2);

      // Round-trip validation
      const result = MapConfigV2Schema.safeParse(v2Config);
      expect(result.success).toBe(true);
    });

    it('infers projection for demo config', () => {
      const outputPath = path.join(TMP_DIR, 'demo-inferred.json');
      const { stdout, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-demo-fixture.json')} --infer-projection --output "${outputPath}"`,
        60000
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('inferred via least-squares');

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(v2Config.projection.scale).toBeGreaterThan(1000);

      const result = MapConfigV2Schema.safeParse(v2Config);
      expect(result.success).toBe(true);
    });

    it('--override-threshold controls svgOverride tagging', () => {
      const outputPath = path.join(TMP_DIR, 'acme-threshold.json');
      // Use a very high threshold so no offices get svgOverride
      const { stdout, exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-acme-fixture.json')} --infer-projection --override-threshold 1000 --output "${outputPath}"`,
        60000
      );

      expect(exitCode).toBe(0);

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      // With threshold=1000, no office should need svgOverride
      const overrideCount = v2Config.coordinates.filter(
        (c: { svgOverride?: unknown }) => c.svgOverride
      ).length;
      expect(overrideCount).toBe(0);
      expect(stdout).toContain('0/3 offices use svgOverride');
    });

    it('low --override-threshold tags more offices as svgOverride', () => {
      const outputPath = path.join(TMP_DIR, 'acme-low-threshold.json');
      // Use a very low threshold so all offices get svgOverride
      const { exitCode } = runMigrate(
        `${path.join(FIXTURE_DIR, 'v1-acme-fixture.json')} --infer-projection --override-threshold 0 --output "${outputPath}"`,
        60000
      );

      expect(exitCode).toBe(0);

      const v2Config = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      // With threshold=0, all offices should get svgOverride (any residual > 0)
      const overrideCount = v2Config.coordinates.filter(
        (c: { svgOverride?: unknown }) => c.svgOverride
      ).length;
      expect(overrideCount).toBe(3);
    });
  });
});
