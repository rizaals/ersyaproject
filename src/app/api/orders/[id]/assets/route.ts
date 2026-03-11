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

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin) return apiError('Hanya admin yang bisa upload asset', 403)

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return apiError('Order tidak ditemukan', 404)

    const { fileName, fileUrl, fileType, fileSize } = await req.json()
    if (!fileName || !fileUrl) return apiError('fileName dan fileUrl wajib diisi', 400)

    const asset = await prisma.orderAsset.create({
      data: { orderId: params.id, uploaderId: session.user.id, fileName, fileUrl, fileType, fileSize },
    })

    // Notify customer
    await notify({
      userId: order.customerId,
      type: 'asset_ready',
      message: `File hasil order #${order.orderNumber} sudah siap diunduh!`,
      orderId: order.id,
    })

    return apiSuccess(asset, 'Asset berhasil diupload', 201)
  } catch (err) {
    console.error('[asset POST]', err)
    return apiError('Gagal upload asset', 500)
  }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return apiError('Order tidak ditemukan', 404)

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')
    if (!isAdmin && order.customerId !== session.user.id) {
      return apiError('Tidak diizinkan', 403)
    }

    const assets = await prisma.orderAsset.findMany({ where: { orderId: params.id } })
    return apiSuccess(assets)
  } catch (err) {
    console.error('[assets GET]', err)
    return apiError('Gagal mengambil assets', 500)
  }
}
