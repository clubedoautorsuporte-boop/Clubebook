import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(className)}
      style={{
        background: 'linear-gradient(90deg, #4f7fff, #00e5c3, #ff4fbf, #4f7fff)',
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        animation: 'gradient-text 4s linear infinite',
      }}
    >
      {children}
    </span>
  )
}
