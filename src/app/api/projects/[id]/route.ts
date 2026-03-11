import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH — save project pages
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { pages } = await req.json()
  if (!Array.isArray(pages)) {
    return NextResponse.json({ message: 'pages harus berupa array' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } })
  if (!project) return NextResponse.json({ message: 'Project tidak ditemukan' }, { status: 404 })

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { pages },
  })

  return NextResponse.json(updated)
}
