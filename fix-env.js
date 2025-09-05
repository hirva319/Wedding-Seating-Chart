#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing .env.local file...');

// Read the current .env.local
let envContent = fs.readFileSync('.env.local', 'utf8');

// Fix the private key line - remove the placeholder part
const fixedContent = envContent.replace(
  /GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n""-----BEGIN PRIVATE KEY-----/,
  'GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----'
);

// Write the fixed content back
fs.writeFileSync('.env.local', fixedContent);

console.log('✅ Fixed .env.local - removed duplicate private key header');
console.log('🧪 Now test with: node debug-api.js');
