import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChatBox } from '@/components/portal/ChatBox'
import { AssetList } from '@/components/portal/AssetList'
import { RevisionButton } from '@/components/portal/RevisionButton'
import { ArrowLeft, CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@prisma/client'

type Props = { params: { id: string } }

export const metadata: Metadata = { title: 'Detail Order' }

// Timeline steps (excluding cancelled which is a special case)
const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'awaiting_payment', label: 'Pembayaran', desc: 'Menunggu konfirmasi bayar' },
  { status: 'pending',          label: 'Antrian',    desc: 'Order masuk antrean' },
  { status: 'confirmed',        label: 'Dikonfirmasi', desc: 'Admin menyiapkan pengerjaan' },
  { status: 'in_progress',      label: 'Dikerjakan', desc: 'Tim sedang mengerjakan' },
  { status: 'review',           label: 'Review',     desc: 'Siap untuk ditinjau' },
  { status: 'done',             label: 'Selesai',    desc: 'Order selesai' },
]

const STATUS_ORDER = STATUS_STEPS.map((s) => s.status)

function formatRupiah(amount: bigint | number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

export default async function PortalOrderDetailPage({ params }: Props) {
  const session = await auth()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      template: { select: { name: true, slug: true, thumbnailUrl: true, serviceType: true } },
      assignee: { select: { name: true } },
      assets: { orderBy: { uploadedAt: 'desc' } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
  })

  if (!order || order.customerId !== session!.user.id) notFound()

  const brief = order.brief as Record<string, any>
  const isCancelled = order.status === 'cancelled'
  const currentStepIndex = STATUS_ORDER.indexOf(order.status)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/portal/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Status Timeline */}
      {!isCancelled ? (
        <div className="rounded-xl border bg-card p-5 mb-6">
          <div className="flex items-start justify-between relative">
            {/* Connector line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-brand transition-all"
              style={{
                width: currentStepIndex <= 0
                  ? '0%'
                  : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {STATUS_STEPS.map((step, i) => {
              const isDone = i < currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <div key={step.status} className="flex flex-col items-center gap-2 relative z-10" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full border-2 flex items-center justify-center bg-card transition-colors',
                      isDone ? 'border-brand bg-brand text-white' : isCurrent ? 'border-brand' : 'border-border'
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Clock className="h-4 w-4 text-brand animate-pulse" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={cn('text-xs font-semibold', isCurrent ? 'text-brand' : isDone ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">{step.desc}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 mb-6 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Order Dibatalkan</p>
            <p className="text-xs text-red-500 mt-0.5">Order ini telah dibatalkan. Hubungi tim kami jika ada pertanyaan.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info + Assets */}
        <div className="space-y-4">
          {/* Order detail */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold text-sm mb-3">Detail Order</h2>
            <div className="space-y-2 text-sm">
              {order.template && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template</span>
                  <Link href={`/templates/${order.template.slug}`} className="font-medium text-brand hover:underline">
                    {order.template.name}
                  </Link>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paket</span>
                <span className="font-medium capitalize">{order.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Layanan</span>
                <span className="font-medium">
                  {order.serviceType === 'email' ? 'Email Template' : 'Landing Page'}
                </span>
              </div>
              {order.assignee && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dikerjakan oleh</span>
                  <span className="font-medium">{order.assignee.name}</span>
                </div>
              )}
              {order.deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">
                    {new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold text-sm mb-3">Pembayaran</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-base">{formatRupiah(order.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : order.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  )}
                >
                  {order.paymentStatus === 'paid' ? 'Lunas' : order.paymentStatus === 'failed' ? 'Gagal' : 'Belum Dibayar'}
                </span>
              </div>
              {order.revisionCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revisi</span>
                  <span className="font-medium">{order.revisionCount} / {order.maxRevisions}x</span>
                </div>
              )}
            </div>
            {order.paymentStatus === 'unpaid' && order.status === 'awaiting_payment' && (
              <Link
                href={`/portal/orders/${order.id}/pay`}
                className="mt-3 block w-full text-center bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Bayar Sekarang
              </Link>
            )}
            {order.status === 'review' && (
              <div className="mt-3">
                <RevisionButton
                  orderId={order.id}
                  revisionCount={order.revisionCount}
                  maxRevisions={order.maxRevisions}
                />
              </div>
            )}
          </div>

          {/* Brief */}
          {brief && Object.keys(brief).length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold text-sm mb-3">Brief</h2>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                {Object.entries(brief).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-foreground font-medium capitalize">{k.replace(/_/g, ' ')}: </span>
                    {String(v)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assets / Results */}
          <AssetList assets={order.assets} />
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2">
          <ChatBox
            orderId={order.id}
            currentUserId={session!.user.id}
            initialMessages={order.messages as any}
          />
        </div>
      </div>
    </div>
  )
}
