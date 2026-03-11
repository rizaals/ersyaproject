import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OrderButton } from '@/components/storefront/OrderButton'
import { Eye, ArrowLeft, Tag } from 'lucide-react'

interface Props {
  params: { slug: string }
}

async function getTemplate(slug: string) {
  return prisma.template.findFirst({
    where: { slug, status: 'active' },
    include: { category: true },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTemplate(params.slug)
  if (!t) return { title: 'Template tidak ditemukan' }
  return {
    title: t.name,
    description: t.description ?? `Template ${t.serviceType === 'email' ? 'email' : 'landing page'} profesional — ${t.category.name}`,
  }
}

const SERVICE_LABEL: Record<string, string> = {
  landing_page: 'Landing Page',
  email: 'Email Template',
}

const PACKAGE_FEATURES: Record<string, string[]> = {
  basic: ['Konten sesuai brief', '1x revisi', 'File HTML siap pakai', '2–3 hari kerja'],
  standard: ['Konten sesuai brief', '3x revisi', 'File HTML + subdomain gratis', '1–2 hari kerja'],
  premium: ['Custom dari nol', 'Revisi tidak terbatas', 'Hosting + domain sendiri', '1 hari kerja'],
}

export default async function TemplateDetailPage({ params }: Props) {
  const template = await getTemplate(params.slug)
  if (!template) notFound()

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/templates" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Gallery
        </Link>
        <span>/</span>
        <span>{template.category.name}</span>
        <span>/</span>
        <span className="text-foreground font-medium">{template.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Preview */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border overflow-hidden bg-muted aspect-[4/3] relative">
            {template.thumbnailUrl ? (
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                Preview tidak tersedia
              </div>
            )}
          </div>

          {template.previewUrl && (
            <a
              href={template.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 border py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              <Eye className="h-4 w-4" /> Buka Preview
            </a>
          )}
        </div>

        {/* Info & Order */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-2.5 py-0.5 rounded-full font-medium">
                <Tag className="h-3 w-3" /> {SERVICE_LABEL[template.serviceType]}
              </span>
              <span className="text-xs text-muted-foreground">{template.category.name}</span>
            </div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            {template.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{template.description}</p>
            )}
          </div>

          {/* Packages */}
          <div className="space-y-3">
            <h2 className="font-semibold text-sm">Pilih Paket</h2>
            {Object.entries(PACKAGE_FEATURES).map(([pkg, features]) => (
              <div key={pkg} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold capitalize">{pkg}</span>
                  <OrderButton templateSlug={template.slug} packageName={pkg} />
                </div>
                <ul className="space-y-1">
                  {features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-brand/60 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ inline */}
          <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
            <p className="font-medium">Ada pertanyaan?</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Hubungi tim kami via WhatsApp untuk konsultasi gratis sebelum memesan.
            </p>
            <a
              href="https://wa.me/62XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
            >
              Chat WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
