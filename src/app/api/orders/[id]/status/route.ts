import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import { notify } from '@/lib/notify'

type Params = { params: { id: string } }

const VALID_TRANSITIONS: Record<string, string[]> = {
  awaiting_payment: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['review', 'done'],
  review: ['in_progress', 'done'],
  done: [],
  cancelled: [],
}

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Pembayaran dikonfirmasi. Order Anda masuk antrian.',
  in_progress: 'Order Anda sedang dikerjakan oleh tim kami.',
  review: 'Order Anda masuk proses revisi.',
  done: 'Order Anda telah selesai! Silakan cek hasilnya.',
  cancelled: 'Order Anda dibatalkan.',
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin) return apiError('Tidak diizinkan', 403)

    const { status } = await req.json()
    if (!status) return apiError('Status wajib diisi', 400)

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return apiError('Order tidak ditemukan', 404)

    const allowed = VALID_TRANSITIONS[order.status] ?? []
    if (!allowed.includes(status)) {
      return apiError(`Tidak bisa mengubah status dari ${order.status} ke ${status}`, 422)
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })

    // Notify customer
    if (STATUS_MESSAGES[status]) {
      await notify({
        userId: order.customerId,
        type: 'order_status_updated',
        message: STATUS_MESSAGES[status],
        orderId: order.id,
      })
    }

    return apiSuccess(updated)
  } catch (err) {
    console.error('[order status PATCH]', err)
    return apiError('Gagal update status', 500)
  }
}
