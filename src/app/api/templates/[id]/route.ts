import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: { category: true },
    })
    if (!template) return apiError('Template tidak ditemukan', 404)
    return apiSuccess(template)
  } catch (err) {
    return apiError('Gagal mengambil template', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session || !['admin', 'superadmin'].includes(session.user?.role ?? '')) {
      return apiError('Tidak diizinkan', 403)
    }

    const body = await req.json()
    const { name, description, categoryId, thumbnailUrl, previewUrl, gjsData, status } = body

    const updated = await prisma.template.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
        ...(previewUrl !== undefined ? { previewUrl } : {}),
        ...(gjsData !== undefined ? { gjsData } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    })
    return apiSuccess(updated)
  } catch (err) {
    console.error('[template PATCH]', err)
    return apiError('Gagal update template', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'superadmin') {
      return apiError('Hanya superadmin yang bisa menghapus template', 403)
    }
    await prisma.template.update({
      where: { id: params.id },
      data: { status: 'archived' },
    })
    return apiSuccess(null, 'Template diarsipkan')
  } catch (err) {
    return apiError('Gagal menghapus template', 500)
  }
}
