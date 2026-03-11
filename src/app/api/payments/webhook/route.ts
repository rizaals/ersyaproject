import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyMidtransSignature, isMidtransSuccess } from '@/lib/midtrans'
import { notify } from '@/lib/notify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type } = body

    // Verify signature
    const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    // Find payment by midtrans order_id
    const payment = await prisma.payment.findFirst({
      where: { midtransOrderId: order_id },
      include: { order: true },
    })

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 })
    }

    const newStatus = isMidtransSuccess(transaction_status, fraud_status)
      ? 'success'
      : transaction_status === 'pending'
      ? 'pending'
      : transaction_status === 'expire'
      ? 'expired'
      : 'failed'

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus as any,
        paidAt: newStatus === 'success' ? new Date() : null,
        paymentMethod: payment_type,
      },
    })

    // If payment success, update order payment status and move to pending (antrian)
    if (newStatus === 'success' && payment.order.status === 'awaiting_payment') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'pending', paymentStatus: 'paid' },
      })

      await notify({
        userId: payment.order.customerId,
        type: 'payment_success',
        message: `Pembayaran order #${payment.order.orderNumber} berhasil dikonfirmasi!`,
        orderId: payment.orderId,
      })
    }

    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    console.error('[payment webhook]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
