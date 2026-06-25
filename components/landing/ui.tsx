import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ────────────────────────────────────────────────
   Standardized type scale (Braip-style)
   - Eyebrow:  text-xs  (12px) mono uppercase, brand
   - H2:       clamp(26px → 34px) extrabold
   - Body/Sub: text-base (16px) leading-relaxed, dim
   - Card title: text-[17px] bold
   - Card body:  text-sm (14px)
   ──────────────────────────────────────────────── */

export function Pill({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/[0.07] px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-brand',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* Braip-style eyebrow: small bullet + label, left aligned by default */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-soft',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </div>
  )
}

export function H2({
  children,
  center = false,
  className,
}: {
  children: ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <h2
      className={cn(
        'font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground',
        center && 'text-center',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Sub({
  children,
  center = false,
  className,
}: {
  children: ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'mt-4 max-w-xl text-base leading-relaxed text-dim',
        center && 'mx-auto text-center',
        className,
      )}
    >
      {children}
    </p>
  )
}
