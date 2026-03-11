import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ersya projects — Landing Page & Email Template Profesional',
    template: '%s | ersya projects',
  },
  description: 'Platform jasa pembuatan landing page & email template profesional untuk UMKM Indonesia. Tampil profesional online — tanpa coding, langsung aktif.',
  keywords: ['landing page', 'email template', 'jasa website', 'UMKM', 'Indonesia'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ersya-projects.id',
    siteName: 'ersya projects',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
