import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateLayoutSuggestions, applyLayoutSuggestion, type LayoutSuggestion } from '../lib/layoutEngine'
import type { PlacedFurniture } from './InteractiveCanvas'
import type { FiltersState } from './FiltersPanel'

type LayoutSuggestionsProps = {
  roomWidth: number
  roomHeight: number
  filters: FiltersState
  existingFurniture: PlacedFurniture[] // For future use
  onApplySuggestion: (furniture: PlacedFurniture[]) => void
  disabled?: boolean
}

export function LayoutSuggestions({
  roomWidth,
  roomHeight,
  filters,
  existingFurniture: _existingFurniture,
  onApplySuggestion,
  disabled
}: LayoutSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<LayoutSuggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  const generateSuggestions = async () => {
    if (disabled || roomWidth === 0 || roomHeight === 0) return
    
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const newSuggestions = generateLayoutSuggestions(roomWidth, roomHeight, filters)
    setSuggestions(newSuggestions)
    setIsGenerating(false)
  }

  const handleApplySuggestion = (suggestion: LayoutSuggestion) => {
    const newFurniture = applyLayoutSuggestion(suggestion)
    onApplySuggestion(newFurniture)
    setSelectedSuggestion(suggestion.id)
    
    // Clear selection after a moment
    setTimeout(() => setSelectedSuggestion(null), 2000)
  }

  // Auto-generate suggestions when filters change
  useEffect(() => {
    if (roomWidth > 0 && roomHeight > 0) {
      generateSuggestions()
    }
  }, [filters.roomType, filters.goals, filters.style, filters.density])

  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">AI Layout Suggestions</h3>
        <button
          onClick={generateSuggestions}
          disabled={disabled || isGenerating}
          className="text-xs px-3 py-1.5 rounded-md bg-brand-400 text-white hover:bg-brand-500 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? '🤖 Generating...' : '🔄 Regenerate'}
        </button>
      </div>
      
      <p className="text-xs text-slate-500 mb-4">
        AI-powered layouts optimized for your room type and goals
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Analyzing room layout...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isGenerating && suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`
                border rounded-lg p-3 cursor-pointer transition-all
                ${selectedSuggestion === suggestion.id
                  ? 'border-green-400 bg-green-50'
                  : 'border-yellow-200 hover:border-yellow-300 hover:bg-brand-50'
                }
              `}
              onClick={() => handleApplySuggestion(suggestion)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-800">{suggestion.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{suggestion.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                    <span className="text-xs text-slate-600">{suggestion.furniture.length} items</span>
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    {suggestion.score}%
                  </div>
                </div>
              </div>
              
              {/* Furniture preview */}
              <div className="flex items-center gap-1 flex-wrap">
                {suggestion.furniture.slice(0, 6).map(furniture => (
                  <div
                    key={furniture.id}
                    className="w-6 h-6 bg-white border border-yellow-200 rounded flex items-center justify-center text-xs"
                    title={furniture.item.name}
                  >
                    {furniture.item.emoji}
                  </div>
                ))}
                {suggestion.furniture.length > 6 && (
                  <div className="text-xs text-slate-500">
                    +{suggestion.furniture.length - 6} more
                  </div>
                )}
              </div>
              
              {selectedSuggestion === suggestion.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 text-xs text-green-600 font-medium"
                >
                  ✅ Applied to room!
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {!isGenerating && suggestions.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm">Upload a room image to get AI suggestions</p>
          </div>
        )}
      </div>
    </div>
  )
}
