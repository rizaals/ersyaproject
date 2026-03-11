import Link from 'next/link'
import Image from 'next/image'
import { Eye, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Template, Category } from '@prisma/client'

type TemplateWithCategory = Template & { category: Category }

interface TemplateCardProps {
  template: TemplateWithCategory
  className?: string
}

const SERVICE_LABEL: Record<string, string> = {
  landing_page: 'Landing Page',
  email: 'Email Template',
}

export function TemplateCard({ template, className }: TemplateCardProps) {
  return (
    <div
      className={cn(
        'group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-brand/40 transition-all duration-200',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {template.thumbnailUrl ? (
          <Image
            src={template.thumbnailUrl}
            alt={template.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground/40 text-sm">Preview</div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          {template.previewUrl && (
            <a
              href={template.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-foreground text-xs font-medium px-3 py-2 rounded-lg hover:bg-brand-subtle transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </a>
          )}
          <Link
            href={`/templates/${template.slug}`}
            className="flex items-center gap-1.5 bg-brand text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Pesan
          </Link>
        </div>

        {/* Service type badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-background/90 text-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border">
            {SERVICE_LABEL[template.serviceType] ?? template.serviceType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{template.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{template.category.name}</p>
          </div>
        </div>
        {template.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
        )}
        <Link
          href={`/templates/${template.slug}`}
          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-brand text-brand text-xs font-medium py-2 hover:bg-brand hover:text-white transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  )
}
