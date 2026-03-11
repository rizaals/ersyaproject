import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { UserActions } from './UserActions'
import { cn } from '@/lib/utils'
import type { Role } from '@prisma/client'

export const metadata: Metadata = { title: 'Manajemen User' }

const ROLE_BADGE: Record<Role, string> = {
  customer: 'bg-muted text-muted-foreground',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  superadmin: 'bg-brand/10 text-brand',
}

const ROLE_LABEL: Record<Role, string> = {
  customer: 'Customer',
  admin: 'Admin',
  superadmin: 'Super Admin',
}

interface Props {
  searchParams: { role?: string; q?: string }
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { role, q } = searchParams

  const where: any = {}
  if (role) where.role = role
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { email: { contains: q, mode: 'insensitive' } },
  ]

  const [users, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { ordersAsCustomer: true } },
      },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true },
    }),
  ])

  const roleCounts = Object.fromEntries(counts.map((c) => [c.role, c._count._all]))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manajemen User</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total User', value: users.length, color: 'text-foreground' },
          { label: 'Customer', value: roleCounts['customer'] ?? 0, color: 'text-muted-foreground' },
          { label: 'Admin', value: roleCounts['admin'] ?? 0, color: 'text-blue-600' },
          { label: 'Super Admin', value: roleCounts['superadmin'] ?? 0, color: 'text-brand' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <form method="GET" className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-1.5">
          {['', 'customer', 'admin', 'superadmin'].map((r) => (
            <a
              key={r}
              href={`/admin/users${r ? `?role=${r}` : ''}`}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                (role ?? '') === r ? 'bg-foreground text-background' : 'hover:bg-accent'
              )}
            >
              {r === '' ? 'Semua' : ROLE_LABEL[r as Role]}
            </a>
          ))}
        </div>
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau email..."
          className="flex-1 min-w-48 px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <button type="submit" className="px-4 py-1.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
          Cari
        </button>
      </form>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">User</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Role</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Orders</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-xs text-muted-foreground">Bergabung</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                    Tidak ada user ditemukan
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className={cn('hover:bg-accent/50 transition-colors', !user.isActive && 'opacity-50')}>
                  <td className="p-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                  </td>
                  <td className="p-3">
                    <span className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium', ROLE_BADGE[user.role])}>
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {user._count.ordersAsCustomer > 0 ? (
                      <span className="font-medium text-foreground">{user._count.ordersAsCustomer}</span>
                    ) : '—'}
                  </td>
                  <td className="p-3">
                    <span className={cn(
                      'text-[11px] px-2 py-0.5 rounded-full font-medium',
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    )}>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-3">
                    <UserActions userId={user.id} currentRole={user.role} isActive={user.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
