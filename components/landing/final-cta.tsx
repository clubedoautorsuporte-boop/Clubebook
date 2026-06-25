'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { useCta } from './cta-context'

export function FinalCta() {
  const { openModal } = useCta()

  return (
    <section className="px-5 py-20 md:px-8">
      <div className="bg-band relative mx-auto max-w-6xl overflow-hidden rounded-[28px] px-8 py-14 md:px-14">
        <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,transparent_65%)]" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles className="size-3" aria-hidden="true" />
              Comece hoje
            </span>
            <h2 className="max-w-xl font-heading text-balance text-[clamp(26px,3.4vw,36px)] font-extrabold leading-[1.15] tracking-tight text-white">
              Ainda não publicou seu ebook?
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/80">
              Tudo o que você precisa para virar autor está a um clique. A Aurora
              cuida da escrita — você fica com os créditos.
            </p>
          </div>

          <button
            onClick={openModal}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-ink shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5"
          >
            Quero criar meu ebook
            <ArrowRight className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
