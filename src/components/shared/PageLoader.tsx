import { cn } from '@/lib/utils'

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
      <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-full mt-4" />
      </div>
    </div>
  )
}
