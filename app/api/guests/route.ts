import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  return google.sheets({ version: 'v4', auth })
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
      'GOOGLE_PROJECT_ID',
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

    const sheets = getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const range = 'Sheet1!A:B' // Assumes data is in columns A (name) and B (table)

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []
    
    // Skip header row if it exists
    const dataRows = rows.slice(1)

    // Search for the guest (case-insensitive)
    const searchName = name.toLowerCase().trim()
    const guest = dataRows.find(row => {
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
