import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { NewTemplateForm } from '@/components/admin/NewTemplateForm'

export const metadata: Metadata = { title: 'Tambah Template Baru' }

export default async function NewTemplatePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Tambah Template Baru</h1>
      <NewTemplateForm categories={categories} />
    </div>
  )
}
