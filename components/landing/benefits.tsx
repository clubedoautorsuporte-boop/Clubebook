'use client'

import {
  Clock,
  Crown,
  FileText,
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'
import { WordPullUp } from '@/components/ui/word-pull-up'
import { Eyebrow } from './ui'

const ITEMS = [
  {
    icon: Zap,
    color: 'text-brand-soft',
    bg: 'bg-brand/10',
    title: 'IA de última geração',
    desc: 'Movida pelo mesmo modelo que escreve melhor do que 90% dos humanos.',
  },
  {
    icon: Clock,
    color: 'text-teal',
    bg: 'bg-teal/10',
    title: 'Entrega em ~47 minutos',
    desc: 'Mediana real dos nossos clientes. Não é promessa — é histórico.',
  },
  {
    icon: Crown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Autoria 100% sua',
    desc: 'Direitos comerciais completos. Venda, distribua, use como quiser.',
  },
  {
    icon: FileText,
    color: 'text-pink',
    bg: 'bg-pink/10',
    title: 'PDF · DOCX · EPUB',
    desc: 'Todos os formatos de uma vez. Amazon Kindle, Hotmart, e-mail.',
  },
  {
    icon: Shield,
    color: 'text-teal',
    bg: 'bg-teal/10',
    title: 'Garantia de 7 dias',
    desc: 'Se não ficar satisfeito, devolvemos 100% sem perguntas.',
  },
  {
    icon: TrendingUp,
    color: 'text-brand-soft',
    bg: 'bg-brand/10',
    title: 'Qualidade editorial',
    desc: 'Índice, capítulos, revisão e formatação. Pronto para o mercado.',
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Eyebrow>Vantagens</Eyebrow>
          <h2 className="max-w-2xl font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
            <WordPullUp text="Por que milhares de autores escolhem a Aurora" />
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, color, bg, title, desc }) => (
            <MagicCard
              key={title}
              className="rounded-2xl p-6 transition-all hover:-translate-y-1"
            >
              <div
                className={`mb-4 flex size-11 items-center justify-center rounded-xl ${bg} ${color}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="mb-2 font-heading text-[17px] font-extrabold text-foreground">
                {title}
              </div>
              <p className="text-sm leading-relaxed text-dim">{desc}</p>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
