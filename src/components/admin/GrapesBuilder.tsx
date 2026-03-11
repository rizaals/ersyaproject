'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { Template, Category } from '@prisma/client'

type TemplateWithCategory = Template & { category: Category }

interface GrapesBuilderProps {
  template: TemplateWithCategory
}

export function GrapesBuilder({ template }: GrapesBuilderProps) {
  const router = useRouter()
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string>(template.status)
  const [initialized, setInitialized] = useState(false)

  const isEmail = template.serviceType === 'email'

  useEffect(() => {
    let editor: any = null

    async function initGrapes() {
      // Dynamically import GrapesJS to avoid SSR issues
      await import('grapesjs/dist/css/grapes.min.css')
      const grapesjs = (await import('grapesjs')).default

      const { default: presetWebpage } = await import('grapesjs-preset-webpage')

      if (!containerRef.current || editorRef.current) return

      editor = grapesjs.init({
        container: containerRef.current,
        height: '100%',
        plugins: [presetWebpage],
        pluginsOpts: {
          [presetWebpage as unknown as string]: { blocks: ['link-block', 'quote', 'text-basic'] },
        },
        storageManager: false,
        assetManager: {
          upload: '/api/upload',
          uploadName: 'file',
        },
        canvas: {
          styles: isEmail
            ? []
            : ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'],
        },
      })

      // Inject email canvas body styles after canvas iframe loads
      if (isEmail) {
        editor.on('load', () => {
          const frameDoc = editor.Canvas?.getDocument?.()
          if (frameDoc?.head) {
            const style = frameDoc.createElement('style')
            style.textContent = 'body{margin:0;padding:24px 0;background:#e9e9e9;font-family:Arial,sans-serif;}'
            frameDoc.head.appendChild(style)
          }
        })
      }

      // Load saved GJS data if any
      if (template.gjsData) {
        try {
          const gjsData = typeof template.gjsData === 'string'
            ? JSON.parse(template.gjsData)
            : template.gjsData

          if (gjsData.__html !== undefined) {
            // HTML format (dari seed / import)
            editor.setComponents(gjsData.__html ?? '')
            if (gjsData.__css) editor.setStyle(gjsData.__css)
          } else {
            // Native GrapesJS project format
            editor.loadProjectData(gjsData)
          }
        } catch {
          console.warn('Failed to load template GJS data')
        }
      }

      editorRef.current = editor
      setInitialized(true)
    }

    initGrapes()

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [isEmail, template.gjsData])

  const handleSave = async (newStatus?: string) => {
    if (!editorRef.current) return
    setSaving(true)
    try {
      const gjsData = editorRef.current.getProjectData()

      const res = await fetch(`/api/templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gjsData,
          ...(newStatus ? { status: newStatus } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal menyimpan')
      } else {
        if (newStatus) setStatus(newStatus)
        toast.success(newStatus ? `Template di-${newStatus}` : 'Template tersimpan')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleExportHTML = () => {
    if (!editorRef.current) return
    const html = editorRef.current.getHtml()
    const css = editorRef.current.getCss()
    const full = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`
    const blob = new Blob([full], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.slug}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-card shrink-0">
        <Link href="/admin/templates" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">{template.name}</h1>
          <p className="text-xs text-muted-foreground">{isEmail ? 'Email Template' : 'Landing Page'} · {template.category.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
          }`}>
            {status}
          </span>
          <button
            onClick={handleExportHTML}
            className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export HTML
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving || !initialized}
            className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Simpan Draft
          </button>
          <button
            onClick={() => handleSave(status === 'active' ? 'draft' : 'active')}
            disabled={saving || !initialized}
            className="flex items-center gap-1.5 bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {status === 'active' ? (
              <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
            ) : (
              <><Eye className="h-3.5 w-3.5" /> Publish</>
            )}
          </button>
        </div>
      </div>

      {/* GrapesJS container */}
      <div ref={containerRef} className="flex-1" />
    </div>
  )
}
