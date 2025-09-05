#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Environment Variables Validator');
console.log('==================================\n');

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Please create .env.local file with your Google Sheets credentials');
  console.log('💡 Copy env.example to .env.local and fill in your values');
  console.log('📖 See GOOGLE_SHEETS_SETUP.md for detailed instructions\n');
  process.exit(1);
}

console.log('✅ .env.local file found');

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

const requiredVars = [
  { name: 'GOOGLE_PROJECT_ID', description: 'Your Google Cloud project ID' },
  { name: 'GOOGLE_PRIVATE_KEY_ID', description: 'Private key ID from service account JSON' },
  { name: 'GOOGLE_PRIVATE_KEY', description: 'Private key from service account JSON (with quotes)' },
  { name: 'GOOGLE_CLIENT_EMAIL', description: 'Service account email address' },
  { name: 'GOOGLE_CLIENT_ID', description: 'Client ID from service account JSON' },
  { name: 'GOOGLE_SHEET_ID', description: 'Your Google Sheet ID from the URL' }
];

console.log('🔍 Checking environment variables...\n');

let allValid = true;

requiredVars.forEach(variable => {
  const envLine = lines.find(line => line.startsWith(`${variable.name}=`));
  
  if (!envLine) {
    console.log(`❌ ${variable.name} - MISSING`);
    console.log(`   ${variable.description}\n`);
    allValid = false;
  } else {
    const value = envLine.split('=')[1];
    if (!value || value.trim() === '' || value.includes('your-')) {
      console.log(`❌ ${variable.name} - NOT CONFIGURED`);
      console.log(`   ${variable.description}\n`);
      allValid = false;
    } else {
      console.log(`✅ ${variable.name} - OK`);
    }
  }
});

if (allValid) {
  console.log('\n🎉 All environment variables are configured!');
  console.log('🚀 You\'re ready to deploy your wedding seating chart');
  console.log('\n💡 Next steps:');
  console.log('1. Run: node deploy.js');
  console.log('2. Or manually deploy with: vercel --prod');
} else {
  console.log('\n❌ Some environment variables need attention');
  console.log('📖 Check GOOGLE_SHEETS_SETUP.md for detailed setup instructions');
  console.log('💡 Make sure you\'ve:');
  console.log('   - Created a Google Cloud project');
  console.log('   - Enabled Google Sheets API');
  console.log('   - Created a service account');
  console.log('   - Downloaded the JSON credentials');
  console.log('   - Shared your Google Sheet with the service account email');
}

console.log('');
