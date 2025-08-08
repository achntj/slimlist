"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListCard } from "@/components/list-card";
import { ListEditor } from "@/components/list-editor";
import { FilterBar } from "@/components/filter-bar";
import { ListWithParsedTags } from "@/lib/types";

export default function HomePage() {
  const [lists, setLists] = useState<ListWithParsedTags[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [listsResponse, tagsResponse] = await Promise.all([
        fetch("/api/lists", { cache: "no-store" }),
        fetch("/api/tags", { cache: "no-store" }),
      ]);

      const listsData = await listsResponse.json();
      const tagsData = await tagsResponse.json();

      setLists(listsData);
      setAvailableTags(tagsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredLists =
    selectedTags.length > 0
      ? lists.filter((list) =>
          selectedTags.some((tag) => list.tags.includes(tag)),
        )
      : lists;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Lists</h1>
          <p className="text-slate-600 mt-1">
            {filteredLists.length} list{filteredLists.length !== 1 ? "s" : ""}
            {selectedTags.length > 0 &&
              ` filtered by ${selectedTags.length} tag${selectedTags.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New List
        </Button>
      </div>

      <FilterBar
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearFilters={() => setSelectedTags([])}
      />

      <div className="space-y-4">
        {isCreating && (
          <ListEditor
            onCancel={() => setIsCreating(false)}
            onSave={() => {
              setIsCreating(false);
              fetchData();
            }}
          />
        )}

        {filteredLists.length === 0 && !isCreating ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {selectedTags.length > 0
                ? "No lists match your filters"
                : "No lists yet"}
            </h3>
            <p className="text-slate-600 mb-4">
              {selectedTags.length > 0
                ? "Try adjusting your tag filters or create a new list."
                : "Create your first list to get started organizing your tasks."}
            </p>
            {selectedTags.length === 0 && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First List
              </Button>
            )}
          </div>
        ) : (
          filteredLists.map((list) => (
            <ListCard
              key={`${list.id}-${list.updated_at}`}
              list={list}
              onUpdate={fetchData}
            />
          ))
        )}
      </div>
    </div>
  );
}
