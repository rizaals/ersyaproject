import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { GrapesBuilder } from '@/components/admin/GrapesBuilder'

export const metadata: Metadata = { title: 'Template Builder' }

type Props = { params: { id: string } }

export default async function BuilderPage({ params }: Props) {
  const template = await prisma.template.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!template) notFound()

  return (
    <div className="-m-6 lg:-m-8 h-screen flex flex-col">
      <GrapesBuilder template={template as any} />
    </div>
  )
}
