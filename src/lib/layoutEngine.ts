
import { FURNITURE_ITEMS } from '../components/FurnitureLibrary'
import type { PlacedFurniture } from '../components/InteractiveCanvas'
import type { FiltersState } from '../components/FiltersPanel'

export type LayoutSuggestion = {
  id: string
  name: string
  description: string
  furniture: PlacedFurniture[]
  score: number // 0-100, how good this layout is
}

// Room layout templates based on room type and goals
const LAYOUT_TEMPLATES = {
  room: {
    minimal: [
      { item: 'sofa', x: 0.1, y: 0.3, rotation: 0 },
      { item: 'coffee-table', x: 0.3, y: 0.5, rotation: 0 },
      { item: 'tv', x: 0.7, y: 0.2, rotation: 0 },
    ],
    storage: [
      { item: 'bookshelf', x: 0.05, y: 0.1, rotation: 0 },
      { item: 'cabinet', x: 0.8, y: 0.1, rotation: 0 },
      { item: 'sofa', x: 0.2, y: 0.4, rotation: 0 },
      { item: 'coffee-table', x: 0.4, y: 0.6, rotation: 0 },
    ],
    showcase: [
      { item: 'sofa', x: 0.15, y: 0.3, rotation: 0 },
      { item: 'armchair', x: 0.6, y: 0.2, rotation: 45 },
      { item: 'coffee-table', x: 0.35, y: 0.5, rotation: 0 },
      { item: 'lamp', x: 0.1, y: 0.1, rotation: 0 },
      { item: 'plant', x: 0.8, y: 0.8, rotation: 0 },
    ],
    workflow: [
      { item: 'desk', x: 0.1, y: 0.2, rotation: 0 },
      { item: 'chair', x: 0.2, y: 0.4, rotation: 0 },
      { item: 'bookshelf', x: 0.7, y: 0.1, rotation: 0 },
      { item: 'lamp', x: 0.15, y: 0.15, rotation: 0 },
    ]
  },
  closet: {
    minimal: [
      { item: 'wardrobe', x: 0.1, y: 0.1, rotation: 0 },
      { item: 'dresser', x: 0.6, y: 0.2, rotation: 0 },
    ],
    storage: [
      { item: 'wardrobe', x: 0.05, y: 0.05, rotation: 0 },
      { item: 'dresser', x: 0.4, y: 0.1, rotation: 0 },
      { item: 'cabinet', x: 0.7, y: 0.1, rotation: 0 },
      { item: 'mirror', x: 0.2, y: 0.6, rotation: 0 },
    ],
    showcase: [
      { item: 'wardrobe', x: 0.1, y: 0.1, rotation: 0 },
      { item: 'dresser', x: 0.5, y: 0.2, rotation: 0 },
      { item: 'mirror', x: 0.3, y: 0.6, rotation: 0 },
      { item: 'lamp', x: 0.8, y: 0.3, rotation: 0 },
    ],
    workflow: [
      { item: 'wardrobe', x: 0.05, y: 0.05, rotation: 0 },
      { item: 'dresser', x: 0.4, y: 0.1, rotation: 0 },
      { item: 'mirror', x: 0.2, y: 0.5, rotation: 0 },
    ]
  },
  kitchen: {
    minimal: [
      { item: 'refrigerator', x: 0.1, y: 0.1, rotation: 0 },
      { item: 'dining-table', x: 0.4, y: 0.3, rotation: 0 },
      { item: 'chair', x: 0.5, y: 0.5, rotation: 0 },
    ],
    storage: [
      { item: 'refrigerator', x: 0.05, y: 0.05, rotation: 0 },
      { item: 'cabinet', x: 0.3, y: 0.1, rotation: 0 },
      { item: 'dining-table', x: 0.5, y: 0.4, rotation: 0 },
      { item: 'chair', x: 0.6, y: 0.6, rotation: 0 },
      { item: 'chair', x: 0.4, y: 0.6, rotation: 0 },
    ],
    showcase: [
      { item: 'refrigerator', x: 0.1, y: 0.1, rotation: 0 },
      { item: 'dining-table', x: 0.3, y: 0.3, rotation: 0 },
      { item: 'chair', x: 0.4, y: 0.5, rotation: 0 },
      { item: 'chair', x: 0.2, y: 0.5, rotation: 0 },
      { item: 'lamp', x: 0.8, y: 0.2, rotation: 0 },
    ],
    workflow: [
      { item: 'refrigerator', x: 0.05, y: 0.05, rotation: 0 },
      { item: 'dining-table', x: 0.3, y: 0.2, rotation: 0 },
      { item: 'chair', x: 0.4, y: 0.4, rotation: 0 },
      { item: 'cabinet', x: 0.6, y: 0.1, rotation: 0 },
    ]
  }
}

function getLayoutKey(_roomType: string, goals: string[]): 'minimal' | 'storage' | 'showcase' | 'workflow' {
  if (goals.includes('maximize-storage')) return 'storage'
  if (goals.includes('showcase')) return 'showcase'
  if (goals.includes('workflow')) return 'workflow'
  return 'minimal'
}

function calculateLayoutScore(furniture: PlacedFurniture[], roomType: string, goals: string[]): number {
  let score = 50 // base score
  
  // Check for furniture variety
  const categories = new Set(furniture.map(f => f.item.category))
  score += categories.size * 5
  
  // Check for proper spacing (no overlaps)
  const hasOverlaps = checkOverlaps(furniture)
  if (!hasOverlaps) score += 20
  
  // Room-specific scoring
  if (roomType === 'room') {
    if (furniture.some(f => f.item.category === 'seating')) score += 15
    if (furniture.some(f => f.item.category === 'table')) score += 10
  } else if (roomType === 'closet') {
    if (furniture.some(f => f.item.category === 'storage')) score += 20
  } else if (roomType === 'kitchen') {
    if (furniture.some(f => f.item.id === 'refrigerator')) score += 15
    if (furniture.some(f => f.item.category === 'table')) score += 15
  }
  
  // Goal-specific scoring
  if (goals.includes('maximize-storage')) {
    const storageCount = furniture.filter(f => f.item.category === 'storage').length
    score += storageCount * 8
  }
  
  if (goals.includes('showcase')) {
    const decorCount = furniture.filter(f => f.item.category === 'decor').length
    score += decorCount * 5
  }
  
  return Math.min(100, Math.max(0, score))
}

function checkOverlaps(furniture: PlacedFurniture[]): boolean {
  for (let i = 0; i < furniture.length; i++) {
    for (let j = i + 1; j < furniture.length; j++) {
      const f1 = furniture[i]
      const f2 = furniture[j]
      
      const overlap = !(
        f1.x + f1.item.width < f2.x ||
        f2.x + f2.item.width < f1.x ||
        f1.y + f1.item.height < f2.y ||
        f2.y + f2.item.height < f1.y
      )
      
      if (overlap) return true
    }
  }
  return false
}

function generateVariations(baseLayout: any[], roomWidth: number, roomHeight: number, density: number): PlacedFurniture[] {
  const variations = []
  
  for (const item of baseLayout) {
    const furnitureItem = FURNITURE_ITEMS.find(f => f.id === item.item)
    if (!furnitureItem) continue
    
    // Apply density scaling
    const scale = 0.8 + (density / 100) * 0.4 // 0.8 to 1.2
    
    // Add some randomness to positions
    const jitterX = (Math.random() - 0.5) * 0.1
    const jitterY = (Math.random() - 0.5) * 0.1
    
    const x = Math.max(0, Math.min(roomWidth - furnitureItem.width * scale, (item.x + jitterX) * roomWidth))
    const y = Math.max(0, Math.min(roomHeight - furnitureItem.height * scale, (item.y + jitterY) * roomHeight))
    
    variations.push({
      id: `${furnitureItem.id}-${Date.now()}-${Math.random()}`,
      item: furnitureItem,
      x,
      y,
      rotation: item.rotation + (Math.random() - 0.5) * 30, // ±15 degrees
      scale
    })
  }
  
  return variations
}

export function generateLayoutSuggestions(
  roomWidth: number,
  roomHeight: number,
  filters: FiltersState
): LayoutSuggestion[] {
  const suggestions: LayoutSuggestion[] = []
  const layoutKey = getLayoutKey(filters.roomType, filters.goals)
  const roomTemplates = LAYOUT_TEMPLATES[filters.roomType as keyof typeof LAYOUT_TEMPLATES]
  const baseLayout = roomTemplates?.[layoutKey] || LAYOUT_TEMPLATES.room.minimal
  
  // Generate 3-5 variations
  const numSuggestions = 3 + Math.floor(Math.random() * 3)
  
  for (let i = 0; i < numSuggestions; i++) {
    const furniture = generateVariations(baseLayout, roomWidth, roomHeight, filters.density)
    const score = calculateLayoutScore(furniture, filters.roomType, filters.goals)
    
    suggestions.push({
      id: `suggestion-${i}`,
      name: `${filters.roomType.charAt(0).toUpperCase() + filters.roomType.slice(1)} Layout ${i + 1}`,
      description: getLayoutDescription(layoutKey, score),
      furniture,
      score
    })
  }
  
  // Sort by score (best first)
  return suggestions.sort((a, b) => b.score - a.score)
}

function getLayoutDescription(layoutKey: 'minimal' | 'storage' | 'showcase' | 'workflow', score: number): string {
  const descriptions = {
    minimal: 'Clean and spacious with essential furniture only',
    storage: 'Optimized for maximum storage capacity',
    showcase: 'Designed to highlight and display items beautifully',
    workflow: 'Arranged for efficient daily activities'
  }
  
  const quality = score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Basic'
  return `${descriptions[layoutKey]}. ${quality} layout score.`
}

export function applyLayoutSuggestion(
  suggestion: LayoutSuggestion
): PlacedFurniture[] {
  // For now, replace all furniture with the suggestion
  // In a more advanced version, we could merge intelligently
  return suggestion.furniture
}
