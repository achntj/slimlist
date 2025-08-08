"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBarProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearFilters,
}: FilterBarProps) {
  if (availableTags.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          Filter by tags:
        </h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs h-6 px-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                isSelected
                  ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200"
                  : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              {isSelected && <X className="w-3 h-3 ml-1" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
