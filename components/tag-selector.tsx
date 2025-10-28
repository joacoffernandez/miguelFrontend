"use client"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import { NORMALIZED_TAGS } from "@/lib/normalized-tags"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between h-11 bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-500">{selectedTags.length > 0 ? "Tags seleccionados" : "Seleccionar tags"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 space-y-1">
              {NORMALIZED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-[#e74c3c]/10 text-[#e74c3c] font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} className="bg-[#e74c3c]/10 text-[#e74c3c] hover:bg-[#e74c3c]/20 px-3 py-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-[#c0392b] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
