import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import { generateOrderNumber } from '@/lib/order-number'
import { notifyAllAdmins } from '@/lib/notify'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const sp = req.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10))
    const skip = (page - 1) * PAGE_SIZE
    const statusFilter = sp.get('status')

    const isAdmin = ['admin', 'superadmin'].includes(session.user?.role ?? '')

    const where: any = {}
    if (!isAdmin) where.customerId = session.user.id
    if (statusFilter) where.status = statusFilter

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
        include: {
          template: { select: { name: true, slug: true, thumbnailUrl: true } },
          customer: { select: { name: true, email: true } },
          assignee: { select: { name: true } },
        },
      }),
      prisma.order.count({ where }),
    ])

    return apiSuccess({ items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) })
  } catch (err) {
    console.error('[orders GET]', err)
    return apiError('Gagal mengambil order', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return apiError('Silakan login terlebih dahulu', 401)
    if (!['customer', 'superadmin'].includes(session.user?.role ?? '')) return apiError('Tidak diizinkan membuat order', 403)

    const body = await req.json()
    const { templateId, package: pkg, brief, price } = body

    if (!templateId || !pkg || !brief || !price) {
      return apiError('templateId, package, brief, dan price wajib diisi', 400)
    }

    const template = await prisma.template.findUnique({ where: { id: templateId } })
    if (!template) return apiError('Template tidak ditemukan', 404)

    const orderNumber = await generateOrderNumber(template.serviceType as any)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session.user.id,
        templateId,
        serviceType: template.serviceType,
        package: pkg,
        brief,
        price: BigInt(price),
        status: 'awaiting_payment',
      },
    })

    // Notify all admins
    await notifyAllAdmins({
      type: 'order_new',
      message: `Order baru #${orderNumber} dari ${session.user.name ?? session.user.email}`,
      orderId: order.id,
    })

    return apiSuccess(order, 'Order berhasil dibuat', 201)
  } catch (err) {
    console.error('[orders POST]', err)
    return apiError('Gagal membuat order', 500)
  }
}
