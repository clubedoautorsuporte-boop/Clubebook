'use client'

import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'

export function ShimmerButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <span
        aria-hidden
        className="animate-shimmer pointer-events-none absolute inset-0 skew-x-[-15deg] bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.22)_50%,transparent_60%)]"
      />
      {children}
    </button>
  )
}
