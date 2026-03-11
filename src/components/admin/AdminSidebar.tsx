'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, ShoppingBag, LayoutGrid, Users, LogOut,
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/useNotifications'

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Semua Order' },
  { href: '/admin/templates', icon: LayoutGrid, label: 'Template Library' },
  { href: '/admin/users', icon: Users, label: 'Manajemen User' },
]

interface AdminSidebarProps {
  userName: string
  userRole: string
}

export function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  return (
    <aside className="w-60 shrink-0 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <Logo size="sm" href="/admin/dashboard" />
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-brand/10 text-brand'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === '/admin/orders' && unreadCount > 0 && (
              <span className="bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="h-7 w-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{userName}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/home' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
