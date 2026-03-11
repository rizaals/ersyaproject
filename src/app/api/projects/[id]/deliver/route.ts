import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { inlineEmailCss } from '@/lib/juice'
import { notify } from '@/lib/notify'

// POST — deliver project: save pages + change order status to review + notify customer
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { pages, htmlForInlining } = await req.json()
  if (!Array.isArray(pages)) {
    return NextResponse.json({ message: 'pages harus berupa array' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { order: { include: { customer: { select: { id: true, name: true, email: true, phone: true } } } } },
  })
  if (!project) return NextResponse.json({ message: 'Project tidak ditemukan' }, { status: 404 })

  const order = project.order

  // For email: inline CSS via juice
  let inlinedHtml: string | undefined
  if (project.serviceType === 'email' && htmlForInlining) {
    try {
      inlinedHtml = inlineEmailCss(htmlForInlining)
    } catch {
      inlinedHtml = htmlForInlining
    }
  }

  // Save project + update order status to 'review'
  await prisma.$transaction([
    prisma.project.update({
      where: { id: params.id },
      data: {
        pages,
        ...(inlinedHtml ? { inlinedHtml } : {}),
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: 'review' },
    }),
  ])

  // Notify customer
  const customer = order.customer
  await notify({
    userId: customer.id,
    orderId: order.id,
    type: 'review_ready',
    message: `Order #${order.orderNumber} sudah selesai dikerjakan dan siap untuk di-review.`,
    whatsapp: customer.phone
      ? {
          phone: customer.phone,
          text: `Halo ${customer.name}! 🎉\n\nOrder *#${order.orderNumber}* Anda sudah selesai dikerjakan dan siap untuk di-review.\n\nSilakan login ke portal untuk melihat hasilnya dan memberikan feedback.`,
        }
      : undefined,
    email: {
      to: customer.email,
      subject: `Order #${order.orderNumber} Siap untuk Review`,
      html: `<p>Halo <strong>${customer.name}</strong>,</p><p>Order <strong>#${order.orderNumber}</strong> Anda sudah selesai dikerjakan dan siap untuk di-review.</p><p>Silakan login ke portal untuk melihat hasilnya.</p>`,
    },
  })

  return NextResponse.json({ message: 'Project berhasil dikirim untuk review' })
}
