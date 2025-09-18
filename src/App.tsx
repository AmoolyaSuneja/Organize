import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import clsx from 'classnames'
import { DesignBoard, type SuggestionBox } from './components/DesignBoard'
import { SuggestionsPanel } from './components/SuggestionsPanel'

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestionBox[]>([])
  const [showGrid, setShowGrid] = useState(true)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    onDrop
  })

  const dropClasses = useMemo(() => clsx(
    'aspect-video grid place-items-center rounded-xl border-2 border-dashed transition-all',
    'bg-brand-50/60',
    {
      'border-yellow-400 shadow-[0_0_0_4px_rgba(245,158,11,0.15)]': isDragActive,
      'border-red-400': isDragReject,
      'border-yellow-300': !isDragActive && !isDragReject,
    }
  ), [isDragActive, isDragReject])

  return (
    <div className="min-h-screen app-gradient">
      <header className="sticky top-0 z-10 backdrop-blur border-b border-yellow-200/50 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-brand-300" />
            <span className="font-semibold text-lg">Room Organizer</span>
          </div>
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#">Docs</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Organize your space with a single image
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-4 text-lg text-slate-600"
            >
              Upload a photo of your room, closet, or kitchen. Get smart arrangement suggestions, apply filters, then save and share your design.
            </motion.p>
            <div className="mt-8">
              <a href="#upload" className="inline-flex items-center gap-2 rounded-lg bg-brand-400 text-white px-5 py-3 shadow-sm hover:bg-brand-500 transition-colors">Get Started</a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-yellow-200 bg-white shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-600">Board</div>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm px-3 py-1.5 rounded-md border border-yellow-300 hover:bg-brand-50"
                  onClick={() => setShowGrid(v => !v)}
                >
                  {showGrid ? 'Hide grid' : 'Show grid'}
                </button>
                <button
                  className="text-sm px-3 py-1.5 rounded-md bg-brand-400 text-white hover:bg-brand-500"
                  onClick={() => {
                    if (!imageUrl) return
                    // naive demo suggestions
                    setSuggestions([
                      { id: 's1', xPct: 10, yPct: 20, wPct: 20, hPct: 30, label: 'Shelves' },
                      { id: 's2', xPct: 55, yPct: 15, wPct: 30, hPct: 25, label: 'Storage Bins' },
                      { id: 's3', xPct: 35, yPct: 55, wPct: 25, hPct: 30, label: 'Hanging Rack' },
                    ])
                  }}
                >
                  Generate suggestions
                </button>
                <button
                  className="text-sm px-3 py-1.5 rounded-md border border-yellow-300 hover:bg-brand-50"
                  onClick={() => setSuggestions([])}
                >
                  Clear
                </button>
              </div>
            </div>

            <div id="upload" {...getRootProps({ className: dropClasses })}>
              <input {...getInputProps()} />
              <AnimatePresence initial={false}>
                {!imageUrl && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center px-6"
                  >
                    <p className="text-slate-700 font-medium">Drag & drop an image here, or click to browse</p>
                    <p className="text-slate-500 text-sm mt-2">JPG, PNG, or WebP. Max 1 file.</p>
                  </motion.div>
                )}

                {imageUrl && (
                  <motion.div
                    key="board"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full overflow-hidden rounded-lg"
                  >
                    <DesignBoard imageUrl={imageUrl} suggestions={suggestions} showGrid={showGrid} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <SuggestionsPanel
              disabled={!imageUrl}
              onApply={(boxes) => setSuggestions(boxes)}
              onClear={() => setSuggestions([])}
            />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default App
