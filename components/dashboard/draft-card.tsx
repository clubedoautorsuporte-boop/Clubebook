'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Trash2, Sparkles } from 'lucide-react'

type DraftCardProps = {
  id: string
  titulo: string
  genero: string
  nomeAutor: string
  step: number
  updatedAt: string
}

const COVER_PAIRS: [string, string][] = [
  ['#1a3a6b', '#2563eb'],
  ['#0f3d2e', '#059669'],
  ['#3b1d6b', '#7c3aed'],
  ['#6b1d1d', '#dc2626'],
  ['#1d3a5c', '#0ea5e9'],
  ['#4a2000', '#d97706'],
  ['#1a1d6b', '#4f46e5'],
  ['#3d0f2e', '#be185d'],
]

function getColors(t: string): [string, string] {
  let h = 0
  for (let i = 0; i < t.length; i++) h = t.charCodeAt(i) + ((h << 5) - h)
  return COVER_PAIRS[Math.abs(h) % COVER_PAIRS.length]
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

const STEP_LABEL: Record<number, string> = {
  1: 'Etapa 1 — Dados do ebook',
  2: 'Etapa 2 — Materiais',
  3: 'Etapa 3 — Pronto para gerar',
}

export function DraftCard({ id, titulo, genero, step, updatedAt }: DraftCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [from, to] = getColors(titulo)
  const progress = Math.round((step / 3) * 100)
  const initial = titulo.charAt(0).toUpperCase()
  const SPINE_W = 24 // px — espessura da lombada

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Excluir este rascunho?')) return
    setDeleting(true)
    await fetch(`/api/draft?id=${id}`, { method: 'DELETE' }).catch(() => {})
    router.refresh()
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-[#1c2438] bg-[#0b0f1c] transition-all duration-200 hover:border-[#00e5c330] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${deleting ? 'pointer-events-none opacity-40' : ''}`}
    >
      {/* Delete */}
      <button
        onClick={handleDelete}
        className="absolute right-3 top-3 z-20 grid h-7 w-7 place-items-center rounded-lg text-[#2a3553] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-400 focus:opacity-100"
        style={{ opacity: undefined }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '')}
      >
        <Trash2 className="size-3.5" />
      </button>

      {/* ── 3-D Book ── */}
      <div className="flex items-center justify-center py-8" style={{ perspective: '900px' }}>
        <div
          style={{
            position: 'relative',
            width: 120,
            height: 168,
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-28deg) rotateX(4deg)',
            transition: 'transform .35s ease',
            filter: 'drop-shadow(-14px 20px 28px rgba(0,0,0,0.7))',
          }}
          className="hover:[transform:rotateY(-14deg)_rotateX(2deg)]"
        >
          {/* Lombada */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SPINE_W,
              height: '100%',
              transformOrigin: 'left center',
              transform: `rotateY(90deg) translateZ(-${SPINE_W / 2}px)`,
              background: `linear-gradient(180deg, ${from}cc, ${from}88)`,
              borderRadius: '3px 0 0 3px',
            }}
          />

          {/* Capa frontal */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)`,
              borderRadius: '0 4px 4px 0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {/* Textura suave */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.08,
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.3) 3px,rgba(255,255,255,.3) 4px)',
            }} />
            {/* Reflexo topo */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 60,
              background: 'linear-gradient(to bottom,rgba(255,255,255,.12),transparent)',
            }} />

            {/* Ícone + Inicial */}
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: 16, height: 16, color: '#00e5c3' }} />
            </div>

            <span style={{
              fontSize: 36, fontWeight: 900, color: 'rgba(255,255,255,0.9)',
              letterSpacing: -1, lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,.5)',
            }}>
              {initial}
            </span>

            {/* Rodapé da capa */}
            <div style={{
              position: 'absolute', bottom: 8, left: 6, right: 6,
              borderRadius: 6, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(0,229,195,.15)',
              padding: '3px 0', textAlign: 'center',
            }}>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(0,229,195,.75)', textTransform: 'uppercase' }}>
                Aurora IA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="px-5 pb-5">
        {/* Título + badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">{titulo}</h3>
          <span className="mt-0.5 shrink-0 rounded-md bg-[#4f7fff20] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4f7fff]">
            Draft
          </span>
        </div>

        {/* Meta */}
        <p className="mt-1 text-[11px] text-[#3a4a66]">
          {genero && <span className="mr-1.5">{genero} ·</span>}
          {timeAgo(updatedAt)}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] text-[#3a4a66]">{STEP_LABEL[step]}</span>
            <span className="text-[10px] font-bold text-[#00e5c3]">{progress}%</span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#0f1a2e]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg,#4f7fff,#00e5c3)',
                boxShadow: '0 0 8px rgba(0,229,195,.6)',
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(`/dashboard/criar?draft=${id}`)}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#00e5c318] bg-[#00e5c306] px-4 py-3 transition-all hover:border-[#00e5c340] hover:bg-[#00e5c310]"
        >
          <span className="text-sm font-semibold text-[#00e5c3]">Continuar criação</span>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#00e5c3] shadow-[0_0_10px_rgba(0,229,195,.35)]">
            <ArrowRight className="size-3.5 text-[#040810]" />
          </span>
        </button>
      </div>
    </div>
  )
}
