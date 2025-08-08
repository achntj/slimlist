'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Calendar, Home } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-slate-900">
              Lists
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/" 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Home className="w-4 h-4" />
                <span>All Lists</span>
              </Link>
              <Link
                href="/due"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/due" 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Calendar className="w-4 h-4" />
                <span>Due Dates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
