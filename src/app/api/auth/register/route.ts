import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password) {
      return apiError('Nama, email, dan password wajib diisi', 400)
    }
    if (password.length < 8) {
      return apiError('Password minimal 8 karakter', 400)
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return apiError('Email sudah terdaftar', 409)
    }

    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash, phone: phone || null, role: 'customer' },
      select: { id: true, name: true, email: true },
    })

    return apiSuccess(user, 'Akun berhasil dibuat', 201)
  } catch (err) {
    console.error('[register]', err)
    return apiError('Terjadi kesalahan server', 500)
  }
}
