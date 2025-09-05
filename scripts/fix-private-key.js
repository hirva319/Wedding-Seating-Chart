#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Private Key Format Fixer');
console.log('============================\n');

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('🔍 Checking GOOGLE_PRIVATE_KEY format...\n');

// Find the private key line
const privateKeyLineIndex = lines.findIndex(line => line.startsWith('GOOGLE_PRIVATE_KEY='));

if (privateKeyLineIndex === -1) {
  console.log('❌ GOOGLE_PRIVATE_KEY not found in .env.local');
  process.exit(1);
}

const privateKeyLine = lines[privateKeyLineIndex];
const privateKeyValue = privateKeyLine.substring('GOOGLE_PRIVATE_KEY='.length);

// Check if it's already properly formatted
if (privateKeyValue.includes('\\n') && privateKeyValue.startsWith('"') && privateKeyValue.endsWith('"')) {
  console.log('✅ Private key appears to be correctly formatted');
  console.log('💡 The issue might be elsewhere. Let me check the key content...\n');
  
  // Try to parse and validate the key
  try {
    const keyContent = privateKeyValue.slice(1, -1).replace(/\\n/g, '\n');
    if (keyContent.includes('-----BEGIN PRIVATE KEY-----') && keyContent.includes('-----END PRIVATE KEY-----')) {
      console.log('✅ Private key structure looks correct');
      console.log('🤔 This might be a Node.js version compatibility issue');
      console.log('\n💡 Try these solutions:');
      console.log('1. Make sure you downloaded the key as JSON (not P12)');
      console.log('2. Try regenerating the service account key');
      console.log('3. The key should be RSA format, not EC format');
    } else {
      console.log('❌ Private key content appears malformed');
      console.log('💡 Please regenerate your service account key from Google Cloud Console');
    }
  } catch (error) {
    console.log('❌ Could not parse private key');
  }
} else {
  console.log('⚠️  Private key format needs fixing...');
  
  // Remove quotes and fix the format
  let cleanKey = privateKeyValue.replace(/^"/, '').replace(/"$/, '');
  
  // If it doesn't have \\n, it might be multiline - convert to single line with \\n
  if (!cleanKey.includes('\\n')) {
    cleanKey = cleanKey.replace(/\n/g, '\\n');
  }
  
  // Ensure it's properly quoted
  const fixedKey = `"${cleanKey}"`;
  
  lines[privateKeyLineIndex] = `GOOGLE_PRIVATE_KEY=${fixedKey}`;
  
  // Write back to file
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Fixed private key format in .env.local');
  console.log('🔄 Please try running your app again');
}

console.log('\n📖 If issues persist, see GOOGLE_SHEETS_SETUP.md for detailed troubleshooting');
