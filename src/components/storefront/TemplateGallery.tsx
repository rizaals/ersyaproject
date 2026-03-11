'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TemplateCard } from './TemplateCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LayoutGrid, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Template, Category } from '@prisma/client'
import { useCallback, useState } from 'react'

type TemplateWithCategory = Template & { category: Category }

interface TemplateGalleryProps {
  templates: TemplateWithCategory[]
  total: number
  totalPages: number
  currentPage: number
  categories: Category[]
  serviceType: string
}

export function TemplateGallery({
  templates,
  total,
  totalPages,
  currentPage,
  categories,
  serviceType,
}: TemplateGalleryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('q', search)
  }

  const activeCategory = searchParams.get('category') ?? ''

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          {serviceType === 'email' ? 'Email Template' : 'Landing Page'} Gallery
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {total} template tersedia
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filter */}
        <aside className="lg:w-56 shrink-0">
          {/* Service type */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Layanan</p>
            <div className="space-y-1">
              {(['landing_page', 'email'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateParam('type', type)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                    serviceType === type
                      ? 'bg-brand/10 text-brand font-medium'
                      : 'hover:bg-accent'
                  )}
                >
                  {type === 'landing_page' ? 'Landing Page' : 'Email Template'}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Kategori</p>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', '')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  !activeCategory ? 'bg-brand/10 text-brand font-medium' : 'hover:bg-accent'
                )}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                    activeCategory === cat.slug ? 'bg-brand/10 text-brand font-medium' : 'hover:bg-accent'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari template..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              Cari
            </button>
          </form>

          {/* Grid */}
          {templates.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              title="Template tidak ditemukan"
              description="Coba ubah filter atau kata kunci pencarian."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {templates.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', String(p))
                        router.push(`${pathname}?${params.toString()}`)
                      }}
                      className={cn(
                        'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                        p === currentPage
                          ? 'bg-brand text-white'
                          : 'border hover:bg-accent'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
