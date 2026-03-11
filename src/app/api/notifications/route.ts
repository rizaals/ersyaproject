import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const limit = Math.min(50, parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10))

    const items = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return apiSuccess({ items })
  } catch (err) {
    console.error('[notifications GET]', err)
    return apiError('Gagal mengambil notifikasi', 500)
  }
}
