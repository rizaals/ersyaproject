'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Berapa lama proses pengerjaannya?',
    a: 'Tergantung paket yang dipilih. Paket Basic 2–3 hari kerja, Standard 1–2 hari, Premium 1 hari. Waktu mulai dihitung setelah brief dan pembayaran dikonfirmasi.',
  },
  {
    q: 'Apakah saya bisa preview template sebelum memesan?',
    a: 'Ya! Setiap template memiliki tombol Preview untuk melihat tampilan langsung. Anda bisa keliling dulu sebelum memutuskan.',
  },
  {
    q: 'Bagaimana alur pemesanan?',
    a: 'Daftar/login → pilih template → isi brief (konten, warna, logo) → bayar → tim kami kerjakan → Anda terima hasil & bisa minta revisi.',
  },
  {
    q: 'Format pembayaran apa yang tersedia?',
    a: 'Kami menerima transfer bank, GoPay, OVO, DANA, dan kartu kredit via Midtrans.',
  },
  {
    q: 'Apakah saya bisa request template di luar yang tersedia?',
    a: 'Tentu! Paket Premium mendukung custom desain dari nol. Hubungi kami via WhatsApp untuk diskusi lebih lanjut.',
  },
  {
    q: 'Setelah selesai, apakah ada biaya hosting?',
    a: 'Untuk paket Standard ke atas, kami sediakan subdomain gratis 1 tahun (.ersya.id). Setelah itu Anda bisa perpanjang atau pindah ke hosting sendiri.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-medium text-sm">{q}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="container py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-brand mb-1">FAQ</p>
        <h2 className="text-2xl md:text-3xl font-bold">Pertanyaan Umum</h2>
      </div>
      <div className="max-w-2xl mx-auto rounded-xl border bg-card px-6">
        {FAQS.map((faq) => (
          <FaqItem key={faq.q} {...faq} />
        ))}
      </div>
    </section>
  )
}
