import Link from 'next/link'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Logo size="md" />
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Platform jasa pembuatan landing page &amp; email template profesional untuk UMKM dan pelaku usaha Indonesia.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} ersya projects. All rights reserved.
          </p>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Layanan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/templates?type=landing_page" className="hover:text-foreground transition-colors">Landing Page</Link></li>
            <li><Link href="/templates?type=email" className="hover:text-foreground transition-colors">Email Template</Link></li>
            <li><Link href="/home#harga" className="hover:text-foreground transition-colors">Paket Harga</Link></li>
            <li><Link href="/home#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Akun */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Akun</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/register" className="hover:text-foreground transition-colors">Daftar</Link></li>
            <li><Link href="/login" className="hover:text-foreground transition-colors">Masuk</Link></li>
            <li><Link href="/portal/dashboard" className="hover:text-foreground transition-colors">Client Portal</Link></li>
            <li>
              <a href="https://wa.me/62XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
