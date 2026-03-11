import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const BENEFITS = [
  'Tidak perlu coding',
  'Proses cepat 1–3 hari',
  'Revisi hingga puas',
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-subtle via-background to-background">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-brand/5 blur-2xl pointer-events-none" />

      <div className="container relative py-20 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </span>
          Tersedia landing page &amp; email template
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
          Website &amp; Email Profesional{' '}
          <span className="text-brand-gradient bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
            Tanpa Ribet
          </span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
          Kami yang desain, Anda yang promosi. Pilih template, kasih brief, dan terima
          hasil dalam 1–3 hari kerja.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-brand" />
              {b}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/templates?type=landing_page"
            className="inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
          >
            Lihat Template <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/home#harga"
            className="inline-flex items-center justify-center gap-2 border font-semibold px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Lihat Harga
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-8 border-t pt-10 w-full max-w-lg">
          {[
            { value: '100+', label: 'Template tersedia' },
            { value: '1–3 hr', label: 'Waktu pengerjaan' },
            { value: '100%', label: 'Kepuasan klien' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-brand">{stat.value}</span>
              <span className="text-xs text-muted-foreground mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
