'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, ShieldCheck, ShieldOff, UserX, UserCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Role } from '@prisma/client'

interface Props {
  userId: string
  currentRole: Role
  isActive: boolean
}

export function UserActions({ userId, currentRole, isActive }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const patch = async (data: Record<string, unknown>, label: string) => {
    setLoading(true)
    setOpen(false)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) toast.error(result.message ?? 'Gagal')
      else { toast.success(label); router.refresh() }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border bg-popover shadow-lg z-20 py-1 text-sm">
            {/* Toggle active */}
            <button
              onClick={() => patch({ isActive: !isActive }, isActive ? 'User dinonaktifkan' : 'User diaktifkan')}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent transition-colors"
            >
              {isActive
                ? <><UserX className="h-4 w-4 text-red-500" /> Nonaktifkan User</>
                : <><UserCheck className="h-4 w-4 text-green-500" /> Aktifkan User</>
              }
            </button>

            <div className="border-t my-1" />
            <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Ubah Role</p>

            {(['customer', 'admin', 'superadmin'] as Role[])
              .filter((r) => r !== currentRole)
              .map((r) => (
                <button
                  key={r}
                  onClick={() => patch({ role: r }, `Role diubah ke ${r}`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent transition-colors capitalize"
                >
                  {r === 'admin' || r === 'superadmin'
                    ? <ShieldCheck className="h-4 w-4 text-brand" />
                    : <ShieldOff className="h-4 w-4 text-muted-foreground" />
                  }
                  Jadikan {r === 'superadmin' ? 'Super Admin' : r === 'admin' ? 'Admin' : 'Customer'}
                </button>
              ))
            }
          </div>
        </>
      )}
    </div>
  )
}
