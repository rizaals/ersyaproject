import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        template: { select: { name: true, slug: true, thumbnailUrl: true, serviceType: true } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        assignee: { select: { id: true, name: true } },
        payments: true,
        assets: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    })

    if (!order) return apiError('Order tidak ditemukan', 404)

    // Customer can only see their own order
    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin && order.customerId !== session.user.id) {
      return apiError('Tidak diizinkan', 403)
    }

    return apiSuccess(order)
  } catch (err) {
    console.error('[order GET]', err)
    return apiError('Gagal mengambil order', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin) return apiError('Tidak diizinkan', 403)

    const body = await req.json()
    const { assigneeId, brief } = body

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(assigneeId !== undefined ? { assigneeId } : {}),
        ...(brief !== undefined ? { brief } : {}),
      },
    })
    return apiSuccess(updated)
  } catch (err) {
    console.error('[order PATCH]', err)
    return apiError('Gagal update order', 500)
  }
}
