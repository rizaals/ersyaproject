'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Send, Loader2, Download, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface Page {
  name: string
  gjsData: any
}

interface ProjectBuilderProps {
  projectId: string
  orderId: string
  orderNumber: string
  serviceType: 'landing_page' | 'email'
  initialPages: Page[]
}

export function ProjectBuilder({
  projectId,
  orderId,
  orderNumber,
  serviceType,
  initialPages,
}: ProjectBuilderProps) {
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [delivering, setDelivering] = useState(false)
  const [pages, setPages] = useState<Page[]>(
    initialPages.length > 0 ? initialPages : [{ name: serviceType === 'email' ? 'Email' : 'Halaman 1', gjsData: null }]
  )
  const [currentIdx, setCurrentIdx] = useState(0)

  const isEmail = serviceType === 'email'
  const MAX_PAGES = 5

  // Load a page's gjsData into the editor
  const loadPage = useCallback((gjsData: any) => {
    const editor = editorRef.current
    if (!editor) return
    if (!gjsData) {
      editor.setComponents('')
      editor.setStyle('')
      return
    }
    if (gjsData.__html !== undefined) {
      editor.setComponents(gjsData.__html ?? '')
      if (gjsData.__css) editor.setStyle(gjsData.__css)
    } else {
      editor.loadProjectData(gjsData)
    }
  }, [])

  // Get current page gjsData from editor + update pages array
  const captureCurrentPage = useCallback((): Page[] => {
    const editor = editorRef.current
    if (!editor) return pages
    const gjsData = editor.getProjectData()
    return pages.map((p, i) => (i === currentIdx ? { ...p, gjsData } : p))
  }, [pages, currentIdx])

  useEffect(() => {
    let editor: any = null

    async function initGrapes() {
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
        assetManager: { upload: '/api/upload', uploadName: 'file' },
        canvas: {
          styles: isEmail
            ? []
            : ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'],
        },
      })

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

      // Load first page
      const firstPage = pages[0]
      if (firstPage?.gjsData) loadPage(firstPage.gjsData)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmail])

  const switchPage = (newIdx: number) => {
    if (!editorRef.current || newIdx === currentIdx) return
    const updatedPages = captureCurrentPage()
    setPages(updatedPages)
    setCurrentIdx(newIdx)
    loadPage(updatedPages[newIdx].gjsData)
  }

  const addPage = () => {
    if (pages.length >= MAX_PAGES) return
    const updatedPages = captureCurrentPage()
    const newPage: Page = { name: `Halaman ${updatedPages.length + 1}`, gjsData: null }
    const newPages = [...updatedPages, newPage]
    setPages(newPages)
    const newIdx = newPages.length - 1
    setCurrentIdx(newIdx)
    loadPage(null)
  }

  const removePage = (idx: number) => {
    if (pages.length <= 1) return
    const updatedPages = captureCurrentPage().filter((_, i) => i !== idx)
    const newIdx = Math.min(currentIdx, updatedPages.length - 1)
    setPages(updatedPages)
    setCurrentIdx(newIdx)
    loadPage(updatedPages[newIdx].gjsData)
  }

  const handleSave = async () => {
    if (!editorRef.current) return
    setSaving(true)
    const updatedPages = captureCurrentPage()
    setPages(updatedPages)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: updatedPages }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.message ?? 'Gagal menyimpan')
      else toast.success('Project tersimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDeliver = async () => {
    if (!editorRef.current) return
    if (!confirm('Kirim project ini untuk review oleh customer?')) return
    setDelivering(true)
    const updatedPages = captureCurrentPage()
    setPages(updatedPages)

    // For email: generate final HTML for inlining
    let htmlForInlining: string | undefined
    if (isEmail) {
      const html = editorRef.current.getHtml()
      const css = editorRef.current.getCss()
      htmlForInlining = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${html}</body></html>`
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: updatedPages, ...(htmlForInlining ? { htmlForInlining } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.message ?? 'Gagal mengirim')
      else {
        toast.success('Project dikirim! Customer sudah dinotifikasi.')
      }
    } finally {
      setDelivering(false)
    }
  }

  const handleExport = () => {
    if (!editorRef.current) return
    const html = editorRef.current.getHtml()
    const css = editorRef.current.getCss()
    const full = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`
    const blob = new Blob([full], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `order-${orderNumber}-page${currentIdx + 1}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-card shrink-0">
        <Link href={`/admin/orders/${orderId}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">Order #{orderNumber}</h1>
          <p className="text-xs text-muted-foreground">{isEmail ? 'Email Template' : 'Landing Page'} Builder</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export HTML
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !initialized}
            className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Simpan
          </button>
          <button
            onClick={handleDeliver}
            disabled={delivering || !initialized}
            className="flex items-center gap-1.5 bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {delivering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Kirim untuk Review
          </button>
        </div>
      </div>

      {/* Page tabs — LP only */}
      {!isEmail && (
        <div className="flex items-center gap-1 px-4 py-1.5 border-b bg-muted/30 shrink-0 overflow-x-auto">
          {pages.map((page, idx) => (
            <div key={idx} className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => switchPage(idx)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  idx === currentIdx
                    ? 'bg-brand text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {page.name}
              </button>
              {pages.length > 1 && (
                <button
                  onClick={() => removePage(idx)}
                  className="p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                  title="Hapus halaman"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          {pages.length < MAX_PAGES && (
            <button
              onClick={addPage}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            >
              <Plus className="h-3 w-3" /> Halaman baru
            </button>
          )}
        </div>
      )}

      {/* GrapesJS canvas */}
      <div ref={containerRef} className="flex-1" />
    </div>
  )
}
