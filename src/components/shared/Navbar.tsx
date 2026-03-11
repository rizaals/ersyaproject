'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Bell, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'
import { Logo } from './Logo'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Landing Page', href: '/templates?type=landing_page' },
  { label: 'Email Template', href: '/templates?type=email' },
  { label: 'Harga', href: '/home#harga' },
]

export function Navbar() {
  const { data: session } = useSession()
  const { unreadCount } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const dashboardHref =
    session?.user?.role === 'customer' ? '/portal/dashboard' : '/admin/dashboard'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* Notification bell */}
              <Link href={dashboardHref} className="relative p-2 rounded-md hover:bg-accent transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden md:block max-w-[120px] truncate">{session.user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-popover shadow-lg z-20 py-1">
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/portal/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <div className="border-t my-1" />
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/home' }) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
              >
                Daftar Gratis
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
