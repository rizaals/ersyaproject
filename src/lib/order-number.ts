import { prisma } from './prisma'
import type { ServiceType } from '@prisma/client'

// Generate order number: LF-LP-2026-0001 atau LF-EM-2026-0001
export async function generateOrderNumber(serviceType: ServiceType): Promise<string> {
  const prefix = serviceType === 'landing_page' ? 'LP' : 'EM'
  const year = new Date().getFullYear()

  const count = await prisma.order.count({
    where: {
      serviceType,
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  })

  const sequence = String(count + 1).padStart(4, '0')
  return `LF-${prefix}-${year}-${sequence}`
}
