'use client'

import Link from 'next/link'
import { PenLine, Clock } from 'lucide-react'

type DraftCardProps = {
  id: string
  titulo: string
  genero: string
  nomeAutor: string
  step: number
  updatedAt: string
}

const STEP_LABELS = ['', 'O Ebook', 'Materiais', 'Gerar']
const GRADIENTS = [
  ['#1a2f4a', '#1e3a5f'],
  ['#1a2f3a', '#0f4c3a'],
  ['#2a1f4a', '#3b1f6b'],
  ['#3a1a12', '#7c2d12'],
]
function titleToGradient(t: string) {
  let h = 0
  for (let i = 0; i < t.length; i++) h = t.charCodeAt(i) + ((h << 5) - h)
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function DraftCard({ id, titulo, genero, nomeAutor, step, updatedAt }: DraftCardProps) {
  const [from, to] = titleToGradient(titulo)
  const progress = Math.round((step / 3) * 100)

  return (
    <article className="group relative flex flex-col rounded-2xl border border-[#4f7fff30] bg-[#0f1523] transition-all hover:border-[#4f7fff70] hover:shadow-[0_0_28px_rgba(79,127,255,0.12)]">
      {/* Cover */}
      <div
        className="relative flex h-40 items-end justify-between overflow-hidden rounded-t-2xl p-4"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-black/20" />

        {/* Initial */}
        <div className="relative z-10 grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-2xl font-extrabold text-white backdrop-blur-sm">
          {titulo.charAt(0).toUpperCase()}
        </div>

        <div className="relative z-10 flex flex-col items-end gap-1.5">
          <span className="rounded-full bg-[#4f7fff] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            ✏ Rascunho
          </span>
          <span className="rounded-lg bg-black/25 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
            Etapa {step}/3
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight text-white">{titulo}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-[#6b7a99]">
          {genero || 'Sem gênero'} · por {nomeAutor}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-[#6b7a99]">Progresso — {STEP_LABELS[step]}</span>
            <span className="text-[10px] font-bold text-[#4f7fff]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#1c2438]">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-[#3a4a66]">
          <Clock className="size-3" />
          {fmtDate(updatedAt)}
        </div>

        {/* CTA */}
        <Link
          href={`/dashboard/criar?draft=${id}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#4f7fff15] py-2.5 text-sm font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
        >
          <PenLine className="size-4" />
          Continuar editando
        </Link>
      </div>
    </article>
  )
}
