import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Wand2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TemplateStatus } from '@prisma/client'

export const metadata: Metadata = { title: 'Template Library' }

const STATUS_STYLE: Record<TemplateStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  archived: 'bg-red-100 text-red-800',
}

export default async function AdminTemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  const lpTemplates = templates.filter((t) => t.serviceType === 'landing_page')
  const emailTemplates = templates.filter((t) => t.serviceType === 'email')

  function TemplateGrid({ items, title }: { items: typeof templates; title: string }) {
    return (
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{title} ({items.length})</h2>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
            Belum ada template. Klik "Tambah Template" untuk mulai.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((t) => (
              <div key={t.id} className="rounded-xl border bg-card overflow-hidden group">
                <div className="relative aspect-[4/3] bg-muted">
                  {t.thumbnailUrl ? (
                    <Image src={t.thumbnailUrl} alt={t.name} fill className="object-cover object-top" sizes="300px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground/50">No preview</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/builder/${t.id}`}
                      className="flex items-center gap-1 bg-brand text-white text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-brand-dark"
                    >
                      <Wand2 className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0', STATUS_STYLE[t.status])}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.category.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Template Library</h1>
        <Link
          href="/admin/templates/new"
          className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Template
        </Link>
      </div>

      <TemplateGrid items={lpTemplates} title="Landing Page" />
      <TemplateGrid items={emailTemplates} title="Email Template" />
    </div>
  )
}
