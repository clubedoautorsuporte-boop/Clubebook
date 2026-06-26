'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Trash2, Clock, Sparkles } from 'lucide-react'

type DraftCardProps = {
  id: string
  titulo: string
  genero: string
  nomeAutor: string
  step: number
  updatedAt: string
}

const COVER_GRADIENTS = [
  ['#0d1f3c', '#0a3d62', '#1e6b9e'],
  ['#0d2818', '#0a4d2c', '#1a7a48'],
  ['#1f0d3c', '#3d0a62', '#6b1e9e'],
  ['#3c1a0d', '#621a0a', '#9e4a1e'],
  ['#0d2e3c', '#0a556b', '#1e8c9e'],
  ['#2e1a0d', '#5c2a0a', '#8c4a1e'],
  ['#0d1f3c', '#0a2d6b', '#1e4a9e'],
  ['#1a0d3c', '#2a0a5c', '#4a1e8c'],
]

function titleToGradient(t: string) {
  let h = 0
  for (let i = 0; i < t.length; i++) h = t.charCodeAt(i) + ((h << 5) - h)
  return COVER_GRADIENTS[Math.abs(h) % COVER_GRADIENTS.length]
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Agora'
  if (min < 60) return `${min}min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

const STEP_LABELS: Record<number, string> = { 1: 'Dados básicos', 2: 'Materiais', 3: 'Pronto para gerar' }

export function DraftCard({ id, titulo, genero, nomeAutor, step, updatedAt }: DraftCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const colors = titleToGradient(titulo)
  const progress = Math.round((step / 3) * 100)
  const initial = titulo.charAt(0).toUpperCase()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Excluir este rascunho?')) return
    setDeleting(true)
    await fetch(`/api/draft?id=${id}`, { method: 'DELETE' }).catch(() => {})
    router.refresh()
  }

  function handleContinue() {
    router.push(`/dashboard/criar?draft=${id}`)
  }

  return (
    <div className={`group relative flex flex-col rounded-2xl border border-[#00e5c320] bg-[#080e1a] transition-all duration-300 hover:border-[#00e5c340] hover:shadow-[0_0_40px_rgba(0,229,195,0.08)] ${deleting ? 'opacity-40 pointer-events-none' : ''}`}>

      {/* Botão deletar */}
      <button
        onClick={handleDelete}
        className="absolute right-3 top-3 z-20 grid h-7 w-7 place-items-center rounded-lg bg-[#0f1523cc] text-[#3a4a66] opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
      >
        <Trash2 className="size-3.5" />
      </button>

      {/* Capa do livro */}
      <div className="relative mx-5 mt-5 overflow-hidden rounded-xl" style={{ aspectRatio: '2/3', maxHeight: 200 }}>
        {/* Fundo gradiente */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)` }}
        />

        {/* Textura sutil */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }}
        />

        {/* Lombada do livro */}
        <div className="absolute inset-y-0 left-0 w-3 opacity-40"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.1), transparent)' }}
        />

        {/* Reflexo topo */}
        <div className="absolute inset-x-0 top-0 h-16 opacity-20"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)' }}
        />

        {/* Conteúdo da capa */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          {/* Ícone Aurora */}
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <Sparkles className="size-5 text-[#00e5c3]" />
          </div>

          {/* Inicial do título */}
          <div className="mt-1 text-3xl font-black text-white/90 tracking-tight drop-shadow-lg">
            {initial}
          </div>

          {/* Label GERE SUA CAPA */}
          <div className="mt-auto w-full">
            <div className="rounded-lg border border-[#00e5c320] bg-black/30 px-2 py-1 text-center backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00e5c3]/80">Gere sua capa</p>
            </div>
          </div>
        </div>

        {/* Overlay badge rascunho */}
        <div className="absolute left-2 top-2">
          <span className="rounded-md bg-[#4f7fff] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
            Rascunho
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        {/* Título */}
        <h3 className="line-clamp-1 text-sm font-bold text-[#00e5c3]">{titulo}</h3>

        {/* Meta */}
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#3a4a66]">
          <Clock className="size-3 shrink-0" />
          <span>{timeAgo(updatedAt)}</span>
          {genero && <><span>·</span><span className="truncate text-[#2a3553]">{genero}</span></>}
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-medium text-[#3a4a66]">{STEP_LABELS[step] ?? 'Em andamento'}</span>
            <span className="text-[10px] font-bold text-[#00e5c3]">{progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#0f1a2e]">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4f7fff, #00e5c3)',
                boxShadow: '0 0 6px rgba(0,229,195,0.5)',
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#00e5c320] bg-[#00e5c308] px-4 py-3 transition-all hover:border-[#00e5c350] hover:bg-[#00e5c312]"
        >
          <span className="text-sm font-semibold text-[#00e5c3]">Continuar criação</span>
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#00e5c3] shadow-[0_0_12px_rgba(0,229,195,0.4)]">
            <ArrowRight className="size-4 text-[#040810]" />
          </div>
        </button>
      </div>
    </div>
  )
}
