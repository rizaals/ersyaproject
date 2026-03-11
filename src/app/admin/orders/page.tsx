import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ArrowRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Semua Order' }

const STATUS_TABS = [
  { value: '', label: 'Semua' },
  { value: 'awaiting_payment', label: 'Menunggu Bayar' },
  { value: 'pending', label: 'Antrian' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'in_progress', label: 'Dikerjakan' },
  { value: 'review', label: 'Revisi' },
  { value: 'done', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

interface Props {
  searchParams: { status?: string; page?: string }
}

const PAGE_SIZE = 20

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page: pageStr } = searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const skip = (page - 1) * PAGE_SIZE

  const where = status ? { status: status as any } : {}
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
      include: {
        template: { select: { name: true, serviceType: true } },
        customer: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
      },
    }),
    prisma.order.count({ where }),
  ])
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Semua Order</h1>
        <Link
          href="/admin/orders/new"
          className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Buat Order Manual
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              (status ?? '') === tab.value
                ? 'bg-foreground text-background'
                : 'border hover:bg-accent'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Order</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Pelanggan</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Assignee</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Tgl Pesan</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{order.template?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">#{order.orderNumber} · <span className="capitalize">{order.package}</span></p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </td>
                  <td className="p-3"><StatusBadge status={order.status} /></td>
                  <td className="p-3 text-xs">
                    {order.assignee?.name ?? <span className="text-yellow-600">Belum ditugaskan</span>}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand hover:underline flex items-center gap-1">
                      Detail <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                    Tidak ada order ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-xs text-muted-foreground">{total} order total</p>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/orders${status ? `?status=${status}&` : '?'}page=${p}`}
                  className={cn(
                    'h-8 w-8 rounded text-xs font-medium flex items-center justify-center transition-colors',
                    p === page ? 'bg-brand text-white' : 'border hover:bg-accent'
                  )}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
