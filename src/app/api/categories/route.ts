import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const serviceType = req.nextUrl.searchParams.get('type')
    const categories = await prisma.category.findMany({
      where: serviceType ? { serviceType: serviceType as any } : undefined,
      orderBy: { name: 'asc' },
    })
    return apiSuccess(categories)
  } catch (err) {
    console.error('[categories GET]', err)
    return apiError('Gagal mengambil kategori', 500)
  }
}
