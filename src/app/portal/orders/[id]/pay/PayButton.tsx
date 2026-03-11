'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void
        onPending?: (result: unknown) => void
        onError?: (result: unknown) => void
        onClose?: () => void
      }) => void
    }
  }
}

interface PayButtonProps {
  orderId: string
}

export function PayButton({ orderId }: PayButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setLoading(true)
    try {
      // 1. Get Snap token from our API
      const res = await fetch('/api/payments/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Gagal memuat pembayaran')
        return
      }

      const { token } = data

      // 2. Load Midtrans Snap script if not loaded yet
      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
          script.src = isProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '')
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Gagal memuat Midtrans'))
          document.head.appendChild(script)
        })
      }

      // 3. Open Snap popup
      window.snap!.pay(token, {
        onSuccess: () => {
          toast.success('Pembayaran berhasil!')
          router.push(`/portal/orders/${orderId}`)
          router.refresh()
        },
        onPending: () => {
          toast.info('Pembayaran sedang diproses...')
          router.push(`/portal/orders/${orderId}`)
        },
        onError: () => {
          toast.error('Pembayaran gagal. Silakan coba lagi.')
        },
        onClose: () => {
          toast.info('Pembayaran dibatalkan.')
        },
      })
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <CreditCard className="h-5 w-5" />
      )}
      {loading ? 'Memuat pembayaran...' : 'Bayar Sekarang'}
    </button>
  )
}
