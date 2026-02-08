#!/usr/bin/env node

/**
 * Generate an Apple MapKit JS JWT token from a .p8 private key.
 *
 * Apple MapKit JS requires a signed JWT for authentication. Apple provides
 * a .p8 file containing an ES256 private key — this script signs a JWT
 * with the correct claims and outputs the token string.
 *
 * Usage:
 *   node scripts/generate-mapkit-token.js --teamId ABCD1234EF --keyId A56J59A23Y --keyFile AuthKey_A56J59A23Y.p8
 *
 * Options:
 *   --teamId, -t    Apple Developer Team ID (10 chars, from Membership page)
 *   --keyId,  -k    MapKit key ID (from filename or Keys page)
 *   --keyFile, -f   Path to .p8 private key file
 *   --expiry, -e    Token lifetime in days (default: 180, max: 365)
 *
 * The output JWT can be pasted directly into a client config:
 *   "appleMapToken": "<paste-token-here>"
 *
 * Requires: Node.js 22+ (uses built-in crypto, no external dependencies)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPrivateKey, sign } from 'node:crypto';

// ---------------------------------------------------------------------------
// Argument parsing (zero dependencies)
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function getArg(long, short) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === `--${long}` || args[i] === `-${short}`) {
      return args[i + 1];
    }
    if (args[i].startsWith(`--${long}=`)) {
      return args[i].split('=').slice(1).join('=');
    }
  }
  return undefined;
}

const teamId = getArg('teamId', 't');
const keyId = getArg('keyId', 'k');
const keyFile = getArg('keyFile', 'f');
const expiryDays = parseInt(getArg('expiry', 'e') || '180', 10);

if (!teamId || !keyId || !keyFile) {
  console.error(`
Apple MapKit JS Token Generator
================================

Usage:
  node scripts/generate-mapkit-token.js --teamId <TEAM_ID> --keyId <KEY_ID> --keyFile <PATH>

Required:
  --teamId, -t    Apple Developer Team ID (10-char, from Membership page)
  --keyId,  -k    MapKit key ID (from .p8 filename or Keys page)
  --keyFile, -f   Path to .p8 private key file

Optional:
  --expiry, -e    Token lifetime in days (default: 180, max: 365)

Example:
  node scripts/generate-mapkit-token.js \\
    --teamId ABCD1234EF \\
    --keyId A56J59A23Y \\
    --keyFile ~/AuthKey_A56J59A23Y.p8

Where to find your values:
  Team ID  → https://developer.apple.com/account#MembershipDetailsCard
  Key ID   → https://developer.apple.com/account/resources/authkeys/list
  Key File → Downloaded once when you created the MapKit key
`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
if (!/^[A-Z0-9]{10}$/.test(teamId)) {
  console.error(`Error: Team ID must be exactly 10 alphanumeric characters. Got: "${teamId}"`);
  process.exit(1);
}

if (!/^[A-Z0-9]{10}$/.test(keyId)) {
  console.error(`Error: Key ID must be exactly 10 alphanumeric characters. Got: "${keyId}"`);
  process.exit(1);
}

if (expiryDays < 1 || expiryDays > 365) {
  console.error(`Error: Expiry must be between 1 and 365 days. Got: ${expiryDays}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Read private key
// ---------------------------------------------------------------------------
let keyPem;
try {
  keyPem = readFileSync(resolve(keyFile), 'utf8').trim();
} catch (err) {
  console.error(`Error: Cannot read key file "${keyFile}": ${err.message}`);
  process.exit(1);
}

let privateKey;
try {
  privateKey = createPrivateKey({
    key: keyPem,
    format: 'pem',
    type: 'pkcs8',
  });
} catch (err) {
  console.error(`Error: Invalid .p8 private key: ${err.message}`);
  process.exit(1);
}

// Verify it's an EC key (ES256 = P-256 curve)
const keyDetail = privateKey.asymmetricKeyType;
if (keyDetail !== 'ec') {
  console.error(
    `Error: Expected EC private key, got "${keyDetail}". Ensure this is a MapKit .p8 key.`
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Build JWT
// ---------------------------------------------------------------------------
function base64url(data) {
  const b64 = (typeof data === 'string' ? Buffer.from(data) : data).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const now = Math.floor(Date.now() / 1000);
const exp = now + expiryDays * 24 * 60 * 60;

const header = {
  alg: 'ES256',
  typ: 'JWT',
  kid: keyId,
};

const payload = {
  iss: teamId,
  iat: now,
  exp,
};

const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

// Sign with ES256 (ECDSA P-256 + SHA-256), ieee-p1363 gives raw R||S format
const signature = sign('SHA256', Buffer.from(signingInput), {
  key: privateKey,
  dsaEncoding: 'ieee-p1363',
});

const jwt = `${signingInput}.${base64url(signature)}`;

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const expiryDate = new Date(exp * 1000).toISOString().split('T')[0];

console.log(jwt);
console.error(`\nToken generated successfully.`);
console.error(`  Key ID:   ${keyId}`);
console.error(`  Team ID:  ${teamId}`);
console.error(`  Expires:  ${expiryDate} (${expiryDays} days)`);
console.error(`\nPaste the token above into your client config:`);
console.error(`  "appleMapToken": "${jwt.slice(0, 30)}..."`);
