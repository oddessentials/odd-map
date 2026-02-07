import * as fs from 'fs';
import * as path from 'path';

/**
 * Config Backup and Atomic Write Utilities
 *
 * Provides safe config file operations with:
 * - Automatic backups before writes
 * - Atomic writes (write to temp, rename)
 * - Backup rotation (keep last N backups)
 * - Validation before write
 */

const BACKUP_DIR = 'config/.backups';
const MAX_BACKUPS = 10;

/**
 * Ensure backup directory exists
 */
function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Create timestamped backup of config file
 *
 * @param configPath - Path to config file
 * @returns Path to backup file
 */
export function backupConfig(configPath: string): string {
  ensureBackupDir();

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const basename = path.basename(configPath, '.json');
  const backupName = `${basename}.${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  fs.copyFileSync(configPath, backupPath);
  console.log(`📦 Backup created: ${backupPath}`);

  // Rotate old backups
  rotateBackups(basename);

  return backupPath;
}

/**
 * Rotate backups, keeping only MAX_BACKUPS most recent
 */
function rotateBackups(basename: string): void {
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith(basename) && f.endsWith('.json'))
    .map((f) => ({
      name: f,
      path: path.join(BACKUP_DIR, f),
      mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  // Delete old backups
  const toDelete = backups.slice(MAX_BACKUPS);
  toDelete.forEach(({ path: backupPath, name }) => {
    fs.unlinkSync(backupPath);
    console.log(`🗑️  Deleted old backup: ${name}`);
  });
}

/**
 * Atomically write config file with backup
 *
 * @param configPath - Path to config file
 * @param content - Config content (object or string)
 * @param validate - Optional validation function
 */
export function safeWriteConfig(
  configPath: string,
  content: unknown,
  validate?: (content: unknown) => void
): void {
  // Validate before writing
  if (validate) {
    try {
      validate(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ Config validation failed:', message);
      throw new Error(`Config validation failed: ${message}`);
    }
  }

  // Serialize content
  const jsonContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  // Backup existing file
  if (fs.existsSync(configPath)) {
    backupConfig(configPath);
  }

  // Atomic write: write to temp, then rename
  const tempPath = `${configPath}.tmp`;

  try {
    // Write to temp file
    fs.writeFileSync(tempPath, jsonContent, 'utf8');

    // Verify temp file is valid JSON
    try {
      JSON.parse(fs.readFileSync(tempPath, 'utf8'));
    } catch (_err) {
      fs.unlinkSync(tempPath);
      throw new Error('Generated invalid JSON');
    }

    // Atomic rename (overwrites existing)
    fs.renameSync(tempPath, configPath);
    console.log(`✅ Config written safely: ${configPath}`);
  } catch (err) {
    // Cleanup temp file on error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw err;
  }
}

/**
 * Restore config from most recent backup
 *
 * @param configPath - Path to config file
 * @returns true if restored, false if no backups
 */
export function restoreConfig(configPath: string): boolean {
  ensureBackupDir();

  const basename = path.basename(configPath, '.json');
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith(basename) && f.endsWith('.json'))
    .map((f) => ({
      name: f,
      path: path.join(BACKUP_DIR, f),
      mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  if (backups.length === 0) {
    console.error('❌ No backups found');
    return false;
  }

  const latest = backups[0];
  console.log(`♻️  Restoring from: ${latest.name}`);

  fs.copyFileSync(latest.path, configPath);
  console.log(`✅ Config restored: ${configPath}`);

  return true;
}

/**
 * CLI for config backup/restore
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const configPath = args[1] || 'config/usg-map-config.json';

  try {
    if (command === 'backup') {
      backupConfig(configPath);
    } else if (command === 'restore') {
      restoreConfig(configPath);
    } else if (command === 'list') {
      ensureBackupDir();
      const basename = path.basename(configPath, '.json');
      const backups = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.startsWith(basename))
        .sort()
        .reverse();

      console.log(`📋 Backups for ${configPath}:\n`);
      backups.forEach((f, i) => {
        const stat = fs.statSync(path.join(BACKUP_DIR, f));
        console.log(`  ${i + 1}. ${f}`);
        console.log(`     ${stat.mtime.toISOString()}`);
      });
    } else {
      console.log('Usage:');
      console.log('  npx tsx scripts/config-backup.ts backup [config-path]');
      console.log('  npx tsx scripts/config-backup.ts restore [config-path]');
      console.log('  npx tsx scripts/config-backup.ts list [config-path]');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Error:', message);
    process.exit(1);
  }
}
