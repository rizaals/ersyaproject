import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

const PAGE_SIZE = 12

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const serviceType = sp.get('type') ?? 'landing_page'
    const category = sp.get('category')
    const q = sp.get('q')
    const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10))
    const skip = (page - 1) * PAGE_SIZE

    // Non-admins only see published
    const session = await auth()
    const isAdmin = session?.user?.role && ['admin', 'superadmin'].includes(session.user.role)
    const statusFilter = isAdmin ? undefined : { status: 'active' as const }

    const where = {
      ...statusFilter,
      serviceType: serviceType as any,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.template.count({ where }),
    ])

    return apiSuccess({ items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) })
  } catch (err) {
    console.error('[templates GET]', err)
    return apiError('Gagal mengambil template', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !['admin', 'superadmin'].includes(session.user?.role ?? '')) {
      return apiError('Tidak diizinkan', 403)
    }

    const body = await req.json()
    const { name, slug, description, serviceType, categoryId, thumbnailUrl, previewUrl, gjsData } = body

    if (!name || !slug || !serviceType || !categoryId) {
      return apiError('name, slug, serviceType, categoryId wajib diisi', 400)
    }

    const template = await prisma.template.create({
      data: { name, slug, description, serviceType, categoryId, thumbnailUrl, previewUrl, gjsData, status: 'draft', createdById: session.user.id },
    })
    return apiSuccess(template, 'Template berhasil dibuat', 201)
  } catch (err: any) {
    if (err?.code === 'P2002') return apiError('Slug sudah digunakan', 409)
    console.error('[templates POST]', err)
    return apiError('Gagal membuat template', 500)
  }
}
