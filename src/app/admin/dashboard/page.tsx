import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ShoppingBag, Clock, CheckCircle2, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

async function getDashboardData() {
  const [orderStats, recentOrders, totalUsers] = await Promise.all([
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        template: { select: { name: true } },
        customer: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
      },
    }),
    prisma.user.count({ where: { role: 'customer' } }),
  ])

  return { orderStats, recentOrders, totalUsers }
}

export default async function AdminDashboardPage() {
  const { orderStats, recentOrders, totalUsers } = await getDashboardData()
  const statsMap = Object.fromEntries(orderStats.map((s) => [s.status, s._count]))
  const totalOrders = orderStats.reduce((sum, s) => sum + s._count, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Order', value: totalOrders, icon: ShoppingBag, color: 'text-brand', href: '/admin/orders' },
          { label: 'Antrian', value: statsMap['pending'] ?? 0, icon: Clock, color: 'text-yellow-500', href: '/admin/orders?status=pending' },
          { label: 'Dikerjakan', value: (statsMap['in_progress'] ?? 0) + (statsMap['review'] ?? 0), icon: Clock, color: 'text-blue-500', href: '/admin/orders?status=in_progress' },
          { label: 'Total Pelanggan', value: totalUsers, icon: Users, color: 'text-green-500', href: '#' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl border bg-card p-4 hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Order Terbaru</h2>
          <Link href="/admin/orders" className="text-xs text-brand hover:underline flex items-center gap-1">
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{order.template?.name}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  #{order.orderNumber} · {order.customer.name} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="text-xs text-muted-foreground hidden md:block">
                {order.assignee ? order.assignee.name : <span className="text-yellow-600">Belum ditugaskan</span>}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
