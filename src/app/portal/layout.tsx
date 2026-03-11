import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { Navbar } from '@/components/shared/Navbar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login?callbackUrl=/portal/dashboard')
  if (session.user?.role !== 'customer') redirect('/admin/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 container py-8 gap-8">
        <PortalSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
