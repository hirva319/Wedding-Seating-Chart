'use client'

import { MapPin, Users, CheckCircle } from 'lucide-react'

interface Guest {
  name: string
  table: string
}

interface TableResultProps {
  guest: Guest
}

export default function TableResult({ guest }: TableResultProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-wedding-primary/20 p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        
        <h2 className="font-serif text-2xl text-wedding-text mb-2">
          Welcome, {guest.name}!
        </h2>
        
        <div className="bg-wedding-primary/10 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="text-wedding-primary w-6 h-6 mr-2" />
            <span className="text-wedding-accent font-medium">You're seated at:</span>
          </div>
          
          <div className="font-serif text-4xl text-wedding-primary font-bold">
            Table {guest.table}
          </div>
        </div>
        
        <div className="flex items-center justify-center text-wedding-accent text-sm">
          <Users className="w-4 h-4 mr-2" />
          <span>Please find your table and enjoy the celebration!</span>
        </div>
      </div>
    </div>
  )
}
