import * as fs from 'fs';
import * as path from 'path';
import { MapConfigSchema } from '../src/lib/map-config.schema.js';
import { validateImportMap } from '../src/lib/client-registry.js';
import type { ClientRegistry } from '../src/lib/client-registry.js';

/**
 * Config File Validation Script
 *
 * Validates all client configs for:
 * - JSON parse-ability
 * - Zod schema compliance
 * - Filename → clientId consistency
 * - Registry membership
 * - Import map coverage
 */

interface ValidationResult {
  file: string;
  clientId: string | null;
  status: 'passed' | 'failed' | 'warning';
  errors: string[];
  warnings: string[];
  metadata?: {
    version: number;
    coordinates: number;
    registries: string[];
  };
}

const configDir = 'config';
const results: ValidationResult[] = [];

console.log('📋 Config File Validation\n');
console.log('='.repeat(60) + '\n');

// Find all map config files (exclude registry files)
const configFiles = fs
  .readdirSync(configDir)
  .filter((file) => file.endsWith('-map-config.json'))
  .sort();

if (configFiles.length === 0) {
  console.error('❌ No config files found in', configDir);
  process.exit(1);
}

console.log(`Found ${configFiles.length} config file(s):\n`);

// Load registries
const prodRegistry: ClientRegistry = JSON.parse(
  fs.readFileSync(path.join(configDir, 'clients.prod.json'), 'utf8')
);
const testRegistry: ClientRegistry = JSON.parse(
  fs.readFileSync(path.join(configDir, 'clients.test.json'), 'utf8')
);

// Validate each config file
configFiles.forEach((file) => {
  const filePath = path.join(configDir, file);
  const result: ValidationResult = {
    file,
    clientId: null,
    status: 'passed',
    errors: [],
    warnings: [],
  };

  try {
    // 1. Parse JSON
    let configRaw: Record<string, unknown>;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      configRaw = JSON.parse(content);
    } catch (err) {
      result.status = 'failed';
      result.errors.push(`JSON parse error: ${err.message}`);
      results.push(result);
      return;
    }

    // 2. Extract clientId from filename
    const expectedClientId = file.replace('-map-config.json', '');

    // 3. Validate with Zod schema
    let validatedConfig;
    try {
      validatedConfig = MapConfigSchema.parse(configRaw);
      result.clientId = validatedConfig.clientId;
    } catch (err) {
      result.status = 'failed';
      result.clientId = configRaw.clientId || expectedClientId;

      if (
        err &&
        typeof err === 'object' &&
        'errors' in err &&
        Array.isArray((err as { errors: unknown[] }).errors)
      ) {
        (err as { errors: Array<{ path: string[]; message: string }> }).errors.forEach((e) => {
          const path = e.path.join('.');
          result.errors.push(`Schema error at $.${path}: ${e.message}`);
        });
      } else {
        result.errors.push(`Schema validation failed: ${err.message}`);
      }
      results.push(result);
      return;
    }

    // 4. filename → clientId consistency
    if (validatedConfig.clientId !== expectedClientId) {
      result.status = 'failed';
      result.errors.push(
        `Client ID mismatch: filename says "${expectedClientId}", ` +
          `config declares "${validatedConfig.clientId}"`
      );
    }

    // 5. Check registry membership
    const registries: string[] = [];
    if (prodRegistry.clients.includes(validatedConfig.clientId)) {
      registries.push('production');
    }
    if (testRegistry.clients.includes(validatedConfig.clientId)) {
      registries.push('test');
    }

    if (registries.length === 0) {
      result.status = 'warning';
      result.warnings.push(`Client "${validatedConfig.clientId}" not found in any registry`);
    }

    // 6. Store metadata
    result.metadata = {
      version: validatedConfig.configVersion,
      coordinates: validatedConfig.coordinates.length,
      registries,
    };

    if (result.errors.length > 0) {
      result.status = 'failed';
    } else if (result.warnings.length > 0 && result.status === 'passed') {
      result.status = 'warning';
    }
  } catch (err) {
    result.status = 'failed';
    result.errors.push(`Unexpected error: ${err.message}`);
  }

  results.push(result);
});

// Validate import map coverage
console.log('Checking import map coverage...\n');
const importMapValidation = validateImportMap(testRegistry);
if (!importMapValidation.valid) {
  console.error('❌ Import map validation failed:');
  importMapValidation.errors.forEach((err) => console.error(`   - ${err}`));
  console.error('');
}

// Print results
results.forEach((result) => {
  const symbol = result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';

  console.log(`${symbol} ${result.file}`);

  if (result.metadata) {
    console.log(
      `   Client: ${result.clientId}, Version: ${result.metadata.version}, Coordinates: ${result.metadata.coordinates}`
    );
    if (result.metadata.registries.length > 0) {
      console.log(`   Registry: ${result.metadata.registries.join(', ')}`);
    }
  } else if (result.clientId) {
    console.log(`   Client: ${result.clientId}`);
  }

  result.errors.forEach((err) => {
    console.error(`   ERROR: ${err}`);
  });

  result.warnings.forEach((warn) => {
    console.warn(`   WARNING: ${warn}`);
  });

  console.log('');
});

// Summary
const passedCount = results.filter((r) => r.status === 'passed').length;
const warningCount = results.filter((r) => r.status === 'warning').length;
const failedCount = results.filter((r) => r.status === 'failed').length;

console.log('='.repeat(60));
console.log(`Summary: ${passedCount} passed, ${warningCount} warnings, ${failedCount} failed`);
console.log('='.repeat(60) + '\n');

if (failedCount > 0 || !importMapValidation.valid) {
  console.error('❌ Config validation FAILED');
  process.exit(1);
}

if (warningCount > 0) {
  console.warn('⚠️  Config validation passed with warnings');
  process.exit(0);
}

console.log('✅ All config files validated successfully');
process.exit(0);
