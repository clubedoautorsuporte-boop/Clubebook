'use client'

import { Check, Gift, Sparkles } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { WordPullUp } from '@/components/ui/word-pull-up'
import { Eyebrow, Pill } from './ui'
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

export function Pricing() {
  const { openModal } = useCta()

  return (
    <section
      id="preco"
      className="relative overflow-hidden bg-hero-gradient px-5 py-24 md:px-8"
    >
      <div className="pointer-events-none absolute -right-48 -top-48 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(79,127,255,0.2)_0%,transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow className="justify-center">Oferta especial</Eyebrow>
          <h2 className="font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
            <WordPullUp text="Comece agora por R$ 67" />
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-dim">
            De R$ 497. Oferta por tempo limitado para os primeiros 50 pedidos do
            mês.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-line bg-surface p-10 shadow-2xl shadow-black/30">
          <BorderBeam colorFrom="#4f7fff" colorTo="#00e5c3" duration={6} />

          <div className="mb-8 flex items-baseline justify-center gap-3">
            <span className="text-lg text-dim line-through">R$ 497</span>
            <span className="font-heading text-[56px] font-extrabold leading-none text-foreground">
              R$ 67
            </span>
            <span className="text-sm text-dim">único</span>
          </div>
          <div className="mb-8 flex justify-center">
            <Pill className="border-teal/40 bg-teal/15 text-teal">
              <Gift className="size-3" aria-hidden="true" />
              -86% de desconto
            </Pill>
          </div>

          <div className="mb-9 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((it) => (
              <div
                key={it}
                className="flex items-start gap-2.5 text-sm text-text"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                {it}
              </div>
            ))}
          </div>

          <ShimmerButton
            onClick={openModal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-8 py-4 text-base font-bold text-white shadow-[0_0_28px_rgba(79,127,255,0.4)] transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-[18px]" aria-hidden="true" />
            Criar meu ebook por R$ 67
          </ShimmerButton>
          <p className="mt-4 text-center text-[13px] text-dim">
            Pagamento seguro · Garantia de 7 dias · Sem taxa de recorrência
          </p>
        </div>
      </div>
    </section>
  )
}
