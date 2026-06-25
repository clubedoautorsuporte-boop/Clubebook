'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

interface NumberTickerProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  className,
}: NumberTickerProps) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()

          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            setCurrent(easeOutQuart(progress) * value)
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  const formatted = Math.floor(current).toLocaleString('pt-BR')

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
