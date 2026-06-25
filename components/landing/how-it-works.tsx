'use client'

import { BookMarked, PenLine, TrendingUp, ArrowRight } from 'lucide-react'
import { Eyebrow } from './ui'
import { useCta } from './cta-context'

const TRILHAS = [
  {
    icon: PenLine,
    bar: 'bg-brand',
    glow: 'shadow-[0_0_24px_rgba(79,127,255,0.45)]',
    iconBg: 'bg-brand-gradient',
    title: 'Quero criar meu primeiro ebook',
    desc: 'Dê o tema e o público. A Aurora escreve capítulos, sumário e conclusão do zero.',
  },
  {
    icon: BookMarked,
    bar: 'bg-teal',
    glow: 'shadow-[0_0_24px_rgba(0,229,195,0.4)]',
    iconBg: 'bg-teal-gradient',
    title: 'Quero vender meu ebook',
    desc: 'Receba PDF, DOCX e EPUB prontos para Hotmart, Amazon KDP e Eduzz.',
  },
  {
    icon: TrendingUp,
    bar: 'bg-pink',
    glow: 'shadow-[0_0_24px_rgba(255,79,191,0.4)]',
    iconBg: 'bg-pink-gradient',
    title: 'Quero escalar como autor',
    desc: 'Produza uma coleção inteira de ebooks em dias, não em meses.',
  },
]

export function HowItWorks() {
  const { openModal } = useCta()

  return (
    <section id="trilhas" className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Trilhas</Eyebrow>
            <h2 className="font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
              Descubra como o Clube do Autor IA pode te ajudar a publicar mais!
            </h2>
          </div>
          <p className="text-base leading-relaxed text-dim">
            Pensamos nas melhores trilhas para você começar a escrever e
            aumentar sua renda. Não sabe por onde começar? A Aurora te ajuda!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TRILHAS.map(({ icon: Icon, bar, glow, iconBg, title, desc }) => (
            <button
              key={title}
              onClick={openModal}
              className="group card-soft overflow-hidden rounded-2xl text-left transition-all hover:-translate-y-1"
            >
              <div className={`h-1.5 w-full ${bar}`} />
              <div className="p-7">
                <div
                  className={`mb-5 flex size-12 items-center justify-center rounded-xl ${iconBg} ${glow}`}
                >
                  <Icon className="size-[22px] text-white" aria-hidden="true" />
                </div>
                <div className="mb-2.5 font-heading text-[17px] font-extrabold text-foreground">
                  {title}
                </div>
                <p className="text-sm leading-relaxed text-dim">{desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-soft transition-colors group-hover:text-brand">
                  Começar agora
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
