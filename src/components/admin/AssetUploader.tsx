'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AssetUploaderProps {
  orderId: string
}

export function AssetUploader({ orderId }: AssetUploaderProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'order-assets')

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        toast.error(uploadData.message ?? 'Gagal upload')
        return
      }

      // 2. Register asset to order
      const assetRes = await fetch(`/api/orders/${orderId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: uploadData.data.url,
          fileType: file.type,
          fileSize: file.size,
        }),
      })
      if (!assetRes.ok) {
        toast.error('Gagal menyimpan asset')
        return
      }
      setUploadedFile(file.name)
      toast.success('File berhasil diupload!')
      router.refresh()
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-semibold text-sm mb-3">Upload File Hasil</h3>
      <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" id="asset-upload" />
      <label
        htmlFor="asset-upload"
        className="flex flex-col items-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-brand/60 transition-colors"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        ) : uploadedFile ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground text-center">
          {uploading ? 'Mengupload...' : uploadedFile ? `Terakhir: ${uploadedFile}` : 'Klik untuk upload file hasil (HTML, ZIP, Image)'}
        </span>
      </label>
    </div>
  )
}
