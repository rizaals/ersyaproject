'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { OrderStatus } from '@prisma/client'

const NEXT_STATUSES: Record<OrderStatus, { value: OrderStatus; label: string; className: string }[]> = {
  awaiting_payment: [
    { value: 'pending', label: 'Konfirmasi Bayar', className: 'bg-blue-500 text-white hover:bg-blue-600' },
    { value: 'cancelled', label: 'Batalkan', className: 'bg-red-500 text-white hover:bg-red-600' },
  ],
  pending: [
    { value: 'confirmed', label: 'Konfirmasi Order', className: 'bg-sky-500 text-white hover:bg-sky-600' },
    { value: 'cancelled', label: 'Batalkan', className: 'bg-red-500 text-white hover:bg-red-600' },
  ],
  confirmed: [
    { value: 'in_progress', label: 'Mulai Kerjakan', className: 'bg-brand text-white hover:bg-brand-dark' },
    { value: 'cancelled', label: 'Batalkan', className: 'bg-red-500 text-white hover:bg-red-600' },
  ],
  in_progress: [
    { value: 'done', label: 'Tandai Selesai', className: 'bg-green-500 text-white hover:bg-green-600' },
    { value: 'review', label: 'Minta Revisi', className: 'bg-orange-500 text-white hover:bg-orange-600' },
  ],
  review: [
    { value: 'in_progress', label: 'Kerjakan Lagi', className: 'bg-brand text-white hover:bg-brand-dark' },
    { value: 'done', label: 'Tandai Selesai', className: 'bg-green-500 text-white hover:bg-green-600' },
  ],
  done: [],
  cancelled: [],
}

interface Props {
  orderId: string
  currentStatus: OrderStatus
  assigneeId: string
  admins: { id: string; name: string }[]
}

export function AdminOrderActions({ orderId, currentStatus, assigneeId, admins }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState(assigneeId)

  const changeStatus = async (status: OrderStatus) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.message)
      else {
        toast.success('Status diperbarui')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const assignOrder = async (adminId: string) => {
    setSelectedAssignee(adminId)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigneeId: adminId || null }),
    })
    if (res.ok) toast.success('Assignee diperbarui')
    else toast.error('Gagal update assignee')
    router.refresh()
  }

  const nextStatuses = NEXT_STATUSES[currentStatus] ?? []

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <h3 className="font-semibold text-sm">Aksi Order</h3>

      {/* Assign */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Ditugaskan ke</label>
        <select
          value={selectedAssignee}
          onChange={(e) => assignOrder(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
        >
          <option value="">— Belum ditugaskan —</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Status buttons */}
      {nextStatuses.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Ubah Status</p>
          <div className="space-y-1.5">
            {nextStatuses.map((s) => (
              <button
                key={s.value}
                onClick={() => changeStatus(s.value)}
                disabled={loading}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${s.className}`}
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
