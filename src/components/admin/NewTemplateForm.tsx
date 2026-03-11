'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Category } from '@prisma/client'

interface Props {
  categories: Category[]
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function NewTemplateForm({ categories }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    serviceType: 'landing_page',
    categoryId: '',
    thumbnailUrl: '',
    previewUrl: '',
  })
  const [loading, setLoading] = useState(false)

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value
    setForm((prev) => {
      const next: any = { ...prev, [key]: value }
      if (key === 'name') next.slug = slugify(value)
      return next
    })
  }

  const filteredCats = categories.filter((c) => c.serviceType === form.serviceType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug || !form.categoryId) {
      toast.error('Nama, slug, dan kategori wajib diisi')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal membuat template')
      } else {
        toast.success('Template berhasil dibuat! Buka builder untuk mendesain.')
        router.push(`/admin/builder/${data.data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4">
      {/* Service type */}
      <div>
        <label className="text-sm font-medium block mb-1.5">Jenis Layanan *</label>
        <select value={form.serviceType} onChange={update('serviceType')} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50">
          <option value="landing_page">Landing Page</option>
          <option value="email">Email Template</option>
        </select>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium block mb-1.5">Nama Template *</label>
        <input type="text" value={form.name} onChange={update('name')} placeholder="Contoh: Fashion Store Pro" required className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" />
      </div>

      {/* Slug */}
      <div>
        <label className="text-sm font-medium block mb-1.5">Slug (URL) *</label>
        <input type="text" value={form.slug} onChange={update('slug')} placeholder="fashion-store-pro" required className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 font-mono" />
        <p className="text-xs text-muted-foreground mt-1">URL: /templates/{form.slug || '...'}</p>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium block mb-1.5">Kategori *</label>
        <select value={form.categoryId} onChange={update('categoryId')} required className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50">
          <option value="">— Pilih kategori —</option>
          {filteredCats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium block mb-1.5">Deskripsi</label>
        <textarea value={form.description} onChange={update('description')} rows={3} placeholder="Deskripsi singkat template ini..." className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none" />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="text-sm font-medium block mb-1.5">URL Thumbnail</label>
        <input type="url" value={form.thumbnailUrl} onChange={update('thumbnailUrl')} placeholder="https://..." className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" />
        <p className="text-xs text-muted-foreground mt-1">Upload ke Cloudinary dulu, lalu tempel URL-nya di sini.</p>
      </div>

      {/* Preview URL */}
      <div>
        <label className="text-sm font-medium block mb-1.5">URL Preview Live</label>
        <input type="url" value={form.previewUrl} onChange={update('previewUrl')} placeholder="https://preview.ersya-projects.id/..." className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" />
      </div>

      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-2.5 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Buat Template & Buka Builder
      </button>
    </form>
  )
}
