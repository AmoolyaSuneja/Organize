import { memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type SuggestionBox = {
  id: string
  xPct: number
  yPct: number
  wPct: number
  hPct: number
  label: string
  color?: string
}

type DesignBoardProps = {
  imageUrl: string
  suggestions: SuggestionBox[]
  showGrid: boolean
}

const gridBackground = (show: boolean) => {
  if (!show) return {}
  const cell = 24
  return {
    backgroundImage:
      `linear-gradient(to right, rgba(245, 158, 11, 0.15) 1px, transparent 1px),` +
      `linear-gradient(to bottom, rgba(245, 158, 11, 0.15) 1px, transparent 1px)`,
    backgroundSize: `${cell}px ${cell}px`,
  } as const
}

function DesignBoardBase({ imageUrl, suggestions, showGrid }: DesignBoardProps) {
  const overlayStyles = useMemo(() => gridBackground(showGrid), [showGrid])

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-hidden rounded-xl border border-yellow-200 bg-white">
        <div className="aspect-video relative">
          <img src={imageUrl} alt="Uploaded" className="absolute inset-0 w-full h-full object-contain" />
          <div className="absolute inset-0" style={overlayStyles} />

          <AnimatePresence>
            {suggestions.map(s => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="absolute rounded-lg ring-2 ring-brand-400/60 bg-brand-100/40 backdrop-blur-[1px] shadow-sm"
                style={{
                  left: `${s.xPct}%`,
                  top: `${s.yPct}%`,
                  width: `${s.wPct}%`,
                  height: `${s.hPct}%`,
                }}
              >
                <div className="absolute -top-7 left-0 px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs shadow">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export const DesignBoard = memo(DesignBoardBase)


