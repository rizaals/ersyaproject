import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TemplateCard } from '@/components/storefront/TemplateCard'
import { CategoryTabs } from '@/components/storefront/CategoryTabs'
import { HeroSection } from '@/components/storefront/HeroSection'
import { PricingSection } from '@/components/storefront/PricingSection'
import { FaqSection } from '@/components/storefront/FaqSection'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Beranda',
}

async function getFeaturedTemplates() {
  return prisma.template.findMany({
    where: { status: 'active' },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function HomePage() {
  const [templates, categories] = await Promise.all([
    getFeaturedTemplates(),
    getCategories(),
  ])

  const lpCategories = categories.filter((c) => c.serviceType === 'landing_page')
  const emailCategories = categories.filter((c) => c.serviceType === 'email')

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Featured Landing Pages */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-brand mb-1">Template Landing Page</p>
            <h2 className="text-2xl md:text-3xl font-bold">Pilihan Terpopuler</h2>
          </div>
          <Link
            href="/templates?type=landing_page"
            className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <CategoryTabs
          lpCategories={lpCategories}
          emailCategories={emailCategories}
          templates={templates}
        />
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <FaqSection />

      {/* CTA Bottom */}
      <section className="bg-brand py-16">
        <div className="container text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Siap tampil profesional?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Daftar sekarang dan pesan template pertama Anda — proses cepat, hasil memuaskan.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold px-6 py-3 rounded-lg hover:bg-brand-subtle transition-colors"
          >
            Mulai Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
