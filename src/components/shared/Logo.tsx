'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ href = '/home', size = 'md', className }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 28, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 36, text: 'text-2xl', sub: 'text-xs' },
  }
  const s = sizes[size]

  return (
    <Link href={href} className={cn('flex items-center gap-2.5 group', className)}>
      {/* Network node icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="16" cy="6" r="3.5" fill="#26bfbf" />
        <circle cx="5" cy="24" r="3.5" fill="#26bfbf" />
        <circle cx="27" cy="24" r="3.5" fill="#26bfbf" />
        <circle cx="16" cy="16" r="2.5" fill="#26bfbf" opacity="0.7" />
        <line x1="16" y1="9.5" x2="16" y2="13.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="17.5" x2="7" y2="21.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="17.5" x2="25" y2="21.5" stroke="#26bfbf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="20.5" x2="27" y2="20.5" stroke="#26bfbf" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
      </svg>
      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className={cn(s.text, 'font-bold text-foreground tracking-tight group-hover:text-brand transition-colors')}>
          ersya
          <span className="text-brand"> projects</span>
        </span>
        <span className={cn(s.sub, 'text-muted-foreground uppercase tracking-widest font-medium')}>
          software solution
        </span>
      </div>
    </Link>
  )
}
