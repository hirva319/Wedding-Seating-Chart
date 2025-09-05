'use client'

import { useState } from 'react'
import { Search, Heart, MapPin, Users } from 'lucide-react'
import SearchForm from './components/SearchForm'
import TableResult from './components/TableResult'

interface Guest {
  name: string
  table: string
}

export default function Home() {
  const [searchResult, setSearchResult] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (guestName: string) => {
    setLoading(true)
    setError('')
    setSearchResult(null)

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: guestName }),
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResult(data.guest)
      } else {
        setError(data.error || 'Guest not found')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen wedding-pattern bg-gradient-to-br from-wedding-secondary to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Heart className="text-wedding-primary w-8 h-8 mr-2" />
            <h1 className="font-serif text-4xl md:text-6xl text-wedding-text">
              Find Your Table
            </h1>
            <Heart className="text-wedding-primary w-8 h-8 ml-2" />
          </div>
          <p className="text-wedding-accent text-lg md:text-xl font-medium">
            Welcome to our celebration! Enter your name to find your seat.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Section */}
        <div className="max-w-lg mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Search className="text-red-400 w-5 h-5 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
              <p className="text-red-600 text-sm mt-2">
                Please check the spelling of your name or contact the hosts for assistance.
              </p>
            </div>
          )}

          {searchResult && <TableResult guest={searchResult} />}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-wedding-accent">
          <div className="flex justify-center items-center mb-2">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Can't find your name? Please ask a member of our wedding party</span>
          </div>
        </div>
      </div>
    </main>
  )
}
