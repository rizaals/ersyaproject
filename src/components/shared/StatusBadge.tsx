import { cn } from '@/lib/utils'
import type { OrderStatus } from '@prisma/client'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  awaiting_payment: {
    label: 'Menunggu Bayar',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  pending: {
    label: 'Antrian',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  },
  in_progress: {
    label: 'Dikerjakan',
    className: 'bg-brand/10 text-brand-dark',
  },
  review: {
    label: 'Revisi',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  done: {
    label: 'Selesai',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
