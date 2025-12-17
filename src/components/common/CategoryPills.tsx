'use client'

import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface CategoryPillsProps {
  categories: Category[]
  selected: string
  onSelect: (id: string) => void
  activeColor?: 'amber' | 'rose' | 'indigo' | 'emerald'
}

const colorMap = {
  amber: 'bg-amber-50 border-amber-500 text-amber-600',
  rose: 'bg-rose-50 border-rose-500 text-rose-600',
  indigo: 'bg-indigo-50 border-indigo-500 text-indigo-600',
  emerald: 'bg-emerald-50 border-emerald-500 text-emerald-600',
}

export function CategoryPills({ 
  categories, 
  selected, 
  onSelect, 
  activeColor = 'amber' 
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border',
            selected === cat.id
              ? colorMap[activeColor]
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
