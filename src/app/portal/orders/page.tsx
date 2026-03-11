import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag, ArrowRight, Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Order Saya' }

export default async function PortalOrdersPage() {
  const session = await auth()

  const orders = await prisma.order.findMany({
    where: { customerId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      template: { select: { name: true, thumbnailUrl: true, serviceType: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Saya</h1>
        <Link
          href="/templates"
          className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Buat Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Belum ada order"
          description="Pilih template dan buat order pertama Anda."
          action={
            <Link href="/templates" className="bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
              Lihat Template
            </Link>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/portal/orders/${order.id}`}
              className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-lg bg-muted shrink-0 overflow-hidden">
                {order.template?.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={order.template.thumbnailUrl} alt="" className="h-full w-full object-cover object-top" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{order.template?.name ?? 'Template dihapus'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  #{order.orderNumber} · {order.package.charAt(0).toUpperCase() + order.package.slice(1)} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
