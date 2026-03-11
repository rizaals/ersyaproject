import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrderForm } from '@/components/portal/OrderForm'

export const metadata: Metadata = { title: 'Buat Order Baru' }

interface Props {
  searchParams: { template?: string; package?: string }
}

export default async function NewOrderPage({ searchParams }: Props) {
  if (!searchParams.template) notFound()

  const template = await prisma.template.findFirst({
    where: { slug: searchParams.template, status: 'active' },
    include: { category: true },
  })
  if (!template) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Buat Order Baru</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Isi brief di bawah ini agar tim kami bisa mengerjakan template sesuai keinginan Anda.
      </p>
      <OrderForm template={template as any} defaultPackage={searchParams.package ?? 'basic'} />
    </div>
  )
}
