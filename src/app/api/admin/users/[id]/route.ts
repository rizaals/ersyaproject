import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'superadmin') {
      return apiError('Tidak diizinkan', 403)
    }

    // Cannot modify yourself
    if (params.id === session.user.id) {
      return apiError('Tidak dapat mengubah akun sendiri', 400)
    }

    const body = await req.json()
    const { isActive, role } = body

    const data: Record<string, unknown> = {}
    if (isActive !== undefined) data.isActive = Boolean(isActive)
    if (role !== undefined) {
      if (!['customer', 'admin', 'superadmin'].includes(role)) {
        return apiError('Role tidak valid', 400)
      }
      data.role = role
    }

    if (Object.keys(data).length === 0) return apiError('Tidak ada perubahan', 400)

    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    })

    return apiSuccess(updated, 'User berhasil diperbarui')
  } catch (err) {
    console.error('[admin users PATCH]', err)
    return apiError('Gagal memperbarui user', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'superadmin') {
      return apiError('Tidak diizinkan', 403)
    }
    if (params.id === session.user.id) {
      return apiError('Tidak dapat menghapus akun sendiri', 400)
    }

    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return apiSuccess(null, 'User dinonaktifkan')
  } catch (err) {
    console.error('[admin users DELETE]', err)
    return apiError('Gagal menonaktifkan user', 500)
  }
}
