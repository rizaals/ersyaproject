'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getPrice, formatRupiah } from '@/lib/pricing'
import type { Template, Category } from '@prisma/client'

type TemplateWithCategory = Template & { category: Category }

const PACKAGES = ['basic', 'standard', 'premium'] as const

const LP_BRIEF_FIELDS = [
  { key: 'business_name', label: 'Nama Bisnis/Brand', required: true, placeholder: 'Contoh: Toko Baju Keren' },
  { key: 'tagline', label: 'Tagline / Slogan', required: false, placeholder: 'Contoh: Tampil Kece Setiap Hari' },
  { key: 'color_scheme', label: 'Warna yang diinginkan', required: false, placeholder: 'Contoh: merah & putih, atau #FF0000' },
  { key: 'products', label: 'Produk/Layanan yang ditawarkan', required: true, placeholder: 'Deskripsi singkat produk/layanan Anda' },
  { key: 'target_audience', label: 'Target Audiens', required: false, placeholder: 'Contoh: wanita 20-35 tahun, suka fashion' },
  { key: 'contact_info', label: 'Info Kontak (WA/Email/Sosmed)', required: true, placeholder: 'Contoh: WA 081234567890, IG @tokobajukeren' },
  { key: 'additional_notes', label: 'Catatan Tambahan', required: false, placeholder: 'Hal lain yang ingin disampaikan ke tim', multiline: true },
]

const EMAIL_BRIEF_FIELDS = [
  { key: 'brand_name', label: 'Nama Brand/Pengirim', required: true, placeholder: 'Contoh: Toko Baju Keren' },
  { key: 'email_subject', label: 'Judul Email (Subject)', required: true, placeholder: 'Contoh: Promo Akhir Tahun — Diskon 50%!' },
  { key: 'email_purpose', label: 'Tujuan Email', required: true, placeholder: 'Contoh: promosi produk baru, newsletter bulanan, dsb' },
  { key: 'main_content', label: 'Konten Utama', required: true, placeholder: 'Deskripsi isi email yang ingin disampaikan', multiline: true },
  { key: 'cta_text', label: 'Tombol CTA (Call to Action)', required: false, placeholder: 'Contoh: Belanja Sekarang, Klik di Sini' },
  { key: 'cta_url', label: 'Link CTA', required: false, placeholder: 'https://tokobajukeren.com' },
  { key: 'color_scheme', label: 'Warna yang diinginkan', required: false, placeholder: 'Contoh: merah & putih' },
  { key: 'additional_notes', label: 'Catatan Tambahan', required: false, placeholder: 'Hal lain untuk tim', multiline: true },
]

interface OrderFormProps {
  template: TemplateWithCategory
  defaultPackage: string
}

export function OrderForm({ template, defaultPackage }: OrderFormProps) {
  const router = useRouter()
  const [selectedPkg, setSelectedPkg] = useState(defaultPackage)
  const [brief, setBrief] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const fields = template.serviceType === 'email' ? EMAIL_BRIEF_FIELDS : LP_BRIEF_FIELDS

  const updateBrief = (key: string, value: string) =>
    setBrief((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate required fields
    const missing = fields.filter((f) => f.required && !brief[f.key]?.trim())
    if (missing.length > 0) {
      toast.error(`Field wajib belum diisi: ${missing.map((f) => f.label).join(', ')}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, package: selectedPkg, brief, price: getPrice(template.serviceType as any, selectedPkg) }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal membuat order')
      } else {
        toast.success('Order berhasil dibuat!')
        router.push(`/portal/orders/${data.data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Template summary */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border bg-card p-4 sticky top-20">
          <h3 className="font-semibold text-sm mb-3">Template Dipilih</h3>
          <div className="rounded-lg overflow-hidden aspect-[4/3] bg-muted mb-3">
            {template.thumbnailUrl && (
              <Image src={template.thumbnailUrl} alt={template.name} width={400} height={300} className="object-cover object-top w-full h-full" />
            )}
          </div>
          <p className="font-medium text-sm">{template.name}</p>
          <p className="text-xs text-muted-foreground">{template.category.name}</p>

          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pilih Paket</p>
            <div className="space-y-1.5">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                    selectedPkg === pkg
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'hover:bg-accent'
                  )}
                >
                  {selectedPkg === pkg && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  <span className="capitalize flex-1 text-left">{pkg}</span>
                  <span className="text-xs opacity-70">{formatRupiah(getPrice(template.serviceType as any, pkg))}</span>
                </button>
              ))}
            </div>
          </div>

          <Link href={`/templates/${template.slug}`} className="mt-3 text-xs text-brand hover:underline block text-center">
            Ganti template
          </Link>
        </div>
      </div>

      {/* Brief form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Isi Brief Desain</h3>
          <p className="text-xs text-muted-foreground">
            Semakin detail brief Anda, semakin tepat hasil yang kami buat. Field bertanda * wajib diisi.
          </p>

          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium block mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {(field as any).multiline ? (
                <textarea
                  value={brief[field.key] ?? ''}
                  onChange={(e) => updateBrief(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={brief[field.key] ?? ''}
                  onChange={(e) => updateBrief(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Buat Order & Lanjut ke Pembayaran
        </button>
      </form>
    </div>
  )
}
