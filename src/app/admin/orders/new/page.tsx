import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminOrderForm } from './AdminOrderForm'

export const metadata: Metadata = { title: 'Buat Order Manual' }

export default async function AdminNewOrderPage() {
  const [customers, templates] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.template.findMany({
      where: { status: 'active' },
      select: { id: true, name: true, serviceType: true, slug: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Buat Order Manual</h1>
          <p className="text-sm text-muted-foreground">Buat order atas nama customer, pembayaran diproses offline</p>
        </div>
      </div>

      <AdminOrderForm customers={customers} templates={templates} />
    </div>
  )
}
