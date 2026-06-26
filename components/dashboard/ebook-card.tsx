'use client'

import Link from 'next/link'
import { ExternalLink, Clock, Download, BookOpen, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

type EbookCardProps = {
  slug: string
  titulo: string
  subtitulo: string
  capitulosCount: number
  createdAt: string
  expired: boolean
  tipo: string
}

const GRADIENTS = [
  ['#1e3a5f', '#2563eb'],
  ['#0f4c3a', '#10b981'],
  ['#3b1f6b', '#8b5cf6'],
  ['#7c2d12', '#f97316'],
  ['#1e3a5f', '#0ea5e9'],
  ['#14532d', '#22c55e'],
  ['#831843', '#ec4899'],
  ['#1e1b4b', '#6366f1'],
]

function titleToGradient(titulo: string): [string, string] {
  let hash = 0
  for (let i = 0; i < titulo.length; i++) hash = titulo.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length] as [string, string]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function EbookCard({ slug, titulo, subtitulo, capitulosCount, createdAt, expired, tipo }: EbookCardProps) {
  const [from, to] = titleToGradient(titulo)
  const initial = titulo.charAt(0).toUpperCase()
  const isLivro = tipo === 'livro'

  return (
    <article className={cn(
      'group relative flex flex-col rounded-2xl border bg-[#0f1523] transition-all duration-200',
      expired
        ? 'border-[#1c2438] opacity-55'
        : isLivro
          ? 'border-[#00e5c330] hover:border-[#00e5c360] hover:shadow-[0_0_28px_rgba(0,229,195,0.1)]'
          : 'border-[#1c2438] hover:border-[#4f7fff50] hover:shadow-[0_0_28px_rgba(79,127,255,0.09)]',
    )}>

      {/* Capa */}
      <div
        className="relative flex h-40 items-end justify-between overflow-hidden rounded-t-2xl p-4"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-black/20" />

        {/* Ícone inicial */}
        <div className="relative z-10 grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-2xl font-extrabold text-white backdrop-blur-sm">
          {initial}
        </div>

        {/* Badges */}
        <div className="relative z-10 flex flex-col items-end gap-1.5">
          {/* Badge tipo */}
          {isLivro ? (
            <span className="flex items-center gap-1 rounded-full bg-[#00e5c3] px-2.5 py-0.5 text-[10px] font-bold text-black">
              <BookOpen className="size-2.5" /> Livro completo
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white">
              <FileText className="size-2.5" /> Prévia
            </span>
          )}

          {/* Badge status */}
          {expired ? (
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">Expirado</span>
          ) : (
            <span className="rounded-lg bg-black/25 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
              {capitulosCount} caps
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight text-white">{titulo}</h3>
        {subtitulo && (
          <p className="mt-0.5 line-clamp-1 text-xs text-[#6b7a99]">{subtitulo}</p>
        )}

        {/* Format badges */}
        <div className="mt-2.5 flex gap-1.5">
          {isLivro ? (
            <>
              <span className="rounded-md bg-[#00e5c312] px-1.5 py-0.5 text-[10px] font-bold text-[#00e5c3]">PDF</span>
              <span className="rounded-md bg-[#00e5c312] px-1.5 py-0.5 text-[10px] font-bold text-[#00e5c3]">Livro</span>
              <span className="rounded-md bg-[#00e5c312] px-1.5 py-0.5 text-[10px] font-bold text-[#00e5c3]">Completo</span>
            </>
          ) : (
            <>
              {['PDF', 'DOCX', 'EPUB'].map(fmt => (
                <span key={fmt} className="rounded-md bg-[#4f7fff12] px-1.5 py-0.5 text-[10px] font-bold text-[#4f7fff]">{fmt}</span>
              ))}
            </>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-[#3a4a66]">
          <Clock className="size-3" />
          {formatDate(createdAt)}
        </div>

        {/* Ações */}
        {!expired ? (
          isLivro ? (
            // Livro completo: foco no download do PDF
            <div className="mt-4 flex gap-2">
              <a
                href={`/api/pdf/${slug}`}
                download
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00e5c3] py-2.5 text-xs font-bold text-black transition hover:bg-[#00cfb0]"
              >
                <Download className="size-3.5" /> Baixar PDF
              </a>
              <Link
                href={`/receiver/${slug}`}
                className="flex items-center justify-center gap-1 rounded-xl border border-[#1c2438] bg-[#080b14] px-3 py-2.5 text-xs text-[#6b7a99] transition hover:border-[#00e5c330] hover:text-white"
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          ) : (
            // Prévia: foco em ver o briefing + upgrade
            <div className="mt-4 flex gap-2">
              <Link
                href={`/receiver/${slug}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-2 text-xs font-medium text-[#c8d3eb] transition hover:border-[#4f7fff40] hover:text-white"
              >
                <ExternalLink className="size-3" /> Ver prévia
              </Link>
              <a
                href={`/api/pdf/${slug}`}
                download
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#4f7fff15] py-2 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
              >
                ↓ PDF
              </a>
            </div>
          )
        ) : (
          <div className="mt-4 rounded-xl bg-[#1c2438] py-2 text-center text-xs text-[#3a4a66]">
            Expirado após 30 dias
          </div>
        )}
      </div>
    </article>
  )
}
