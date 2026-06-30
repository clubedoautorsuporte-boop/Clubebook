'use client'

import Link from 'next/link'
import { Clock, Download, ExternalLink, BookOpen, FileText } from 'lucide-react'

type EbookCardProps = {
  slug: string
  titulo: string
  subtitulo: string
  capitulosCount: number
  createdAt: string
  expired: boolean
  tipo: string
}

const GRADIENTS: [string, string][] = [
  ['#1e3a5f', '#2563eb'], ['#0f4c3a', '#10b981'], ['#3b1f6b', '#8b5cf6'],
  ['#7c2d12', '#f97316'], ['#1e3a5f', '#0ea5e9'], ['#14532d', '#22c55e'],
  ['#831843', '#ec4899'], ['#1e1b4b', '#6366f1'],
]

function titleToGradient(titulo: string): [string, string] {
  let hash = 0
  for (let i = 0; i < titulo.length; i++) hash = titulo.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function EbookCard({ slug, titulo, subtitulo, capitulosCount, createdAt, expired, tipo }: EbookCardProps) {
  const [from, to] = titleToGradient(titulo)
  const isLivro = tipo === 'livro'

  return (
    <article className={`flex flex-col rounded-xl border border-[#1c2438] overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[#2a3553] ${expired ? 'opacity-60' : ''}`} style={{ background: '#0d1220' }}>
      {/* Capa */}
      <div className="relative h-32 overflow-hidden" style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-lg bg-white/15 text-lg font-extrabold text-white backdrop-blur-sm">
          {titulo.charAt(0).toUpperCase()}
        </div>
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
          {isLivro && !expired && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">
              <BookOpen className="size-2.5" /> Completo
            </span>
          )}
          {!isLivro && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">
              <FileText className="size-2.5" /> Prévia
            </span>
          )}
          {expired && <span className="rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-bold text-white">Expirado</span>}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[13px] font-bold text-white leading-snug">{titulo}</h3>
        {subtitulo && <p className="mt-0.5 line-clamp-1 text-[11px] text-[#a0b0c8]">{subtitulo}</p>}

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[10px] text-[#8896b0] flex items-center gap-1">
            <Clock className="size-3" /> {formatDate(createdAt)}
          </span>
          <span className="text-[10px] text-[#8896b0]">{capitulosCount} caps</span>
        </div>

        <div className="mt-auto pt-3 flex gap-2">
          <Link
            href={`/receiver/${slug}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#1c2438] py-2 text-[11px] font-medium text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white"
          >
            <ExternalLink className="size-3" /> Ver
          </Link>
          {isLivro && (
            <a
              href={`/api/pdf/${slug}`}
              download
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 12px rgba(79,127,255,0.3)' }}
            >
              <Download className="size-3" /> PDF
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
