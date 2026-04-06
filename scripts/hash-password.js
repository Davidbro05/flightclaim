#!/usr/bin/env node
/**
 * Generate a bcrypt hash for the admin password.
 * Usage: node scripts/hash-password.js <your-password>
 *
 * Copy the output into your .env file as ADMIN_PASS_HASH=...
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nAdd this to your .env (or Portainer stack env vars):');
  console.log(`ADMIN_PASS_HASH=${hash}\n`);
});
