#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

console.log('📱 QR Code Generator for Wedding Seating Chart');
console.log('==============================================\n');

const args = process.argv.slice(2);
const url = args[0];

if (!url) {
  console.log('❌ Please provide your deployed app URL');
  console.log('💡 Usage: node scripts/generate-qr.js https://your-app.vercel.app');
  console.log('📖 You can get your URL after deploying with Vercel\n');
  process.exit(1);
}

// Validate URL format
try {
  new URL(url);
} catch (error) {
  console.log('❌ Invalid URL format');
  console.log('💡 Make sure to include https:// at the beginning');
  process.exit(1);
}

console.log(`🔗 Generating QR code for: ${url}`);

// Generate QR code using Google Charts API
const qrUrl = `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(url)}&choe=UTF-8`;

console.log('📊 Using Google Charts API to generate QR code...');

// Download the QR code
const file = fs.createWriteStream('wedding-seating-qr.png');

https.get(qrUrl, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log('✅ QR code saved as wedding-seating-qr.png');
      console.log('\n🎉 Next steps:');
      console.log('1. Open wedding-seating-qr.png');
      console.log('2. Print it out for your wedding');
      console.log('3. Place it where guests can easily scan it');
      console.log('\n💡 Pro tips:');
      console.log('- Test the QR code with your phone first');
      console.log('- Print multiple copies for different locations');
      console.log('- Add text like "Scan to find your table"');
      console.log('- Consider adding it to your wedding programs');
    });
  } else {
    console.log('❌ Failed to generate QR code');
    console.log('🌐 You can manually create one at: https://www.qr-code-generator.com/');
    console.log(`🔗 Use this URL: ${url}`);
  }
}).on('error', (error) => {
  console.log('❌ Network error generating QR code');
  console.log('🌐 You can manually create one at: https://www.qr-code-generator.com/');
  console.log(`🔗 Use this URL: ${url}`);
});
