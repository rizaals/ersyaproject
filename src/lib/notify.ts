import { prisma } from './prisma'
import { sendWhatsApp } from './fonnte'
import { sendEmail } from './resend'
import type { NotificationType } from '@prisma/client'

interface NotifyOptions {
  userId: string
  orderId?: string
  type: NotificationType
  message: string
  whatsapp?: { phone: string; text: string }
  email?: { to: string; subject: string; html: string }
}

export async function notify(opts: NotifyOptions) {
  // 1. Simpan ke DB (in-app notification)
  await prisma.notification.create({
    data: {
      userId: opts.userId,
      orderId: opts.orderId,
      type: opts.type,
      message: opts.message,
    },
  })

  // 2. WhatsApp (fire & forget — tidak blocking)
  if (opts.whatsapp) {
    sendWhatsApp(opts.whatsapp.phone, opts.whatsapp.text).catch(console.error)
  }

  // 3. Email (fire & forget)
  if (opts.email) {
    sendEmail(opts.email).catch(console.error)
  }
}

// Kirim notifikasi ke semua superadmin & admin
export async function notifyAllAdmins(opts: Omit<NotifyOptions, 'userId'>) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ['admin', 'superadmin'] }, isActive: true },
    select: { id: true },
  })
  await Promise.all(admins.map((admin) => notify({ ...opts, userId: admin.id })))
}
