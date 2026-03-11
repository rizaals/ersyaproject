'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface RevisionButtonProps {
  orderId: string
  revisionCount: number
  maxRevisions: number
}

export function RevisionButton({ orderId, revisionCount, maxRevisions }: RevisionButtonProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const remaining = maxRevisions - revisionCount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal mengirim permintaan revisi')
      } else {
        toast.success('Permintaan revisi berhasil dikirim!')
        setOpen(false)
        setNotes('')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (remaining <= 0) {
    return (
      <div className="w-full text-center text-xs text-muted-foreground py-2">
        Batas revisi ({maxRevisions}x) sudah habis
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-orange-300 text-orange-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Minta Revisi ({remaining}x tersisa)
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-2xl border shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Permintaan Revisi</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Sisa revisi: <span className="font-semibold text-foreground">{remaining}x</span> dari {maxRevisions}x total.
              Jelaskan bagian yang ingin direvisi agar tim dapat segera mengerjakannya.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Catatan Revisi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tolong ubah warna tombol menjadi merah, dan perbesar foto produk di bagian hero..."
                  rows={4}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !notes.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
