import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { order: { select: { customerId: true, orderNumber: true } } },
  })
  if (!project) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  // Allow: owner customer or admin
  const isAdmin = ['admin', 'superadmin'].includes(session.user.role ?? '')
  const isOwner = project.order.customerId === session.user.id
  if (!isAdmin && !isOwner) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const pageIdx = parseInt(url.searchParams.get('page') ?? '0', 10)

  // Email: return inlined HTML
  if (project.serviceType === 'email') {
    const html = project.inlinedHtml ?? ''
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="email-${project.order.orderNumber}.html"`,
      },
    })
  }

  // Landing Page: build HTML from gjsData for the requested page
  const pages = project.pages as Array<{ name: string; gjsData: any }>
  const page = pages[pageIdx]
  if (!page) return NextResponse.json({ message: 'Halaman tidak ditemukan' }, { status: 404 })

  const gjsData = page.gjsData
  let html = ''
  let css = ''

  if (gjsData) {
    if (gjsData.__html !== undefined) {
      html = gjsData.__html ?? ''
      css = gjsData.__css ?? ''
    } else if (gjsData.pages?.[0]?.frames?.[0]?.component) {
      // Native GrapesJS format — return raw gjsData as JSON comment, not renderable
      // Ideally we'd use GrapesJS server-side but it's browser-only
      // Fallback: return what we can
      html = `<!-- GrapesJS project data — open in builder to export -->`
    }
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${page.name}</title>
  <style>${css}</style>
</head>
<body>${html}</body>
</html>`

  return new NextResponse(fullHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="lp-${project.order.orderNumber}-page${pageIdx + 1}.html"`,
    },
  })
}
