import Link from 'next/link'
import { Check } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

const LP_PACKAGES = [
  {
    key: 'basic',
    name: 'Basic',
    price: 150000,
    features: [
      '1 halaman landing page',
      'Konten sesuai brief',
      '1x revisi',
      'File HTML siap pakai',
      'Waktu pengerjaan 2–3 hari',
    ],
    popular: false,
  },
  {
    key: 'standard',
    name: 'Standard',
    price: 300000,
    features: [
      '1 halaman landing page',
      'Konten sesuai brief',
      '3x revisi',
      'File HTML + hosting subdomain',
      'Domain .ersya.id gratis 1 tahun',
      'Waktu pengerjaan 1–2 hari',
    ],
    popular: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 600000,
    features: [
      'Hingga 3 halaman',
      'Custom desain dari nol',
      'Revisi tidak terbatas',
      'Hosting + domain sendiri',
      'Integrasi form & WhatsApp',
      'Waktu pengerjaan 1 hari',
    ],
    popular: false,
  },
]

const EMAIL_PACKAGES = [
  {
    key: 'basic',
    name: 'Basic',
    price: 100000,
    features: [
      '1 email template',
      'Konten sesuai brief',
      '1x revisi',
      'File HTML siap upload',
      'Waktu pengerjaan 1–2 hari',
    ],
    popular: false,
  },
  {
    key: 'standard',
    name: 'Standard',
    price: 200000,
    features: [
      '1 email template',
      'Konten sesuai brief',
      '3x revisi',
      'File HTML + test kirim email',
      'Compatible Gmail, Outlook, dsb',
      'Waktu pengerjaan 1 hari',
    ],
    popular: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 400000,
    features: [
      'Hingga 3 email template',
      'Custom desain dari nol',
      'Revisi tidak terbatas',
      'Test kirim ke 5 email client',
      'Mobile responsive',
      'Waktu pengerjaan 1 hari',
    ],
    popular: false,
  },
]

function PricingCard({
  name,
  price,
  features,
  popular,
  serviceType,
}: (typeof LP_PACKAGES)[0] & { serviceType: string }) {
  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col ${
        popular ? 'border-brand shadow-lg shadow-brand/10 bg-card' : 'bg-card'
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full">
            Terpopuler
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatRupiah(price)}</span>
          <span className="text-sm text-muted-foreground">/project</span>
        </div>
      </div>
      <ul className="space-y-2.5 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-brand mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/templates?type=${serviceType}`}
        className={`w-full flex items-center justify-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
          popular
            ? 'bg-brand text-white hover:bg-brand-dark'
            : 'border hover:bg-accent'
        }`}
      >
        Pilih Paket
      </Link>
    </div>
  )
}

export function PricingSection() {
  return (
    <section id="harga" className="bg-muted/50 py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand mb-1">Harga Transparan</p>
          <h2 className="text-2xl md:text-3xl font-bold">Pilih Paket Sesuai Kebutuhan</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Tidak ada biaya tersembunyi. Bayar sekali, terima hasilnya.
          </p>
        </div>

        {/* Landing Page */}
        <div className="mb-12">
          <h3 className="text-center font-semibold text-lg mb-6">Landing Page</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {LP_PACKAGES.map(({ key, ...pkg }) => (
              <PricingCard key={key} {...pkg} serviceType="landing_page" />
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <h3 className="text-center font-semibold text-lg mb-6">Email Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {EMAIL_PACKAGES.map(({ key, ...pkg }) => (
              <PricingCard key={key} {...pkg} serviceType="email" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
