import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { snap } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ message: 'orderId wajib diisi' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        template: { select: { name: true } },
      },
    })

    if (!order) return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 })
    if (order.customerId !== session.user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    if (order.status !== 'awaiting_payment') return NextResponse.json({ message: 'Order tidak dalam status menunggu pembayaran' }, { status: 400 })

    // Check if there's already a pending payment with valid token
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
    })

    if (existingPayment?.midtransToken) {
      return NextResponse.json({ token: existingPayment.midtransToken })
    }

    // Create Midtrans Snap token
    const midtransOrderId = `ORDER-${order.orderNumber}-${Date.now()}`
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Number(order.price),
      },
      customer_details: {
        first_name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone ?? undefined,
      },
      item_details: [
        {
          id: order.id,
          name: order.template?.name ?? `Order #${order.orderNumber}`,
          quantity: 1,
          price: Number(order.price),
        },
      ],
    }

    const transaction = await snap.createTransaction(parameter)

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        midtransOrderId,
        midtransToken: transaction.token,
        amount: order.price,
        status: 'pending',
      },
    })

    return NextResponse.json({ token: transaction.token })
  } catch (err) {
    console.error('[create-token]', err)
    return NextResponse.json({ message: 'Gagal membuat token pembayaran' }, { status: 500 })
  }
}
