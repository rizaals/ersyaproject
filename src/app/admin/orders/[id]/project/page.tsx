import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProjectBuilder } from '@/components/admin/ProjectBuilder'

export const metadata: Metadata = { title: 'Project Builder' }

type Props = { params: { id: string } }

export default async function ProjectBuilderPage({ params }: Props) {
  const session = await auth()
  if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
    notFound()
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      template: { select: { gjsData: true, serviceType: true } },
      project: true,
    },
  })
  if (!order) notFound()

  // Get or create project
  let project = order.project
  if (!project) {
    const isEmail = order.serviceType === 'email'
    const gjsData = order.template?.gjsData ?? null
    project = await prisma.project.create({
      data: {
        orderId: order.id,
        serviceType: isEmail ? 'email' : 'landing_page',
        name: `Project #${order.orderNumber}`,
        pages: [{ name: isEmail ? 'Email' : 'Halaman 1', gjsData }],
      },
    })
  }

  const pages = project.pages as Array<{ name: string; gjsData: any }>

  return (
    <div className="-m-6 lg:-m-8 h-screen flex flex-col">
      <ProjectBuilder
        projectId={project.id}
        orderId={order.id}
        orderNumber={order.orderNumber}
        serviceType={order.serviceType as 'landing_page' | 'email'}
        initialPages={pages}
      />
    </div>
  )
}
