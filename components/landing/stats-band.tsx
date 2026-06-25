'use client'

import { Heart } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

const STATS = [
  { value: 1200, prefix: '+', suffix: '', label: 'ebooks entregues' },
  { value: 8500, prefix: '+', suffix: '', label: 'autores ativos' },
  { value: 47, prefix: '', suffix: 'min', label: 'tempo médio de entrega' },
]

const MARQUEE = 'Transformando ideias em livros'

export function StatsBand() {
  return (
    <section className="bg-band px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-wrap gap-10">
          {STATS.map(({ value, prefix, suffix, label }) => (
            <div key={label}>
              <div className="font-heading text-[clamp(34px,4vw,48px)] font-extrabold leading-none text-white">
                <NumberTicker
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  duration={2200}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-white/75">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
            <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
            Sobre nós
          </div>
          <h2 className="font-heading text-balance text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.2] tracking-tight text-white">
            Somos muito mais que uma ferramenta: somos o atalho entre a sua ideia
            e um livro publicado.
          </h2>
        </div>
      </div>

      {/* Marquee */}
      <div className="mx-auto mt-14 max-w-6xl overflow-hidden border-t border-white/15 pt-8">
        <div className="flex w-max animate-marquee gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap font-heading text-lg font-extrabold text-white/85"
            >
              {MARQUEE}
              <Heart
                className="size-4 fill-white/80 text-white/80"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
