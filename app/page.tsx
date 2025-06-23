"use client"

import { Badge } from "@/components/ui/badge"
import { Gift, Users, BookOpen, Brain } from 'lucide-react'
import Header from "@/components/header"
import DreamInterpreterWidget from "@/components/dream-interpreter-widget"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Free AI-Powered Dream Interpretation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Get instant insights from authentic spiritual and psychological traditions worldwide
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-lg">
              <Gift className="w-4 h-4 mr-2" />
              100% Free - No Signup Required
            </Badge>
          </div>
        </div>

        <DreamInterpreterWidget />
      </div>
    </div>
  )
}
