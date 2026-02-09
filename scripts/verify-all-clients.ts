import * as fs from 'fs';
import * as path from 'path';

/**
 * Multi-Client Production Verification
 *
 * Validates ALL client configs in the config directory.
 * Fails if ANY client has missing coordinates or SVG ID issues.
 */

const configDir = 'config';
const scripts = {
  svgIds: 'npx tsx scripts/verify-svg-ids.ts',
  mapStrict: 'npx tsx scripts/verify-map-integrity.ts --strict --client=',
};

console.log('🔍 Discovering client configs...\n');

// Find all *-map-config.json files
const configFiles = fs
  .readdirSync(configDir)
  .filter((file) => file.endsWith('-map-config.json'))
  .map((file) => ({
    file,
    path: path.join(configDir, file),
    clientId: file.replace('-map-config.json', ''),
  }));

if (configFiles.length === 0) {
  console.error('❌ No client configs found in', configDir);
  process.exit(1);
}

console.log(`Found ${configFiles.length} client config(s):\n`);
configFiles.forEach(({ clientId, file }) => {
  console.log(`  - ${clientId} (${file})`);
});

console.log('\n' + '='.repeat(60) + '\n');

let hasErrors = false;
const clientResults = new Map<string, boolean>();

// Verify each client
for (const { clientId, file: _file } of configFiles) {
  console.log(`\n📦 Verifying client: ${clientId}`);
  console.log('-'.repeat(60));

  let clientPassed = true;

  try {
    // 1. Verify SVG IDs
    console.log('\n1️⃣  Checking SVG ID contract...');
    const svgResult = await runScript(`${scripts.svgIds} --client=${clientId}`);
    if (!svgResult.success) {
      console.error(`\n❌ ${clientId}: SVG ID verification failed`);
      clientPassed = false;
    }

    // 2. Verify map integrity (strict mode)
    console.log('\n2️⃣  Checking map integrity (strict)...');
    const mapResult = await runScript(`${scripts.mapStrict}${clientId}`);
    if (!mapResult.success) {
      console.error(`\n❌ ${clientId}: Map integrity verification failed`);
      clientPassed = false;
    }

    if (clientPassed) {
      console.log(`\n✅ ${clientId}: All checks passed`);
    }
  } catch (err) {
    console.error(`\n❌ ${clientId}: Verification error:`, err.message);
    clientPassed = false;
  }

  clientResults.set(clientId, clientPassed);
  if (!clientPassed) hasErrors = true;

  console.log('\n' + '='.repeat(60));
}

// Summary
console.log('\n📊 Verification Summary:\n');
configFiles.forEach(({ clientId }) => {
  const passed = clientResults.get(clientId) ?? false;
  const symbol = passed ? '✅' : '❌';
  console.log(`  ${symbol} ${clientId}`);
});

if (hasErrors) {
  console.error('\n❌ Multi-client verification FAILED');
  console.error('   → Fix all client configs before releasing\n');
  process.exit(1);
}

console.log('\n✅ All clients verified successfully\n');

// Helper to run script and capture result
async function runScript(command: string): Promise<{ success: boolean; output: string }> {
  const { execSync } = await import('child_process');

  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (err) {
    // Script failed (non-zero exit)
    return { success: false, output: err.stdout || err.message };
  }
}
