import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

type Params = { params: { id: string } }

export async function PATCH(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    await prisma.notification.updateMany({
      where: { id: params.id, userId: session.user.id },
      data: { isRead: true },
    })
    return apiSuccess(null)
  } catch (err) {
    return apiError('Gagal update notifikasi', 500)
  }
}
