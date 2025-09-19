import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import clsx from 'classnames'
import { FurnitureItem } from './FurnitureLibrary'

export type PlacedFurniture = {
  id: string
  item: FurnitureItem
  x: number // position in pixels
  y: number // position in pixels
  rotation: number // in degrees
  scale: number
}

type InteractiveCanvasProps = {
  imageUrl: string | null
  onImageUpload: (url: string) => void
  placedFurniture: PlacedFurniture[]
  onFurnitureAdd: (furniture: PlacedFurniture) => void
  onFurnitureUpdate: (id: string, updates: Partial<PlacedFurniture>) => void
  onFurnitureRemove: (id: string) => void
  showGrid: boolean
}

export function InteractiveCanvas({
  imageUrl,
  onImageUpload,
  placedFurniture,
  onFurnitureAdd,
  onFurnitureUpdate,
  onFurnitureRemove,
  showGrid
}: InteractiveCanvasProps) {
  const [draggedItem, setDraggedItem] = useState<FurnitureItem | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onImageUpload(url)
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    onDrop
  })

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleCanvasDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (!draggedItem || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newFurniture: PlacedFurniture = {
      id: `${draggedItem.id}-${Date.now()}`,
      item: draggedItem,
      x: Math.max(0, Math.min(rect.width - draggedItem.width, x - draggedItem.width / 2)),
      y: Math.max(0, Math.min(rect.height - draggedItem.height, y - draggedItem.height / 2)),
      rotation: 0,
      scale: 1
    }
    
    onFurnitureAdd(newFurniture)
    setDraggedItem(null)
  }, [draggedItem, onFurnitureAdd])

  const handleFurnitureDrag = useCallback((id: string, e: React.DragEvent) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const furniture = placedFurniture.find(f => f.id === id)
    if (!furniture) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    onFurnitureUpdate(id, {
      x: Math.max(0, Math.min(rect.width - furniture.item.width, x - furniture.item.width / 2)),
      y: Math.max(0, Math.min(rect.height - furniture.item.height, y - furniture.item.height / 2))
    })
  }, [placedFurniture, onFurnitureUpdate])

  const gridBackground = showGrid ? {
    backgroundImage:
      `linear-gradient(to right, rgba(245, 158, 11, 0.15) 1px, transparent 1px),` +
      `linear-gradient(to bottom, rgba(245, 158, 11, 0.15) 1px, transparent 1px)`,
    backgroundSize: `24px 24px`,
  } : {}

  const dropClasses = clsx(
    'relative w-full aspect-video rounded-xl border-2 border-dashed transition-all',
    'bg-brand-50/60',
    {
      'border-yellow-400 shadow-[0_0_0_4px_rgba(245,158,11,0.15)]': isDragActive || dragOver,
      'border-red-400': isDragReject,
      'border-yellow-300': !isDragActive && !isDragReject && !dragOver,
    }
  )

  return (
    <div className="w-full">
      <div
        ref={canvasRef}
        {...getRootProps({ className: dropClasses })}
        onDragOver={handleCanvasDragOver}
        onDragLeave={handleCanvasDragLeave}
        onDrop={handleCanvasDrop}
        style={gridBackground}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence initial={false}>
          {!imageUrl && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-center px-6"
            >
              <div>
                <div className="text-6xl mb-4">📸</div>
                <p className="text-slate-700 font-medium text-lg">Drag & drop an image here, or click to browse</p>
                <p className="text-slate-500 text-sm mt-2">JPG, PNG, or WebP. Max 1 file.</p>
              </div>
            </motion.div>
          )}

          {imageUrl && (
            <motion.div
              key="canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden rounded-lg"
            >
              <img 
                src={imageUrl} 
                alt="Room" 
                className="w-full h-full object-contain"
                draggable={false}
              />
              
              {/* Placed Furniture */}
              <AnimatePresence>
                {placedFurniture.map(furniture => (
                  <motion.div
                    key={furniture.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    draggable
                    onDrag={(e) => handleFurnitureDrag(furniture.id, e)}
                    className="absolute cursor-move select-none"
                    style={{
                      left: furniture.x,
                      top: furniture.y,
                      width: furniture.item.width * furniture.scale,
                      height: furniture.item.height * furniture.scale,
                      transform: `rotate(${furniture.rotation}deg)`,
                    }}
                  >
                    <div className="w-full h-full bg-white/90 backdrop-blur-sm border-2 border-brand-400 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-2xl">{furniture.item.emoji}</span>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => onFurnitureRemove(furniture.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
