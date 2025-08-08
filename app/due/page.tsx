'use client'

import { useState, useEffect } from 'react'
import { ListCard } from '@/components/list-card'
import { FilterBar } from '@/components/filter-bar'
import { ListWithParsedTags } from '@/lib/types'
import { Calendar } from 'lucide-react'

export default function DuePage() {
  const [lists, setLists] = useState<ListWithParsedTags[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [listsResponse, tagsResponse] = await Promise.all([
        fetch('/api/lists/due'),
        fetch('/api/tags')
      ])
      
      const listsData = await listsResponse.json()
      const tagsData = await tagsResponse.json()
      
      setLists(listsData)
      setAvailableTags(tagsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredLists = selectedTags.length > 0 
    ? lists.filter(list => selectedTags.some(tag => list.tags.includes(tag)))
    : lists

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading...</div>
        </div>
      </div>
    )
  }

  const now = new Date()
  const overdueLists = filteredLists.filter(list => list.due_date && new Date(list.due_date) < now)
  const todayLists = filteredLists.filter(list => 
    list.due_date && new Date(list.due_date).toDateString() === now.toDateString()
  )
  const upcomingLists = filteredLists.filter(list => 
    list.due_date && new Date(list.due_date) > now && new Date(list.due_date).toDateString() !== now.toDateString()
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Due Dates</h1>
        <p className="text-slate-600 mt-1">
          {filteredLists.length} list{filteredLists.length !== 1 ? 's' : ''} with due dates
          {selectedTags.length > 0 && ` filtered by ${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <FilterBar
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearFilters={() => setSelectedTags([])}
      />

      {filteredLists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {selectedTags.length > 0 ? 'No lists with due dates match your filters' : 'No lists with due dates'}
          </h3>
          <p className="text-slate-600">
            {selectedTags.length > 0 
              ? 'Try adjusting your tag filters.'
              : 'Add due dates to your lists to see them here.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {overdueLists.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Overdue ({overdueLists.length})
              </h2>
              <div className="space-y-4">
                {overdueLists.map((list) => (
                  <ListCard key={list.id} list={list} onUpdate={fetchData} />
                ))}
              </div>
            </div>
          )}

          {todayLists.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Due Today ({todayLists.length})
              </h2>
              <div className="space-y-4">
                {todayLists.map((list) => (
                  <ListCard key={list.id} list={list} onUpdate={fetchData} />
                ))}
              </div>
            </div>
          )}

          {upcomingLists.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming ({upcomingLists.length})
              </h2>
              <div className="space-y-4">
                {upcomingLists.map((list) => (
                  <ListCard key={list.id} list={list} onUpdate={fetchData} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
