'use client'

import { useState, FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchFormProps {
  onSearch: (name: string) => void
  loading: boolean
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSearch(name.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name..."
          className="w-full px-4 py-3 pl-12 text-lg border-2 border-wedding-primary/20 rounded-lg 
                   focus:border-wedding-primary focus:outline-none focus:ring-2 focus:ring-wedding-primary/20
                   bg-white/80 backdrop-blur-sm shadow-lg placeholder-wedding-accent/60"
          disabled={loading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wedding-accent w-5 h-5" />
      </div>
      
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full bg-wedding-primary hover:bg-wedding-primary/90 disabled:bg-wedding-accent/50 
                 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200
                 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none
                 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Find My Table
          </>
        )}
      </button>
    </form>
  )
}
