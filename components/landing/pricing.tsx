'use client'

import { useRef } from 'react'
import { Check, Gift, Sparkles, Shield, Zap, FileText } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Sparkles as SparklesComp } from '@/components/ui/sparkles'
import { TimelineContent } from '@/components/ui/timeline-animation'
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal'
import { useCta } from './cta-context'

const ITEMS = [
  { icon: FileText, label: 'Ebook completo — até 10 capítulos' },
  { icon: Zap, label: 'Entrega em ~47 minutos por e-mail' },
  { icon: FileText, label: 'PDF + DOCX + EPUB inclusos' },
  { icon: Check, label: 'Revisão gramatical e ortográfica' },
  { icon: Check, label: 'Sumário, introdução e conclusão' },
  { icon: Check, label: 'Sugestão de título e subtítulo' },
  { icon: Shield, label: 'Direitos comerciais 100% seus' },
  { icon: Shield, label: 'Garantia de 7 dias sem burocracia' },
]

export function Pricing() {
  const { openModal } = useCta()
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="preco"
      ref={sectionRef}
      className="relative min-h-[85vh] overflow-hidden bg-[#080b14] px-5 py-28 md:px-8"
    >
      {/* Sparkles background */}
      <TimelineContent
        animationNum={4}
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <SparklesComp
          density={600}
          speed={0.6}
          color="#00e5c3"
          opacity={0.35}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(60%_60%,white,transparent)]"
        />
      </TimelineContent>

      {/* Blue glow orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(79,127,255,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Teal glow bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,229,195,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_70px]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <TimelineContent animationNum={0}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal">
              <Sparkles className="size-3" />
              Oferta especial
            </span>
          </TimelineContent>

          <h2 className="font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] tracking-tight text-white">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              containerClassName="justify-center flex-wrap"
              transition={{ type: 'spring', stiffness: 220, damping: 38, delay: 0.1 }}
            >
              Comece agora por R$ 67
            </VerticalCutReveal>
          </h2>

          <TimelineContent animationNum={1}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b7a99]">
              De R$ 497. Oferta por tempo limitado para os primeiros 50 pedidos do mês.
            </p>
          </TimelineContent>
        </div>

        {/* Card */}
        <TimelineContent animationNum={2}>
          <div className="relative overflow-hidden rounded-3xl border border-[#1c2438] bg-[#0f1523] p-10 shadow-2xl shadow-black/50">
            <BorderBeam colorFrom="#4f7fff" colorTo="#00e5c3" duration={6} size={280} />

            {/* Glow inner top */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-brand/10 blur-3xl" />

            {/* Price */}
            <div className="mb-6 flex items-baseline justify-center gap-3">
              <span className="text-lg text-[#6b7a99] line-through">R$ 497</span>
              <span className="font-heading text-[64px] font-extrabold leading-none text-white">
                R$ 67
              </span>
              <span className="text-sm text-[#6b7a99]">único</span>
            </div>

            {/* Discount badge */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/15 px-4 py-1 text-sm font-semibold text-teal">
                <Gift className="size-3.5" />
                -86% de desconto
              </span>
            </div>

            {/* Features grid */}
            <div className="mb-9 grid gap-3 sm:grid-cols-2">
              {ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-2.5 text-sm text-[#e8edf8]">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <ShimmerButton
              onClick={openModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] px-8 py-4 text-base font-bold text-white shadow-[0_0_32px_rgba(79,127,255,0.45)] transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="size-[18px]" aria-hidden="true" />
              Criar meu ebook por R$ 67
            </ShimmerButton>

            <p className="mt-4 text-center text-[13px] text-[#6b7a99]">
              Pagamento seguro · Garantia de 7 dias · Sem taxa de recorrência
            </p>
          </div>
        </TimelineContent>
      </div>
    </section>
  )
}
