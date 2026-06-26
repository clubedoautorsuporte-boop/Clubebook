'use client'

import { Check, Gift, Sparkles, Lock, Clock, FileDown } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { TimelineContent } from '@/components/ui/timeline-animation'
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal'
import { useCta } from './cta-context'

const ITEMS = [
  'Ebook completo — até 10 capítulos',
  'Entrega em ~47 minutos por e-mail',
  'PDF + DOCX + EPUB inclusos',
  'Revisão gramatical e ortográfica',
  'Sumário, introdução e conclusão',
  'Sugestão de título e subtítulo',
  'Direitos comerciais 100% seus',
  'Garantia de 7 dias sem burocracia',
]

const TRUST = [
  { icon: Lock, label: 'Pagamento seguro' },
  { icon: Clock, label: 'Garantia de 7 dias' },
  { icon: FileDown, label: 'Entrega imediata' },
]

export function Pricing() {
  const { openModal } = useCta()

  return (
    <section
      id="preco"
      className="relative overflow-hidden bg-[#080b14] px-5 py-24 md:px-8"
    >
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff40] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(79,127,255,0.1)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-lg">

        {/* Eyebrow */}
        <TimelineContent animationNum={0} className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/8 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal">
            <Sparkles className="size-2.5" />
            Oferta por tempo limitado
          </span>
        </TimelineContent>

        {/* Heading */}
        <div className="mb-3 text-center">
          <h2 className="font-heading text-[clamp(26px,3.2vw,38px)] font-extrabold leading-tight tracking-tight text-white">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.1}
              staggerFrom="first"
              containerClassName="justify-center flex-wrap gap-x-2"
              transition={{ type: 'spring', stiffness: 240, damping: 40, delay: 0.05 }}
            >
              Comece agora por R$ 67
            </VerticalCutReveal>
          </h2>
        </div>

        <TimelineContent animationNum={1} className="text-center mb-10">
          <p className="text-sm text-[#6b7a99]">
            De <s>R$ 497</s>. Apenas para os primeiros 50 pedidos do mês.
          </p>
        </TimelineContent>

        {/* Card */}
        <TimelineContent animationNum={2}>
          <div className="relative overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0b1020] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)]">
            <BorderBeam colorFrom="#4f7fff" colorTo="#00e5c3" duration={7} size={260} />

            {/* Inner top glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff60] to-transparent" />

            <div className="p-7 md:p-9">

              {/* Price block */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-5xl font-extrabold leading-none text-white">R$ 67</span>
                    <span className="text-xs text-[#6b7a99]">pagamento único</span>
                  </div>
                  <span className="mt-1 text-sm text-[#6b7a99] line-through">De R$ 497</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg border border-teal/30 bg-teal/10 px-3 py-1.5 text-xs font-bold text-teal">
                  <Gift className="size-3" />
                  −86%
                </span>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px bg-[#1c2438]" />

              {/* Features */}
              <ul className="mb-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-teal/15">
                      <Check className="size-2.5 text-teal" strokeWidth={3} />
                    </span>
                    <span className="text-[13px] leading-snug text-[#c8d3eb]">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <ShimmerButton
                onClick={openModal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(79,127,255,0.5)]"
              >
                <Sparkles className="size-4" />
                Criar meu ebook por R$ 67
              </ShimmerButton>

              {/* Trust row */}
              <div className="mt-5 flex items-center justify-center gap-5">
                {TRUST.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-[#4a5568]">
                    <Icon className="size-3 text-[#3a4a66]" />
                    {label}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </TimelineContent>

      </div>
    </section>
  )
}
