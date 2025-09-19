import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiltersPanel, type FiltersState } from './components/FiltersPanel'
import { FurnitureLibrary } from './components/FurnitureLibrary'
import { InteractiveCanvas, type PlacedFurniture } from './components/InteractiveCanvas'
import { exportNodeAsPng, exportNodeToBlob, shareImage } from './lib/export'
import { saveAs } from 'file-saver'

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [placedFurniture, setPlacedFurniture] = useState<PlacedFurniture[]>([])
  const [showGrid, setShowGrid] = useState(true)
  const [filters, setFilters] = useState<FiltersState>({ roomType: 'room', goals: [], style: 'minimal', density: 50 })
  const boardCardRef = useRef<HTMLDivElement | null>(null)

  const handleImageUpload = useCallback((url: string) => {
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    // Convert to data URL for saving
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        setImageDataUrl(canvas.toDataURL())
      }
    }
    img.src = url
  }, [])

  const handleFurnitureAdd = useCallback((furniture: PlacedFurniture) => {
    setPlacedFurniture(prev => [...prev, furniture])
  }, [])

  const handleFurnitureUpdate = useCallback((id: string, updates: Partial<PlacedFurniture>) => {
    setPlacedFurniture(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }, [])

  const handleFurnitureRemove = useCallback((id: string) => {
    setPlacedFurniture(prev => prev.filter(f => f.id !== id))
  }, [])

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Organize your space with a single image
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a photo of your room, closet, or kitchen. Get smart arrangement suggestions, apply filters, then save and share your design.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Canvas Area - Takes up 3/4 of the space */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-yellow-200 bg-white shadow-lg p-6"
              ref={boardCardRef}
            >
              {/* Canvas Header */}
              <div className="flex items-center justify-between mb-6" data-noexport="true">
                <h2 className="text-lg font-semibold text-slate-800">Interactive Room Designer</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className="text-sm px-3 py-1.5 rounded-md border border-yellow-300 hover:bg-brand-50 transition-colors"
                    onClick={() => setShowGrid(v => !v)}
                  >
                    {showGrid ? 'Hide grid' : 'Show grid'}
                  </button>
                  <button
                    className="text-sm px-3 py-1.5 rounded-md border border-yellow-300 hover:bg-brand-50 transition-colors"
                    onClick={() => setPlacedFurniture([])}
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* Interactive Canvas */}
              <InteractiveCanvas
                imageUrl={imageUrl}
                onImageUpload={handleImageUpload}
                placedFurniture={placedFurniture}
                onFurnitureAdd={handleFurnitureAdd}
                onFurnitureUpdate={handleFurnitureUpdate}
                onFurnitureRemove={handleFurnitureRemove}
                showGrid={showGrid}
              />

              {/* Action Buttons */}
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-yellow-100"
                  data-noexport="true"
                >
                  <button
                    className="px-4 py-2 rounded-lg border border-yellow-300 hover:bg-brand-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      if (!imageDataUrl) return
                      const payload = {
                        imageDataUrl,
                        placedFurniture,
                        filters,
                        savedAt: Date.now(),
                      }
                      localStorage.setItem('roomorganizer:design', JSON.stringify(payload))
                    }}
                  >
                    💾 Save
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg border border-yellow-300 hover:bg-brand-50 transition-colors flex items-center gap-2"
                    onClick={async () => {
                      if (!boardCardRef.current) return
                      await exportNodeAsPng(boardCardRef.current, 'design.png')
                    }}
                  >
                    📥 Export PNG
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-2"
                    onClick={async () => {
                      if (!boardCardRef.current) return
                      const blob = await exportNodeToBlob(boardCardRef.current)
                      const shared = await shareImage(blob)
                      if (!shared) {
                        saveAs(blob, 'design.png')
                      }
                    }}
                  >
                    📤 Share
        </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Takes up 1/4 of the space */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <FiltersPanel value={filters} onChange={setFilters} disabled={!imageUrl} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <FurnitureLibrary
                  onDragStart={() => {}} // Handled by the library itself
                  disabled={!imageUrl}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      </div>
  )
}

export default App
