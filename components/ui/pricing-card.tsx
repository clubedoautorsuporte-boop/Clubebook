'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type PricingFeature = {
  label: React.ReactNode
  included?: boolean
}

export type PricingCardProps = {
  icon?: React.ReactNode
  name: string
  subtitle?: string
  price: number | string
  currency?: string
  periodLabel?: string
  recommended?: boolean
  recommendedLabel?: string
  features: PricingFeature[]
  cta?: {
    label?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    href?: string
  }
  className?: string
}

export default function PricingCard({
  icon,
  name,
  subtitle,
  price,
  currency = 'R$',
  periodLabel = 'pagamento único',
  recommended = false,
  recommendedLabel = 'Recomendado',
  features,
  cta,
  className,
}: PricingCardProps) {
  const priceDisplay =
    typeof price === 'number' ? `${currency} ${price}` : price

  return (
    <section
      aria-label={`Plano ${name}`}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0b1020] p-6 md:p-8',
        'shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {/* Top border glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff50] to-transparent" />

      {/* Recommended badge */}
      {recommended && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-[#4f7fff] px-3 py-1 text-[11px] font-semibold text-white">
          {recommendedLabel}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className="mb-4 text-[#4f7fff]" aria-hidden>
          {icon}
        </div>
      )}

      {/* Name + subtitle */}
      <h3 className="text-xl font-bold text-white">{name}</h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-[#6b7a99]">{subtitle}</p>
      )}

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-heading text-5xl font-extrabold leading-none text-[#4f7fff]">
          {priceDisplay}
        </span>
        <span className="text-sm text-[#6b7a99]">{periodLabel}</span>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-[#1c2438]" />

      {/* Features */}
      <ul className="space-y-3">
        {features.map((f, i) => {
          const ok = f.included !== false
          return (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span
                className={cn(
                  'mt-0.5 inline-grid h-5 w-5 shrink-0 place-items-center rounded-full',
                  ok
                    ? 'bg-teal-500/10 ring-1 ring-teal-500/30'
                    : 'bg-[#1c2438] ring-1 ring-[#2a3450]',
                )}
                aria-hidden
              >
                {ok ? (
                  <svg viewBox="0 0 20 20" className="h-3 w-3 text-[#00e5c3]" fill="currentColor">
                    <path d="M16.7 6.3a1 1 0 0 0-1.4-1.4L8 12.2 4.7 8.9a1 1 0 1 0-1.4 1.4L7.3 14a1 1 0 0 0 1.4 0l8-8Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="h-3 w-3 text-[#3a4a66]" fill="currentColor">
                    <path d="M6.2 5 5 6.2 8.8 10 5 13.8 6.2 15 10 11.2 13.8 15 15 13.8 11.2 10 15 6.2 13.8 5 10 8.8z" />
                  </svg>
                )}
              </span>
              <span className={ok ? 'text-[#c8d3eb]' : 'text-[#3a4a66] line-through'}>
                {f.label}
              </span>
            </li>
          )
        })}
      </ul>

      {/* CTA */}
      {cta && (
        <div className="mt-7">
          {cta.href ? (
            <a
              href={cta.href}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(79,127,255,0.5)]"
            >
              {cta.label ?? 'Escolher plano'}
            </a>
          ) : (
            <button
              type="button"
              onClick={cta.onClick}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(79,127,255,0.5)]"
            >
              {cta.label ?? 'Escolher plano'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
