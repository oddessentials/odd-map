import * as fs from 'fs';
import * as path from 'path';
import { ClientConfigSchema, formatValidationErrors } from '../src/lib/client-config.schema.js';
import { validateImportMap, validateProdImportMap } from '../src/lib/client-registry.js';
import type { ClientRegistry } from '../src/lib/client-registry.js';

/**
 * Config File Validation Script
 *
 * Validates all client configs (`*-client.json`) for:
 * - JSON parse-ability
 * - Zod schema compliance (ClientConfigSchema)
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
    schemaVersion: number;
    offices: number;
    registries: string[];
  };
}

const configDir = 'config';
const results: ValidationResult[] = [];

console.log('📋 Config File Validation\n');
console.log('='.repeat(60) + '\n');

// Find all client config files (exclude registry files)
const configFiles = fs
  .readdirSync(configDir)
  .filter((file) => file.endsWith('-client.json'))
  .sort();

if (configFiles.length === 0) {
  console.error('❌ No client config files found in', configDir);
  process.exit(1);
}

console.log(`Found ${configFiles.length} client config file(s):\n`);

// Load registries
const prodRegistry: ClientRegistry = JSON.parse(
  fs.readFileSync(path.join(configDir, 'clients.prod.json'), 'utf8')
);
const demoRegistry: ClientRegistry = JSON.parse(
  fs.readFileSync(path.join(configDir, 'clients.demo.json'), 'utf8')
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

    // 2. Extract expected clientId from filename
    const expectedClientId = file.replace('-client.json', '');

    // 3. Validate with Zod schema
    const parsed = ClientConfigSchema.safeParse(configRaw);
    if (!parsed.success) {
      result.status = 'failed';
      result.clientId = (configRaw.clientId as string) || expectedClientId;
      formatValidationErrors(parsed.error).forEach((msg) => result.errors.push(msg));
      results.push(result);
      return;
    }

    const validatedConfig = parsed.data;
    result.clientId = validatedConfig.clientId;

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
    if (demoRegistry.clients.includes(validatedConfig.clientId)) {
      registries.push('demo');
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
      schemaVersion: validatedConfig.schemaVersion,
      offices: validatedConfig.offices.length,
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

// Validate PRODUCTION import map coverage for every registry consumed by a
// production build: real production (clients.prod.json) and the GitHub Pages
// demo (clients.demo.json), which also builds in production mode. A client
// listed in either but missing from the PROD maps is selectable yet unloadable.
const prodCoverageErrors = [
  { name: 'production', registry: prodRegistry },
  { name: 'demo', registry: demoRegistry },
].flatMap(({ name, registry }) =>
  validateProdImportMap(registry).errors.map((err) => `[${name}] ${err}`)
);
if (prodCoverageErrors.length > 0) {
  console.error('❌ Production import map coverage failed:');
  prodCoverageErrors.forEach((err) => console.error(`   - ${err}`));
  console.error('');
}

// Print results
results.forEach((result) => {
  const symbol = result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';

  console.log(`${symbol} ${result.file}`);

  if (result.metadata) {
    console.log(
      `   Client: ${result.clientId}, Schema: v${result.metadata.schemaVersion}, Offices: ${result.metadata.offices}`
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

if (failedCount > 0 || !importMapValidation.valid || prodCoverageErrors.length > 0) {
  console.error('❌ Config validation FAILED');
  process.exit(1);
}

if (warningCount > 0) {
  console.warn('⚠️  Config validation passed with warnings');
  process.exit(0);
}

console.log('✅ All config files validated successfully');
process.exit(0);
