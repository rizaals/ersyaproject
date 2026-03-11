'use client'

import { useState } from 'react'
import { TemplateCard } from './TemplateCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Template, Category } from '@prisma/client'

type TemplateWithCategory = Template & { category: Category }

interface CategoryTabsProps {
  lpCategories: Category[]
  emailCategories: Category[]
  templates: TemplateWithCategory[]
}

export function CategoryTabs({ lpCategories, emailCategories, templates }: CategoryTabsProps) {
  const [activeService, setActiveService] = useState<'landing_page' | 'email'>('landing_page')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = activeService === 'landing_page' ? lpCategories : emailCategories

  const filtered = templates.filter((t) => {
    if (t.serviceType !== activeService) return false
    if (activeCategory !== 'all' && t.categoryId !== activeCategory) return false
    return true
  })

  return (
    <div>
      {/* Service type toggle */}
      <div className="flex gap-2 mb-6">
        {(['landing_page', 'email'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setActiveService(type); setActiveCategory('all') }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeService === type
                ? 'bg-brand text-white'
                : 'border hover:bg-accent'
            )}
          >
            {type === 'landing_page' ? 'Landing Page' : 'Email Template'}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-foreground text-background'
              : 'border hover:bg-accent'
          )}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              activeCategory === cat.id
                ? 'bg-foreground text-background'
                : 'border hover:bg-accent'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Belum ada template"
          description="Template di kategori ini sedang dalam persiapan. Cek lagi nanti!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}
