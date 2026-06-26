'use client'

import Link from 'next/link'
import { BookOpen, FileDown, ExternalLink, Clock, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type EbookCardProps = {
  slug: string
  titulo: string
  subtitulo: string
  capitulosCount: number
  createdAt: string
  expired: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function EbookCard({ slug, titulo, subtitulo, capitulosCount, createdAt, expired }: EbookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className={cn(
      'group relative flex flex-col rounded-2xl border bg-[#0f1523] transition-all duration-200',
      expired ? 'border-[#1c2438] opacity-60' : 'border-[#1c2438] hover:border-[#4f7fff50] hover:shadow-[0_0_24px_rgba(79,127,255,0.08)]',
    )}>
      {/* Cover area */}
      <div className="relative flex h-36 items-center justify-center rounded-t-2xl bg-gradient-to-br from-[#0d1526] to-[#111827]">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#4f7fff20] to-[#00e5c310] ring-1 ring-[#4f7fff20]">
          <BookOpen className="size-8 text-[#4f7fff]" />
        </div>
        {/* Status badge */}
        <span className={cn(
          'absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
          expired ? 'bg-amber-500/10 text-amber-400' : 'bg-teal-500/10 text-teal-400',
        )}>
          {expired ? 'Expirado' : 'Disponível'}
        </span>
        {/* Chapter count */}
        <span className="absolute bottom-3 left-3 rounded-lg bg-[#080b14]/80 px-2 py-1 text-[10px] font-medium text-[#6b7a99] backdrop-blur-sm">
          {capitulosCount} capítulos
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight text-white">{titulo}</h3>
        {subtitulo && <p className="mt-0.5 line-clamp-1 text-xs text-[#6b7a99]">{subtitulo}</p>}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-[#3a4a66]">
          <Clock className="size-3" />
          {formatDate(createdAt)}
        </div>

        {/* Actions */}
        {!expired ? (
          <div className="mt-4 flex gap-2">
            <Link
              href={`/receiver/${slug}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-2 text-xs font-medium text-[#c8d3eb] transition hover:border-[#4f7fff40] hover:text-white"
            >
              <ExternalLink className="size-3" />
              Ver briefing
            </Link>
            <a
              href={`/api/pdf/${slug}`}
              download
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4f7fff15] py-2 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
            >
              <FileDown className="size-3" />
              Baixar PDF
            </a>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-[#1c2438] py-2 text-center text-xs text-[#3a4a66]">
            Link expirado após 30 dias
          </div>
        )}
      </div>
    </article>
  )
}
