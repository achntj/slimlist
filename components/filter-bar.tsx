'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface FilterBarProps {
  availableTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearFilters: () => void
}

export function FilterBar({ availableTags, selectedTags, onTagToggle, onClearFilters }: FilterBarProps) {
  if (availableTags.length === 0) return null

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700">Filter by tags:</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs h-6 px-2"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              {isSelected && <X className="w-3 h-3 ml-1" />}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
