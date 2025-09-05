import { NextRequest, NextResponse } from 'next/server'

// Simple JWT implementation for Google Sheets API (Node.js v22 compatible)
async function createJWT() {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  
  const signatureInput = `${encodedHeader}.${encodedPayload}`
  
  // Use Web Crypto API instead of Node crypto (Node.js v22 compatible)
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!privateKey) throw new Error('Private key not found')

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
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  )

  const encodedSignature = Buffer.from(signature).toString('base64url')
  return `${signatureInput}.${encodedSignature}`
}

async function getAccessToken() {
  const jwt = await createJWT()
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

async function getSheetData(spreadsheetId: string, range: string) {
  const accessToken = await getAccessToken()
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.statusText}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if required environment variables are set
    const requiredEnvVars = [
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_SHEET_ID'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars)
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID!
    const range = 'Sheet1!A:B' // Assumes data is in columns A (name) and B (table)

    const sheetData = await getSheetData(spreadsheetId, range)
    const rows = sheetData.values || []
    
    // Skip header row if it exists (check if first row looks like headers)
    const dataRows = rows.length > 0 && 
      (rows[0][0]?.toLowerCase().includes('name') || rows[0][1]?.toLowerCase().includes('table')) 
      ? rows.slice(1) : rows

    // Search for the guest (case-insensitive)
    const searchName = name.toLowerCase().trim()
    const guest = dataRows.find((row: string[]) => {
      const guestName = row[0]?.toLowerCase().trim()
      return guestName === searchName
    })

    if (!guest || !guest[1]) {
      return NextResponse.json(
        { error: 'Guest not found. Please check your name spelling or contact the hosts.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      guest: {
        name: guest[0],
        table: guest[1]
      }
    })

  } catch (error) {
    console.error('Error fetching guest data:', error)
    return NextResponse.json(
      { error: 'Unable to fetch guest information. Please try again later.' },
      { status: 500 }
    )
  }
}
