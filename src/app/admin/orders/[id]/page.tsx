import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AdminChatBox } from '@/components/admin/AdminChatBox'
import { AdminOrderActions } from '@/components/admin/AdminOrderActions'
import { AssetList } from '@/components/portal/AssetList'
import { AssetUploader } from '@/components/admin/AssetUploader'
import { ArrowLeft, Wand2, FileText } from 'lucide-react'

export const metadata: Metadata = { title: 'Detail Order' }
type Props = { params: { id: string } }

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await auth()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      template: { select: { id: true, name: true, slug: true, thumbnailUrl: true, serviceType: true } },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      assignee: { select: { id: true, name: true } },
      assets: { orderBy: { uploadedAt: 'desc' } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
  })
  if (!order) notFound()

  // Get all admin users for assignment
  const admins = await prisma.user.findMany({
    where: { role: { in: ['admin', 'superadmin'] } },
    select: { id: true, name: true },
  })

  const brief = order.brief as Record<string, any>

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            {order.customer.name} · {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
        <Link
          href={`/admin/orders/${params.id}/invoice`}
          className="flex items-center gap-1.5 border text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <FileText className="h-4 w-4" /> Invoice
        </Link>
        {order.template && (
          <Link
            href={`/admin/builder/${order.template.id}`}
            className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Wand2 className="h-4 w-4" /> Buka Builder
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Order actions (status change, assign) */}
          <AdminOrderActions
            orderId={order.id}
            currentStatus={order.status}
            assigneeId={order.assigneeId ?? ''}
            admins={admins}
          />

          {/* Customer info */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold text-sm mb-3">Info Pelanggan</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-20 shrink-0">Nama</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-20 shrink-0">Email</span>
                <span>{order.customer.email}</span>
              </div>
              {order.customer.phone && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-20 shrink-0">WhatsApp</span>
                  <a href={`https://wa.me/${order.customer.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    {order.customer.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Brief */}
          {brief && (
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold text-sm mb-3">Brief dari Pelanggan</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(brief).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs font-medium text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</p>
                    <p className="mt-0.5">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assets */}
          <AssetList assets={order.assets} />
          <AssetUploader orderId={order.id} />
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2">
          <AdminChatBox
            orderId={order.id}
            currentUserId={session!.user.id}
            initialMessages={order.messages as any}
          />
        </div>
      </div>
    </div>
  )
}
