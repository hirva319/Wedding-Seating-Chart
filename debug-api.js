#!/usr/bin/env node

// Debug script to test Google Sheets API connection
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debug: Testing Google Sheets API Connection');
console.log('===============================================\n');

// Check environment variables
const requiredVars = ['GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_SHEET_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:', missingVars);
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('📊 Sheet ID:', process.env.GOOGLE_SHEET_ID);
console.log('👤 Service Account:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('');

// Simple JWT implementation for testing
async function createJWT() {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) throw new Error('Private key not found');

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      Buffer.from(privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, ''), 'base64'),
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(signatureInput)
    );

    const encodedSignature = Buffer.from(signature).toString('base64url');
    console.log('✅ JWT created successfully');
    return `${signatureInput}.${encodedSignature}`;
  } catch (error) {
    console.log('❌ JWT creation failed:', error.message);
    throw error;
  }
}

async function getAccessToken() {
  try {
    const jwt = await createJWT();
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Token request failed:', response.status, errorText);
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Access token obtained');
    return data.access_token;
  } catch (error) {
    console.log('❌ Access token failed:', error.message);
    throw error;
  }
}

async function testSheetAccess() {
  try {
    const accessToken = await getAccessToken();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:B';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    
    console.log('🔗 Testing sheet access...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Sheet access failed:', response.status, errorText);
      
      if (response.status === 403) {
        console.log('\n💡 This usually means:');
        console.log('1. Your sheet is not shared with the service account email');
        console.log('2. The service account email is:', process.env.GOOGLE_CLIENT_EMAIL);
        console.log('3. Share your Google Sheet with this email address');
      } else if (response.status === 404) {
        console.log('\n💡 This usually means:');
        console.log('1. The Sheet ID is incorrect');
        console.log('2. The sheet name is not "Sheet1"');
        console.log('3. Check your GOOGLE_SHEET_ID in .env.local');
      }
      
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Sheet access successful!');
    console.log('📋 Data preview:', JSON.stringify(data.values?.slice(0, 3), null, 2));
    
    if (!data.values || data.values.length === 0) {
      console.log('⚠️  Sheet appears to be empty');
    } else {
      console.log(`📊 Found ${data.values.length} rows of data`);
    }
    
    return data;
  } catch (error) {
    console.log('❌ Sheet test failed:', error.message);
    throw error;
  }
}

// Run the test
testSheetAccess()
  .then(() => {
    console.log('\n🎉 All tests passed! Your Google Sheets integration is working.');
  })
  .catch((error) => {
    console.log('\n💥 Test failed. Please check the error messages above.');
    console.log('📖 See GOOGLE_SHEETS_SETUP.md for detailed troubleshooting.');
  });
