'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, MessageSquare, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portal/orders', icon: ShoppingBag, label: 'Order Saya' },
  { href: '/portal/messages', icon: MessageSquare, label: 'Pesan' },
  { href: '/portal/profile', icon: User, label: 'Profil' },
]

export function PortalSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 gap-1">
      <Link
        href="/templates"
        className="flex items-center gap-2 bg-brand text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors mb-3"
      >
        <Plus className="h-4 w-4" /> Order Baru
      </Link>
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
          {item.label}
        </Link>
      ))}
    </aside>
  )
}
