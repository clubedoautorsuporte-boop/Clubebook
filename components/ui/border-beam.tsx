'use client'

import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  duration = 8,
  colorFrom = '#4f7fff',
  colorTo = '#00e5c3',
  className,
}: BorderBeamProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className,
      )}
      style={{
        padding: '1px',
        background: `conic-gradient(from var(--border-angle, 0deg), ${colorFrom}, ${colorTo}, transparent 35%)`,
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        animation: `border-spin ${duration}s linear infinite`,
      }}
    />
  )
}
