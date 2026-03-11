'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/portal/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        toast.error('Email atau password salah')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-8">
      <h1 className="text-xl font-bold mb-1">Masuk ke akun Anda</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Belum punya akun?{' '}
        <Link href="/register" className="text-brand hover:underline font-medium">
          Daftar gratis
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            required
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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
          Masuk
        </button>
      </form>
    </div>
  )
}
