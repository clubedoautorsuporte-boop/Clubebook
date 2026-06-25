'use client'

import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Brush,
  FileText,
  PenLine,
  ShieldCheck,
} from 'lucide-react'
import { Eyebrow } from './ui'
import { useCta } from './cta-context'

const TABS = [
  {
    icon: PenLine,
    title: 'Editor com IA',
    desc: 'A Aurora gera capítulos, introdução, conclusão e sumário a partir de um briefing simples — você só revisa.',
    preview: {
      label: 'Gerando capítulo 4 de 8',
      lines: ['Introdução ao tema', 'Estratégias práticas', 'Estudos de caso'],
    },
  },
  {
    icon: FileText,
    title: 'Múltiplos formatos',
    desc: 'Exporte em PDF, DOCX e EPUB de uma só vez. Compatível com Kindle, Hotmart e qualquer leitor.',
    preview: {
      label: 'Exportando arquivos',
      lines: ['meu-ebook.pdf', 'meu-ebook.docx', 'meu-ebook.epub'],
    },
  },
  {
    icon: Brush,
    title: 'Capa profissional',
    desc: 'Sugestões de título, subtítulo e arte de capa alinhadas ao seu nicho e público-alvo.',
    preview: {
      label: 'Gerando capa',
      lines: ['3 conceitos de design', 'Título + subtítulo', 'Paleta do nicho'],
    },
  },
  {
    icon: ShieldCheck,
    title: 'Direitos comerciais',
    desc: 'O conteúdo é 100% seu. Venda, distribua e licencie sem pagar royalties ou recorrência.',
    preview: {
      label: 'Licença de autoria',
      lines: ['Uso comercial liberado', 'Sem royalties', 'Sem recorrência'],
    },
  },
]

export function Solutions() {
  const { openModal } = useCta()
  const [active, setActive] = useState(0)
  const tab = TABS[active]
  const PreviewIcon = tab.icon

  return (
    <section id="recursos" className="bg-surface px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Eyebrow>Recursos</Eyebrow>
          <h2 className="max-w-2xl font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
            Tudo o que você precisa para publicar com qualidade de editora
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Tabs */}
          <div className="flex flex-col">
            {TABS.map(({ icon: Icon, title, desc }, i) => {
              const isActive = i === active
              return (
                <button
                  key={title}
                  onClick={() => setActive(i)}
                  className={`flex gap-4 border-l-2 py-5 pl-5 pr-3 text-left transition-colors ${
                    isActive
                      ? 'border-brand bg-brand/[0.06]'
                      : 'border-line hover:border-brand/40'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-brand/15 text-brand-soft'
                        : 'bg-ink text-dim'
                    }`}
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-heading text-[17px] font-bold text-foreground">
                      {title}
                    </span>
                    {isActive && (
                      <span className="mt-1.5 block text-sm leading-relaxed text-dim">
                        {desc}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}

            <button
              onClick={openModal}
              className="mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand-soft transition-colors hover:text-brand"
            >
              Quero saber mais
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Visual preview */}
          <div className="card-glow relative overflow-hidden rounded-3xl border border-line bg-ink p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,rgba(79,127,255,0.2)_0%,transparent_65%)]" />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_0_18px_rgba(79,127,255,0.5)]">
                  <PreviewIcon className="size-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-foreground">
                    {tab.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-teal">
                    <span className="inline-block size-[7px] rounded-full bg-teal shadow-[0_0_8px_rgba(0,229,195,0.8)]" />
                    {tab.preview.label}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {tab.preview.lines.map((line) => (
                  <div
                    key={line}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text"
                  >
                    <BookOpen
                      className="size-4 shrink-0 text-brand-soft"
                      aria-hidden="true"
                    />
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line">
                <div className="h-full w-[68%] rounded-full bg-teal-gradient shadow-[0_0_12px_rgba(0,229,195,0.6)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
