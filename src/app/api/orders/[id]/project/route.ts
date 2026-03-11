import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      template: { select: { gjsData: true, serviceType: true } },
      project: true,
    },
  })
  if (!order) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  // Return existing project
  if (order.project) return NextResponse.json(order.project)

  // Create project from template gjsData
  const isEmail = order.serviceType === 'email'
  const gjsData = order.template?.gjsData ?? null
  const initialPages = [
    { name: isEmail ? 'Email' : 'Halaman 1', gjsData },
  ]

  const project = await prisma.project.create({
    data: {
      orderId: order.id,
      serviceType: isEmail ? 'email' : 'landing_page',
      name: `Project #${order.orderNumber}`,
      pages: initialPages,
    },
  })

  return NextResponse.json(project)
}
