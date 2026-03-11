import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // ── Route proteksi ─────────────────────────────────────────

  // /portal/* — hanya customer & admin yang login
  if (pathname.startsWith('/portal')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?callbackUrl=' + pathname, req.url))
    }
  }

  // /admin/* — hanya admin & superadmin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    if (session.user.role === 'customer') {
      return NextResponse.redirect(new URL('/portal', req.url))
    }
  }

  // Jika sudah login, redirect dari halaman login ke tujuan yang tepat
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/portal', req.url))
  }

  if (pathname === '/admin/login' && session) {
    if (session.user.role !== 'customer') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/portal', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/portal/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
