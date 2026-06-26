'use client'

import { Check, X } from 'lucide-react'

const ROWS = [
  { label: 'Tempo de entrega', old: 'Meses ou anos', new: '~47 minutos' },
  { label: 'Custo médio', old: 'R$ 3.000 – R$ 15.000', new: 'R$ 67 por ebook' },
  { label: 'Revisão gramatical', old: 'Custo extra', new: 'Inclusa' },
  { label: 'PDF + DOCX + EPUB', old: 'Formato único', new: 'Todos os formatos' },
  { label: 'Direitos comerciais', old: 'Contratos complexos', new: '100% seus' },
  { label: 'Sumário e estrutura', old: 'Manual e demorado', new: 'Automático' },
  { label: 'Reescrita ou ajuste', old: 'Cobra extra', new: 'Garantia de 7 dias' },
  { label: 'Escalável (N ebooks)', old: 'Impossível', new: 'Quantos quiser' },
]

export function Comparison() {
  return (
    <section className="bg-[#040810] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3a4a66]">Comparativo</p>
          <h2 className="font-heading text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-tighter text-white">
            ESCRITORES TRADICIONAIS{' '}
            <span className="bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] bg-clip-text text-transparent">
              FICARAM PARA TRÁS
            </span>
          </h2>
          <p className="mt-4 text-[#6b7a99]">
            Veja por que +1.200 autores escolheram a Aurora IA em vez do método tradicional.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1c2438]">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-[#1c2438] bg-[#080b14]">
            <div className="px-6 py-4 text-sm font-semibold text-[#6b7a99]">Critério</div>
            <div className="border-x border-[#1c2438] px-6 py-4 text-center text-sm font-semibold text-[#6b7a99]">
              Método tradicional
            </div>
            <div className="px-6 py-4 text-center text-sm font-bold text-[#00e5c3]">
              Clube do Autor IA ✨
            </div>
          </div>

          {ROWS.map(({ label, old: oldVal, new: newVal }, i) => (
            <div
              key={label}
              className={`grid grid-cols-3 border-b border-[#1c2438] last:border-0 ${
                i % 2 === 0 ? 'bg-[#0a0d16]' : 'bg-[#080b14]'
              }`}
            >
              <div className="flex items-center px-6 py-4 text-sm font-medium text-[#c8d3eb]">{label}</div>
              <div className="flex items-center justify-center gap-2 border-x border-[#1c2438] px-6 py-4">
                <X className="size-4 shrink-0 text-red-500/70" />
                <span className="text-center text-xs text-[#6b7a99]">{oldVal}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-6 py-4">
                <Check className="size-4 shrink-0 text-[#00e5c3]" />
                <span className="text-center text-xs font-semibold text-white">{newVal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
