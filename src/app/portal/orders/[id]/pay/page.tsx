import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PayButton } from './PayButton'

export const metadata: Metadata = { title: 'Pembayaran' }
type Props = { params: { id: string } }

function formatRupiah(amount: bigint | number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

export default async function PayPage({ params }: Props) {
  const session = await auth()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      template: { select: { name: true, serviceType: true } },
    },
  })

  if (!order || order.customerId !== session!.user.id) notFound()
  if (order.status !== 'awaiting_payment') redirect(`/portal/orders/${params.id}`)

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/portal/orders/${params.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Pembayaran</h1>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        {/* Order summary */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Ringkasan Order</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order</span>
              <span className="font-medium">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Layanan</span>
              <span className="font-medium">{order.template?.name ?? `Order #${order.orderNumber}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paket</span>
              <span className="font-medium capitalize">{order.package}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="font-bold text-lg text-brand">{formatRupiah(order.price)}</span>
            </div>
          </div>
        </div>

        {/* Payment button */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Metode Pembayaran</p>
          <p className="text-sm text-muted-foreground mb-4">
            Pilih metode pembayaran yang tersedia melalui Midtrans — transfer bank, virtual account, QRIS, e-wallet, dan lainnya.
          </p>
          <PayButton orderId={order.id} />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Pembayaran diproses dengan aman melalui Midtrans. Data Anda terlindungi dengan enkripsi SSL.
        </p>
      </div>
    </div>
  )
}
