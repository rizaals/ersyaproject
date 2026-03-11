import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function PATCH() {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })
    return apiSuccess(null)
  } catch (err) {
    return apiError('Gagal update notifikasi', 500)
  }
}
