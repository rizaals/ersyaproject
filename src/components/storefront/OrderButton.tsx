'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface OrderButtonProps {
  templateSlug: string
  packageName: string
}

export function OrderButton({ templateSlug, packageName }: OrderButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleOrder = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/templates/${templateSlug}`)
      return
    }
    router.push(`/portal/orders/new?template=${templateSlug}&package=${packageName}`)
  }

  return (
    <button
      onClick={handleOrder}
      className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors"
    >
      Pesan
    </button>
  )
}
