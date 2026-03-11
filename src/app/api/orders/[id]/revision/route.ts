import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import { notifyAllAdmins } from '@/lib/notify'

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return apiError('Order tidak ditemukan', 404)

    // Only the customer who owns the order can request revision
    if (order.customerId !== session.user.id) return apiError('Tidak diizinkan', 403)

    // Only allowed when status is 'review'
    if (order.status !== 'review') {
      return apiError('Revisi hanya bisa diminta saat status order adalah Review', 400)
    }

    // Check revision limit
    if (order.revisionCount >= order.maxRevisions) {
      return apiError(`Batas revisi (${order.maxRevisions}x) sudah tercapai`, 400)
    }

    const { notes } = await req.json().catch(() => ({ notes: '' }))

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'in_progress',
        revisionCount: { increment: 1 },
        notes: notes ?? order.notes,
      },
    })

    await notifyAllAdmins({
      type: 'revision_requested',
      message: `Revisi diminta untuk order #${order.orderNumber} (${updated.revisionCount}/${order.maxRevisions}x)${notes ? `: ${notes}` : ''}`,
      orderId: order.id,
    })

    return apiSuccess(updated, 'Permintaan revisi berhasil dikirim')
  } catch (err) {
    console.error('[revision POST]', err)
    return apiError('Gagal mengirim permintaan revisi', 500)
  }
}
