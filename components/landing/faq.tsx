'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow } from './ui'
import { useCta } from './cta-context'

const ITEMS = [
  {
    q: 'Preciso saber escrever?',
    a: 'Não! Você só precisa ter a ideia e o tema. A Aurora escreve todo o conteúdo — parágrafos, capítulos, introdução, conclusão — do zero.',
  },
  {
    q: 'Em quanto tempo recebo o ebook?',
    a: 'A mediana dos nossos clientes é 47 minutos. O prazo máximo garantido é 1 hora após o envio do briefing.',
  },
  {
    q: 'Posso vender o ebook que criar?',
    a: 'Sim, com total liberdade. Você recebe os direitos comerciais completos. Pode vender na Hotmart, Amazon KDP, Eduzz, ou qualquer outra plataforma.',
  },
  {
    q: 'Quais formatos vêm inclusos?',
    a: 'PDF (para leitura e venda), DOCX (para editar no Word) e EPUB (compatível com Kindle e outros e-readers). Os três formatos estão inclusos no preço.',
  },
  {
    q: 'E se eu não gostar do resultado?',
    a: 'Garantia incondicional de 7 dias. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor sem perguntas.',
  },
  {
    q: 'Posso pedir revisões?',
    a: 'Sim, incluímos uma rodada de ajustes gratuita no prazo de 48h após a entrega. Alterações de tom, foco ou estrutura.',
  },
]

export function Faq() {
  const { openModal } = useCta()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-surface px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        {/* Left intro */}
        <div className="lg:sticky lg:top-28">
          <Eyebrow>Central de ajuda</Eyebrow>
          <h2 className="font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
            Ficou com alguma dúvida?
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-dim">
            Reunimos as perguntas mais comuns. Se não encontrar a sua, é só falar
            com a gente a qualquer momento.
          </p>
          <button
            onClick={openModal}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,127,255,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Tire todas as dúvidas
          </button>
        </div>

        {/* Right accordion */}
        <div className="flex flex-col gap-2.5">
          {ITEMS.map(({ q, a }, i) => {
            const isOpen = open === i
            return (
              <div
                key={q}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-ink transition-all',
                  isOpen ? 'border-brand/40' : 'border-line',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    'flex w-full items-center justify-between gap-4 px-6 py-[18px] text-left font-heading text-[15px] font-bold transition-colors',
                    isOpen ? 'text-brand-soft' : 'text-foreground',
                  )}
                  aria-expanded={isOpen}
                >
                  {q}
                  <Plus
                    className={cn(
                      'size-[18px] shrink-0 transition-transform',
                      isOpen ? 'rotate-45 text-brand' : 'text-dim',
                    )}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-dim">
                    {a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
