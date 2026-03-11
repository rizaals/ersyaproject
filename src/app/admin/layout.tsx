import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login?callbackUrl=/admin/dashboard')
  if (!['admin', 'superadmin'].includes(session.user?.role ?? '')) {
    redirect('/portal/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar userName={session.user?.name ?? 'Admin'} userRole={session.user?.role ?? ''} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
