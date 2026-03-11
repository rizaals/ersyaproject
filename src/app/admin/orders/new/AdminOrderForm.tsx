'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getPrice, formatRupiah } from '@/lib/pricing'

const PACKAGES = ['basic', 'standard', 'premium'] as const

const LP_BRIEF_FIELDS = [
  { key: 'business_name', label: 'Nama Bisnis/Brand', required: true, placeholder: 'Contoh: Toko Baju Keren' },
  { key: 'products', label: 'Produk/Layanan', required: true, placeholder: 'Deskripsi singkat produk/layanan' },
  { key: 'contact_info', label: 'Info Kontak', required: true, placeholder: 'WA 081234567890, IG @brand' },
  { key: 'additional_notes', label: 'Catatan Tambahan', required: false, placeholder: 'Catatan untuk tim', multiline: true },
]

const EMAIL_BRIEF_FIELDS = [
  { key: 'brand_name', label: 'Nama Brand', required: true, placeholder: 'Contoh: Toko Baju Keren' },
  { key: 'email_subject', label: 'Judul Email', required: true, placeholder: 'Promo Akhir Tahun' },
  { key: 'main_content', label: 'Konten Utama', required: true, placeholder: 'Isi email', multiline: true },
  { key: 'additional_notes', label: 'Catatan Tambahan', required: false, placeholder: 'Catatan untuk tim', multiline: true },
]

interface Props {
  customers: { id: string; name: string; email: string }[]
  templates: { id: string; name: string; serviceType: string; slug: string }[]
}

export function AdminOrderForm({ customers, templates }: Props) {
  const router = useRouter()
  const [customerId, setCustomerId] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [pkg, setPkg] = useState<string>('basic')
  const [customPrice, setCustomPrice] = useState('')
  const [brief, setBrief] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const selectedTemplate = templates.find((t) => t.id === templateId)
  const serviceType = selectedTemplate?.serviceType as 'landing_page' | 'email' | undefined
  const suggestedPrice = serviceType ? getPrice(serviceType, pkg) : 0
  const finalPrice = customPrice ? parseInt(customPrice.replace(/\D/g, ''), 10) : suggestedPrice
  const briefFields = serviceType === 'email' ? EMAIL_BRIEF_FIELDS : LP_BRIEF_FIELDS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) { toast.error('Pilih customer terlebih dahulu'); return }
    if (!templateId) { toast.error('Pilih template terlebih dahulu'); return }

    // For admin manual order: temporarily override customerId via a special admin endpoint
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, templateId, package: pkg, brief, price: finalPrice }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal membuat order')
      } else {
        toast.success('Order berhasil dibuat!')
        router.push(`/admin/orders/${data.data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* Customer */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-sm">Data Order</h2>

        <div>
          <label className="text-sm font-medium block mb-1.5">Customer <span className="text-red-500">*</span></label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="">— Pilih Customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Template <span className="text-red-500">*</span></label>
          <select
            value={templateId}
            onChange={(e) => { setTemplateId(e.target.value); setBrief({}) }}
            required
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="">— Pilih Template —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.serviceType === 'email' ? 'Email' : 'Landing Page'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Paket</label>
          <div className="flex gap-2">
            {PACKAGES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setPkg(p); setCustomPrice('') }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  pkg === p ? 'border-brand bg-brand/5 text-brand' : 'hover:bg-accent'
                }`}
              >
                <span className="capitalize block">{p}</span>
                {serviceType && (
                  <span className="text-xs opacity-70">{formatRupiah(getPrice(serviceType, p))}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Harga
            {suggestedPrice > 0 && !customPrice && (
              <span className="text-xs text-muted-foreground font-normal ml-1">(default: {formatRupiah(suggestedPrice)})</span>
            )}
          </label>
          <input
            type="text"
            value={customPrice || (suggestedPrice > 0 ? String(suggestedPrice) : '')}
            onChange={(e) => setCustomPrice(e.target.value.replace(/\D/g, ''))}
            placeholder="Masukkan harga (Rp)"
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          {finalPrice > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{formatRupiah(finalPrice)}</p>
          )}
        </div>
      </div>

      {/* Brief */}
      {selectedTemplate && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm">Brief</h2>
          {briefFields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium block mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {(field as any).multiline ? (
                <textarea
                  value={brief[field.key] ?? ''}
                  onChange={(e) => setBrief((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={brief[field.key] ?? ''}
                  onChange={(e) => setBrief((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !customerId || !templateId}
        className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Buat Order
      </button>
    </form>
  )
}
