import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard Client' }

async function getPortalData(userId: string) {
  const [orders, stats] = await Promise.all([
    prisma.order.findMany({
      where: { customerId: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { template: { select: { name: true, thumbnailUrl: true } } },
    }),
    prisma.order.groupBy({
      by: ['status'],
      where: { customerId: userId },
      _count: true,
    }),
  ])
  return { orders, stats }
}

export default async function PortalDashboardPage() {
  const session = await auth()
  const { orders, stats } = await getPortalData(session!.user.id)

  const statsMap = Object.fromEntries(stats.map((s) => [s.status, s._count]))
  const totalOrders = stats.reduce((sum, s) => sum + s._count, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Halo, {session!.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pantau progress order Anda di sini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Order', value: totalOrders, icon: ShoppingBag, color: 'text-brand' },
          { label: 'Dalam Proses', value: (statsMap['in_progress'] ?? 0) + (statsMap['review'] ?? 0), icon: Clock, color: 'text-yellow-500' },
          { label: 'Selesai', value: statsMap['done'] ?? 0, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Menunggu Bayar', value: statsMap['awaiting_payment'] ?? 0, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Order Terbaru</h2>
          <Link href="/portal/orders" className="text-xs text-brand hover:underline flex items-center gap-1">
            Lihat semua <ArrowRight className="h-3 w-3" />
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
          <div className="divide-y">
            {orders.map((order) => (
              <Link key={order.id} href={`/portal/orders/${order.id}`} className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-muted shrink-0 overflow-hidden">
                  {order.template?.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={order.template.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{order.template?.name ?? 'Template dihapus'}</p>
                  <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
                </div>
                <StatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
