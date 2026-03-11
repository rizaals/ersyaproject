'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal mendaftar')
      } else {
        toast.success('Akun berhasil dibuat! Silakan masuk.')
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-8">
      <h1 className="text-xl font-bold mb-1">Buat akun baru</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-brand hover:underline font-medium">
          Masuk
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Nama Lengkap</label>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Nama Anda"
            required
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="email@domain.com"
            required
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">No. WhatsApp</label>
          <input
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="08xxxxxxxxxx"
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Min 8 karakter"
              required
              minLength={8}
              className="w-full px-3 py-2.5 pr-10 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-2.5 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Daftar Gratis
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Dengan mendaftar, Anda menyetujui syarat &amp; ketentuan layanan kami.
        </p>
      </form>
    </div>
  )
}
