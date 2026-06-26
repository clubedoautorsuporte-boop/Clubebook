'use client'

import { BookOpen, Sparkles, Lock, Clock, FileDown } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { TimelineContent } from '@/components/ui/timeline-animation'
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal'
import PricingCard from '@/components/ui/pricing-card'
import { useCta } from './cta-context'

const FEATURES = [
  { label: 'Ebook completo — até 10 capítulos' },
  { label: 'Entrega em ~47 minutos por e-mail' },
  { label: 'PDF + DOCX + EPUB inclusos' },
  { label: 'Revisão gramatical e ortográfica' },
  { label: 'Sumário, introdução e conclusão' },
  { label: 'Sugestão de título e subtítulo' },
  { label: 'Direitos comerciais 100% seus' },
  { label: 'Garantia de 7 dias sem burocracia' },
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
      {/* Glow top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff30] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(79,127,255,0.07)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-xl">

        {/* Eyebrow */}
        <TimelineContent animationNum={0} className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4f7fff30] bg-[#4f7fff10] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#8aa6ff]">
            <Sparkles className="size-2.5" />
            Oferta por tempo limitado
          </span>
        </TimelineContent>

        {/* Heading */}
        <div className="mb-2 text-center">
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
            De <s className="text-[#4a5568]">R$ 497</s>. Apenas para os primeiros 50 pedidos do mês.
          </p>
        </TimelineContent>

        {/* Pricing card */}
        <TimelineContent animationNum={2} className="relative">
          <div className="relative">
            <BorderBeam colorFrom="#4f7fff" colorTo="#00e5c3" duration={7} size={300} />
            <PricingCard
              icon={<BookOpen className="size-7" />}
              name="Clube do Autor IA"
              subtitle="Seu ebook profissional pronto em ~47 min"
              price="R$ 67"
              periodLabel="pagamento único"
              recommended
              recommendedLabel="-86% OFF"
              features={FEATURES}
              cta={{ label: 'Criar meu ebook agora', onClick: openModal }}
            />
          </div>
        </TimelineContent>

        {/* Trust bar */}
        <TimelineContent animationNum={3} className="mt-5 flex items-center justify-center gap-6">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[11px] text-[#3a4a66]">
              <Icon className="size-3" />
              {label}
            </div>
          ))}
        </TimelineContent>

      </div>
    </section>
  )
}
