import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { SuggestionBox } from './DesignBoard'

export type PresetKey = 'minimal' | 'storage' | 'balanced' | 'closet' | 'kitchen'

type SuggestionsPanelProps = {
  disabled: boolean
  onApply: (boxes: SuggestionBox[]) => void
  onClear: () => void
}

const PRESETS: { key: PresetKey; name: string; desc: string }[] = [
  { key: 'minimal', name: 'Minimalist', desc: 'Few focal zones, lots of breathing room' },
  { key: 'storage', name: 'Storage Max', desc: 'Optimized bins, shelves, and racks' },
  { key: 'balanced', name: 'Aesthetic Balance', desc: 'Symmetry and visual rhythm' },
  { key: 'closet', name: 'Closet Assist', desc: 'Hanging, folded, accessories' },
  { key: 'kitchen', name: 'Kitchen Zones', desc: 'Prep, cook, clean, store' },
]

function jitter(val: number, amt = 3) {
  return Math.max(0, Math.min(100, val + (Math.random() * 2 - 1) * amt))
}

function generatePreset(key: PresetKey): SuggestionBox[] {
  switch (key) {
    case 'minimal':
      return [
        { id: crypto.randomUUID(), xPct: 10, yPct: 20, wPct: 28, hPct: 30, label: 'Feature Area' },
        { id: crypto.randomUUID(), xPct: 60, yPct: 55, wPct: 25, hPct: 28, label: 'Storage' },
      ].map(b => ({ ...b, xPct: jitter(b.xPct, 2), yPct: jitter(b.yPct, 2) }))
    case 'storage':
      return [
        { id: crypto.randomUUID(), xPct: 8, yPct: 10, wPct: 30, hPct: 35, label: 'Shelving Wall' },
        { id: crypto.randomUUID(), xPct: 42, yPct: 12, wPct: 25, hPct: 25, label: 'Stackable Bins' },
        { id: crypto.randomUUID(), xPct: 70, yPct: 55, wPct: 22, hPct: 30, label: 'Drawer Unit' },
      ].map(b => ({ ...b, xPct: jitter(b.xPct), yPct: jitter(b.yPct) }))
    case 'balanced':
      return [
        { id: crypto.randomUUID(), xPct: 18, yPct: 20, wPct: 24, hPct: 28, label: 'Left Zone' },
        { id: crypto.randomUUID(), xPct: 58, yPct: 20, wPct: 24, hPct: 28, label: 'Right Zone' },
        { id: crypto.randomUUID(), xPct: 38, yPct: 58, wPct: 24, hPct: 28, label: 'Center Storage' },
      ]
    case 'closet':
      return [
        { id: crypto.randomUUID(), xPct: 10, yPct: 15, wPct: 32, hPct: 30, label: 'Hanging (Tops)' },
        { id: crypto.randomUUID(), xPct: 52, yPct: 15, wPct: 32, hPct: 30, label: 'Hanging (Bottoms)' },
        { id: crypto.randomUUID(), xPct: 10, yPct: 55, wPct: 32, hPct: 30, label: 'Folded Shelves' },
        { id: crypto.randomUUID(), xPct: 52, yPct: 55, wPct: 32, hPct: 30, label: 'Shoes/Accessories' },
      ]
    case 'kitchen':
      return [
        { id: crypto.randomUUID(), xPct: 8, yPct: 18, wPct: 28, hPct: 30, label: 'Prep Zone' },
        { id: crypto.randomUUID(), xPct: 38, yPct: 12, wPct: 24, hPct: 24, label: 'Cook Zone' },
        { id: crypto.randomUUID(), xPct: 68, yPct: 18, wPct: 24, hPct: 28, label: 'Clean Zone' },
        { id: crypto.randomUUID(), xPct: 38, yPct: 52, wPct: 24, hPct: 30, label: 'Pantry/Storage' },
      ]
  }
}

export function SuggestionsPanel({ disabled, onApply, onClear }: SuggestionsPanelProps) {
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
  }), [])

  return (
    <aside className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">Suggestions</h3>
      <p className="text-xs text-slate-500 mt-1">Choose a preset to auto-place zones.</p>
      <motion.ul
        className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
        variants={variants}
        initial="hidden"
        animate="show"
      >
        {PRESETS.map(p => (
          <motion.li key={p.key} className="">
            <button
              disabled={disabled}
              onClick={() => onApply(generatePreset(p.key))}
              className="w-full text-left rounded-md border border-yellow-200 hover:border-yellow-300 hover:bg-brand-50 px-3 py-2 transition disabled:opacity-50"
            >
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-slate-500">{p.desc}</div>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-3 flex gap-2">
        <button
          disabled={disabled}
          onClick={() => onApply(generatePreset('balanced'))}
          className="flex-1 text-sm px-3 py-2 rounded-md bg-brand-400 text-white hover:bg-brand-500 disabled:opacity-50"
        >
          Regenerate
        </button>
        <button
          onClick={onClear}
          className="text-sm px-3 py-2 rounded-md border border-yellow-300 hover:bg-brand-50"
        >
          Clear
        </button>
      </div>
    </aside>
  )
}


