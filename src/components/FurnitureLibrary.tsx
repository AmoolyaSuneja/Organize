import { motion } from 'framer-motion'

export type FurnitureItem = {
  id: string
  name: string
  emoji: string
  width: number // in pixels
  height: number // in pixels
  category: 'seating' | 'storage' | 'table' | 'bed' | 'decor' | 'appliance'
}

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // Seating
  { id: 'sofa', name: 'Sofa', emoji: '🛋️', width: 120, height: 60, category: 'seating' },
  { id: 'chair', name: 'Chair', emoji: '🪑', width: 40, height: 40, category: 'seating' },
  { id: 'armchair', name: 'Armchair', emoji: '🪑', width: 50, height: 50, category: 'seating' },
  { id: 'stool', name: 'Stool', emoji: '🪑', width: 30, height: 30, category: 'seating' },
  
  // Storage
  { id: 'wardrobe', name: 'Wardrobe', emoji: '🚪', width: 60, height: 100, category: 'storage' },
  { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', width: 80, height: 120, category: 'storage' },
  { id: 'dresser', name: 'Dresser', emoji: '🗄️', width: 80, height: 60, category: 'storage' },
  { id: 'cabinet', name: 'Cabinet', emoji: '🗃️', width: 60, height: 80, category: 'storage' },
  
  // Tables
  { id: 'dining-table', name: 'Dining Table', emoji: '🪑', width: 100, height: 60, category: 'table' },
  { id: 'coffee-table', name: 'Coffee Table', emoji: '🪑', width: 80, height: 40, category: 'table' },
  { id: 'desk', name: 'Desk', emoji: '🪑', width: 100, height: 50, category: 'table' },
  { id: 'side-table', name: 'Side Table', emoji: '🪑', width: 40, height: 40, category: 'table' },
  
  // Beds
  { id: 'bed', name: 'Bed', emoji: '🛏️', width: 100, height: 80, category: 'bed' },
  { id: 'bunk-bed', name: 'Bunk Bed', emoji: '🛏️', width: 80, height: 100, category: 'bed' },
  
  // Appliances
  { id: 'tv', name: 'TV', emoji: '📺', width: 60, height: 40, category: 'appliance' },
  { id: 'refrigerator', name: 'Refrigerator', emoji: '🧊', width: 50, height: 80, category: 'appliance' },
  { id: 'washing-machine', name: 'Washing Machine', emoji: '🧺', width: 50, height: 60, category: 'appliance' },
  
  // Decor
  { id: 'lamp', name: 'Lamp', emoji: '💡', width: 20, height: 30, category: 'decor' },
  { id: 'plant', name: 'Plant', emoji: '🪴', width: 25, height: 25, category: 'decor' },
  { id: 'mirror', name: 'Mirror', emoji: '🪞', width: 40, height: 60, category: 'decor' },
]

type FurnitureLibraryProps = {
  onDragStart: (item: FurnitureItem) => void
  disabled?: boolean
}

export function FurnitureLibrary({ onDragStart, disabled }: FurnitureLibraryProps) {
  const categories = ['seating', 'storage', 'table', 'bed', 'appliance', 'decor'] as const
  
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Furniture Library</h3>
      <p className="text-xs text-slate-500 mb-4">Drag items onto your room to arrange them</p>
      
      <div className="space-y-4">
        {categories.map(category => {
          const items = FURNITURE_ITEMS.filter(item => item.category === category)
          if (items.length === 0) return null
          
          return (
            <div key={category}>
              <h4 className="text-xs font-medium text-slate-600 mb-2 capitalize">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    draggable={!disabled}
                    onDragStart={(e) => {
                      onDragStart(item)
                      // Create a custom drag image
                      const dragImage = document.createElement('div')
                      dragImage.innerHTML = `
                        <div style="
                          background: white;
                          border: 2px solid #f59e0b;
                          border-radius: 8px;
                          padding: 8px;
                          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                          font-size: 24px;
                          text-align: center;
                        ">
                          ${item.emoji}
                          <div style="font-size: 10px; color: #666; margin-top: 2px;">${item.name}</div>
                        </div>
                      `
                      dragImage.style.position = 'absolute'
                      dragImage.style.top = '-1000px'
                      document.body.appendChild(dragImage)
                      e.dataTransfer.setDragImage(dragImage, 50, 50)
                      setTimeout(() => document.body.removeChild(dragImage), 0)
                    }}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all
                      ${disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'border-yellow-200 hover:border-yellow-300 hover:bg-brand-50 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="w-8 h-8 bg-white rounded-md border border-yellow-200 flex items-center justify-center text-lg shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.width}×{item.height}px</div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.category}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
