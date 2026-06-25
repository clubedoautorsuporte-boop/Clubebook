'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface WordPullUpProps {
  text: string
  className?: string
}

export function WordPullUp({ text, className }: WordPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} className={cn(className)}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className={cn(
            'mr-[0.25em] inline-block last:mr-0',
            visible ? 'animate-fade-in-up' : 'opacity-0',
          )}
          style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
