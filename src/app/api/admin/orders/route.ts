import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import { generateOrderNumber } from '@/lib/order-number'
import { notify } from '@/lib/notify'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'superadmin') {
      return apiError('Tidak diizinkan', 403)
    }

    const body = await req.json()
    const { customerId, templateId, package: pkg, brief, price } = body

    if (!customerId || !templateId || !pkg || !price) {
      return apiError('customerId, templateId, package, dan price wajib diisi', 400)
    }

    const [customer, template] = await Promise.all([
      prisma.user.findUnique({ where: { id: customerId } }),
      prisma.template.findUnique({ where: { id: templateId } }),
    ])

    if (!customer) return apiError('Customer tidak ditemukan', 404)
    if (!template) return apiError('Template tidak ditemukan', 404)

    const orderNumber = await generateOrderNumber(template.serviceType as any)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        templateId,
        serviceType: template.serviceType,
        package: pkg,
        brief: brief ?? {},
        price: BigInt(price),
        // Admin-created orders skip payment flow
        status: 'pending',
        paymentStatus: 'paid',
      },
    })

    // Notify customer
    await notify({
      userId: customerId,
      type: 'order_new',
      message: `Order baru #${orderNumber} telah dibuat oleh admin.`,
      orderId: order.id,
    })

    return apiSuccess(order, 'Order berhasil dibuat', 201)
  } catch (err) {
    console.error('[admin orders POST]', err)
    return apiError('Gagal membuat order', 500)
  }
}
