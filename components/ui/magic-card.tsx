'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagicCardProps {
  children: ReactNode
  className?: string
  gradientColor?: string
}

export function MagicCard({
  children,
  className,
  gradientColor = 'rgba(79,127,255,0.08)',
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
          '--gc': gradientColor,
          background:
            'radial-gradient(circle at var(--mx) var(--my), var(--gc), transparent 60%), linear-gradient(180deg, #111829 0%, #0d1320 100%)',
          boxShadow: '0 0 0 1px #1c2438',
        } as React.CSSProperties
      }
      className={cn(className)}
    >
      {children}
    </div>
  )
}
