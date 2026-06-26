'use client'

import { useCta } from './cta-context'
import { ArrowRight, Clock, Shield, Star } from 'lucide-react'

export function Hero() {
  const { openModal } = useCta()

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#040810] px-5 pt-28 pb-16 text-center"
    >
      {/* Grid bg */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,127,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,127,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(79,127,255,0.12)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,229,195,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4f7fff30] bg-[#4f7fff08] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8aa6ff]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
          Inteligência Artificial para Criadores
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[clamp(38px,6.5vw,88px)] font-extrabold leading-[0.95] tracking-tighter text-white">
          SEU EBOOK{' '}
          <span className="bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] bg-clip-text text-transparent">
            PROFISSIONAL
          </span>
          <br />
          PRONTO EM MENOS
          <br />
          <span className="bg-gradient-to-r from-[#00e5c3] to-[#4f7fff] bg-clip-text text-transparent">
            DE 1 HORA
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#8090b0] md:text-lg">
          Você escolhe o tema. A <strong className="text-white">Aurora IA</strong> escreve, formata e entrega em{' '}
          <strong className="text-[#00e5c3]">PDF + DOCX + EPUB</strong> — com direitos comerciais 100% seus em até 47 minutos.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={openModal}
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(79,127,255,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(79,127,255,0.6)]"
          >
            CRIAR MEU EBOOK AGORA
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Ver como funciona
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#3a4a66]">
          {[
            { icon: Star, text: '+1.200 ebooks criados' },
            { icon: Clock, text: 'Entrega em ~47 minutos' },
            { icon: Shield, text: 'Garantia de 7 dias' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <Icon className="size-3.5 text-[#4f7fff]" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
