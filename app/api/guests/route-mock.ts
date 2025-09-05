import { NextRequest, NextResponse } from 'next/server'

// For now, let's create a simple mock version that works
// You can replace this with real Google Sheets data once we solve the auth issue

const mockGuestData = [
  ['Hirva Shah', '1'],
  ['Jane Doe', '2'],
  ['Bob Johnson', '1'],
  ['Alice Brown', '3'],
  ['Charlie Wilson', '2'],
  ['Sarah Davis', '4'],
  ['Mike Taylor', '3'],
  ['Emily Johnson', '4'],
  ['David Brown', '5'],
  ['Lisa Wilson', '5']
]

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Search for the guest (case-insensitive) in mock data
    const searchName = name.toLowerCase().trim()
    const guest = mockGuestData.find((row: string[]) => {
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
