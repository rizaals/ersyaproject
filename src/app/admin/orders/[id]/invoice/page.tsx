import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PrintButton } from './PrintButton'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const metadata = { title: 'Invoice' }

type Props = { params: { id: string } }

function formatRupiah(amount: number | bigint) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount))
}

function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const PACKAGE_LABEL: Record<string, string> = {
  basic: 'Paket Dasar',
  standard: 'Paket Standar',
  premium: 'Paket Premium',
}

const SERVICE_LABEL: Record<string, string> = {
  landing_page: 'Landing Page',
  email: 'Email Template',
}

export default async function InvoicePage({ params }: Props) {
  const session = await auth()
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) notFound()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      template: { select: { name: true } },
      payments: {
        where: { status: 'settlement' },
        orderBy: { paidAt: 'desc' },
        take: 1,
      },
    },
  })
  if (!order) notFound()

  const price = Number(order.price)
  const invoiceNumber = `INV-${order.orderNumber}`
  const invoiceDate = formatDate(order.createdAt)
  const dueDate = formatDate(new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000))
  const isPaid = order.paymentStatus === 'paid'

  const itemDescription = `Jasa Pembuatan ${SERVICE_LABEL[order.serviceType] ?? order.serviceType}`
  const itemDetail = [
    order.template?.name,
    PACKAGE_LABEL[order.package] ?? order.package,
  ].filter(Boolean).join(' — ')

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 print:hidden">
        <Link href={`/admin/orders/${params.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold flex-1">Invoice #{invoiceNumber}</h1>
        <PrintButton />
      </div>

      {/* Invoice card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm print:shadow-none print:border-none print:rounded-none p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="6" r="3.5" fill="#26bfbf" />
                <circle cx="5" cy="24" r="3.5" fill="#26bfbf" />
                <circle cx="27" cy="24" r="3.5" fill="#26bfbf" />
                <circle cx="16" cy="16" r="2.5" fill="#26bfbf" opacity="0.7" />
                <line x1="16" y1="9.5" x2="16" y2="13.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="14" y1="17.5" x2="7" y2="21.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="17.5" x2="25" y2="21.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="20.5" x2="27" y2="20.5" stroke="#26bfbf" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
              </svg>
              <div className="leading-none">
                <p className="text-xl font-bold tracking-tight">ersya <span style={{ color: '#26bfbf' }}>projects</span></p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">software solution</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">ersyaproject.com</p>
            <p className="text-sm text-gray-500">hello@ersyaproject.com</p>
          </div>

          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h2>
            <p className="text-sm font-semibold" style={{ color: '#26bfbf' }}>{invoiceNumber}</p>
            {isPaid && (
              <span className="inline-block mt-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                LUNAS
              </span>
            )}
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>Tanggal: <span className="text-gray-700 font-medium">{invoiceDate}</span></p>
              <p>Jatuh Tempo: <span className="text-gray-700 font-medium">{dueDate}</span></p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-6" />

        {/* Bill To */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Ditagihkan Kepada</p>
          <p className="font-bold text-gray-800 text-lg">{order.customer.name}</p>
          <p className="text-sm text-gray-500">{order.customer.email}</p>
          {order.customer.phone && <p className="text-sm text-gray-500">{order.customer.phone}</p>}
        </div>

        {/* Items table */}
        <div className="rounded-xl overflow-hidden border border-gray-100 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#26bfbf' }} className="text-white">
                <th className="text-left px-5 py-3 font-semibold">Deskripsi</th>
                <th className="text-center px-4 py-3 font-semibold w-16">Qty</th>
                <th className="text-right px-5 py-3 font-semibold w-40">Harga</th>
                <th className="text-right px-5 py-3 font-semibold w-40">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-800">{itemDescription}</p>
                  {itemDetail && <p className="text-xs text-gray-400 mt-0.5">{itemDetail}</p>}
                </td>
                <td className="px-4 py-4 text-center text-gray-600">1</td>
                <td className="px-5 py-4 text-right text-gray-600">{formatRupiah(price)}</td>
                <td className="px-5 py-4 text-right font-semibold text-gray-800">{formatRupiah(price)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatRupiah(price)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Pajak (0%)</span>
              <span>{formatRupiah(0)}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between text-base font-bold text-gray-800">
              <span>Total</span>
              <span style={{ color: '#26bfbf' }}>{formatRupiah(price)}</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#f0fdfc' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Informasi Pembayaran</p>
          {isPaid ? (
            <div className="text-sm text-gray-600">
              <p>Status: <span className="font-semibold text-green-600">Pembayaran telah diterima</span></p>
              {order.payments[0]?.paymentMethod && (
                <p className="mt-1">Metode: <span className="font-semibold text-gray-800 capitalize">{order.payments[0].paymentMethod.replace(/_/g, ' ')}</span></p>
              )}
              {order.payments[0]?.paidAt && (
                <p className="mt-1">Dibayar: <span className="font-semibold text-gray-800">{formatDate(order.payments[0].paidAt)}</span></p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Bank</p>
                <p className="font-semibold text-gray-800">BCA</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Atas Nama</p>
                <p className="font-semibold text-gray-800">Rizal Syahputra</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">No. Rekening</p>
                <p className="font-semibold text-gray-800 tracking-wider">1640515852</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="text-sm text-gray-400 border-t border-gray-100 pt-5 mb-5">
            <p className="font-medium text-gray-500 mb-1">Catatan</p>
            <p className="leading-relaxed">{order.notes}</p>
          </div>
        )}

        <div className="text-sm text-gray-400 border-t border-gray-100 pt-5">
          <p className="leading-relaxed">Pembayaran dilakukan dalam 7 hari setelah invoice diterima. Terima kasih atas kepercayaan Anda.</p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-300">
          <span>ersyaproject.com — software solution</span>
          <span>{invoiceNumber}</span>
        </div>
      </div>
    </div>
  )
}
