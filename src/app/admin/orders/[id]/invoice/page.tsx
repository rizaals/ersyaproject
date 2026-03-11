import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PrintButton } from './PrintButton'

export const metadata = { title: 'Invoice' }

type Props = { params: { id: string } }

// Data dummy invoice
const INVOICE = {
  number: 'INV-2026-0001',
  date: '11 Maret 2026',
  dueDate: '18 Maret 2026',
  customer: {
    name: 'Nizarul Alfan',
    company: 'jasakirimexpress.id',
    email: 'nizarul@jasakirimexpress.id',
  },
  items: [
    {
      description: 'Jasa Pembuatan Website & Dashboard',
      detail: 'jasakirimexpress.id — Full custom development, integrasi API, admin dashboard',
      qty: 1,
      price: 6_000_000,
    },
  ],
  payment: {
    bank: 'BCA',
    accountName: 'Rizal Syahputra',
    accountNumber: '1640515852',
  },
  notes: 'Pembayaran dilakukan dalam 7 hari setelah invoice diterima. Terima kasih atas kepercayaan Anda.',
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function InvoicePage({ params }: Props) {
  const subtotal = INVOICE.items.reduce((sum, item) => sum + item.qty * item.price, 0)
  const tax = 0
  const total = subtotal + tax

  return (
    <div>
      {/* Toolbar — tidak ikut print */}
      <div className="flex items-center gap-3 mb-6 print:hidden">
        <Link href={`/admin/orders/${params.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold flex-1">Invoice</h1>
        <PrintButton />
      </div>

      {/* Invoice card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm print:shadow-none print:border-none print:rounded-none p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          {/* Logo + info perusahaan */}
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

          {/* Invoice meta */}
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h2>
            <p className="text-sm font-semibold" style={{ color: '#26bfbf' }}>{INVOICE.number}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>Tanggal: <span className="text-gray-700 font-medium">{INVOICE.date}</span></p>
              <p>Jatuh Tempo: <span className="text-gray-700 font-medium">{INVOICE.dueDate}</span></p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-6" />

        {/* Bill To */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Ditagihkan Kepada</p>
          <p className="font-bold text-gray-800 text-lg">{INVOICE.customer.name}</p>
          <p className="text-sm text-gray-500">{INVOICE.customer.company}</p>
          <p className="text-sm text-gray-500">{INVOICE.customer.email}</p>
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
              {INVOICE.items.map((item, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">{item.qty}</td>
                  <td className="px-5 py-4 text-right text-gray-600">{formatRupiah(item.price)}</td>
                  <td className="px-5 py-4 text-right font-semibold text-gray-800">{formatRupiah(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total section */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Pajak (0%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between text-base font-bold text-gray-800">
              <span>Total</span>
              <span style={{ color: '#26bfbf' }}>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#f0fdfc' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Informasi Pembayaran</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Bank</p>
              <p className="font-semibold text-gray-800">{INVOICE.payment.bank}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Atas Nama</p>
              <p className="font-semibold text-gray-800">{INVOICE.payment.accountName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">No. Rekening</p>
              <p className="font-semibold text-gray-800 tracking-wider">{INVOICE.payment.accountNumber}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-sm text-gray-400 border-t border-gray-100 pt-6">
          <p className="font-medium text-gray-500 mb-1">Catatan</p>
          <p className="leading-relaxed">{INVOICE.notes}</p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-300">
          <span>ersyaproject.com — software solution</span>
          <span>{INVOICE.number}</span>
        </div>
      </div>
    </div>
  )
}
