import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { TemplateGallery } from '@/components/storefront/TemplateGallery'

export const metadata: Metadata = {
  title: 'Template Gallery',
  description: 'Ratusan template landing page & email siap pakai untuk bisnis Anda.',
}

interface SearchParams {
  type?: string
  category?: string
  q?: string
  page?: string
}

const PAGE_SIZE = 12

async function getData(searchParams: SearchParams) {
  const { type, category, q, page } = searchParams
  const serviceType = type === 'email' ? 'email' : 'landing_page'
  const currentPage = Math.max(1, parseInt(page ?? '1', 10))
  const skip = (currentPage - 1) * PAGE_SIZE

  const where = {
    status: 'active' as const,
    serviceType: serviceType as any,
    ...(category ? { category: { slug: category } } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
  }

  const [templates, total, categories] = await Promise.all([
    prisma.template.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.template.count({ where }),
    prisma.category.findMany({
      where: { serviceType: serviceType as any },
      orderBy: { name: 'asc' },
    }),
  ])

  return { templates, total, categories, currentPage, serviceType }
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const data = await getData(searchParams)
  return <TemplateGallery {...data} totalPages={Math.ceil(data.total / PAGE_SIZE)} />
}
