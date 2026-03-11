import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import { notify } from '@/lib/notify'

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return apiError('Order tidak ditemukan', 404)

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin && order.customerId !== session.user.id) {
      return apiError('Tidak diizinkan', 403)
    }

    const { content } = await req.json()
    if (!content?.trim()) return apiError('Pesan tidak boleh kosong', 400)

    const message = await prisma.message.create({
      data: {
        orderId: params.id,
        senderId: session.user.id,
        content: content.trim(),
        type: 'text',
      },
      include: { sender: { select: { id: true, name: true, role: true } } },
    })

    // Notify the other party
    const recipientId = isAdmin ? order.customerId : order.assigneeId
    if (recipientId) {
      await notify({
        userId: recipientId,
        type: 'message_new',
        message: `Pesan baru dari ${session.user.name ?? 'Admin'} di order #${order.orderNumber}`,
        orderId: order.id,
      })
    }

    return apiSuccess(message, 'Pesan terkirim', 201)
  } catch (err) {
    console.error('[message POST]', err)
    return apiError('Gagal mengirim pesan', 500)
  }
}
