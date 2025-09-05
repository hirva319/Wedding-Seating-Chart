import { NextRequest, NextResponse } from 'next/server'

// Use the googleapis library with a workaround for Node.js v22
const { google } = require('googleapis')

async function getGoogleSheetsData(spreadsheetId: string, range: string) {
  try {
    // Create credentials object
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      universe_domain: 'googleapis.com'
    }

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    // Get authenticated client
    const authClient = await auth.getClient()
    
    // Create sheets instance
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    // Get the data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    return response.data.values || []
  } catch (error) {
    console.error('Google Sheets API Error:', error)
    throw error
  }
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

    const rows = await getGoogleSheetsData(spreadsheetId, range)
    
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
