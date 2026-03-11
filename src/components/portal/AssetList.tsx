import { Download, FileCode, Image } from 'lucide-react'
import type { OrderAsset } from '@prisma/client'

interface AssetListProps {
  assets: OrderAsset[]
}

function fileIcon(type: string | null) {
  if (!type) return FileCode
  if (type.startsWith('image/')) return Image
  return FileCode
}

export function AssetList({ assets }: AssetListProps) {
  if (assets.length === 0) return null

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="font-semibold text-sm mb-3">File Hasil ({assets.length})</h2>
      <div className="space-y-2">
        {assets.map((asset) => {
          const Icon = fileIcon(asset.fileType)
          return (
            <a
              key={asset.id}
              href={asset.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{asset.fileName}</p>
                {asset.fileSize && (
                  <p className="text-[10px] text-muted-foreground">
                    {(asset.fileSize / 1024).toFixed(0)} KB
                  </p>
                )}
              </div>
              <Download className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
