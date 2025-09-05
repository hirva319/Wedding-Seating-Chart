#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎉 Wedding Seating Chart Deployment Helper');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local with your Google Sheets credentials');
  console.log('💡 Copy env.example to .env.local and fill in your values\n');
  process.exit(1);
}

// Read and validate environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'GOOGLE_PROJECT_ID',
  'GOOGLE_PRIVATE_KEY_ID', 
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_SHEET_ID'
];

const missingVars = requiredVars.filter(varName => {
  return !envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your-`);
});

if (missingVars.length > 0) {
  console.log('❌ Missing or incomplete environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📖 See GOOGLE_SHEETS_SETUP.md for detailed setup instructions\n');
  process.exit(1);
}

console.log('✅ Environment variables validated');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'ignore' });
  console.log('✅ Git repository detected');
} catch (error) {
  console.log('❌ Not in a git repository');
  console.log('💡 Initialize git with: git init && git add . && git commit -m "Initial commit"');
  process.exit(1);
}

// Check if there are uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📝 Uncommitted changes detected, committing...');
    execSync('git add .');
    execSync('git commit -m "Update for deployment"');
    console.log('✅ Changes committed');
  }
} catch (error) {
  console.log('⚠️  Could not commit changes automatically');
}

// Install Vercel CLI if not present
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
  console.log('✅ Vercel CLI installed');
}

console.log('\n🚀 Ready to deploy!');
console.log('Next steps:');
console.log('1. Run: vercel login');
console.log('2. Run: vercel --prod');
console.log('3. Follow the prompts to deploy');
console.log('\n💡 Your environment variables will need to be added in Vercel dashboard');
console.log('📊 See DEPLOYMENT.md for detailed instructions');

// Optionally start deployment
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\n🤖 Would you like me to start the deployment now? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting deployment...');
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n❌ Deployment failed. Please run "vercel login" first if needed.');
    }
  } else {
    console.log('\n👋 No problem! Run "node deploy.js" again when ready to deploy.');
  }
  readline.close();
});
