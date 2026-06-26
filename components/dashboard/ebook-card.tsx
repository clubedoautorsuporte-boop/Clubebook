'use client'

import Link from 'next/link'
import { BookOpen, FileDown, ExternalLink, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type EbookCardProps = {
  slug: string
  titulo: string
  subtitulo: string
  capitulosCount: number
  createdAt: string
  expired: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function EbookCard({ slug, titulo, subtitulo, capitulosCount, createdAt, expired }: EbookCardProps) {
  return (
    <article
      className={cn(
        'group relative rounded-xl border bg-[#0f1523] p-5 transition-colors',
        expired
          ? 'border-[#1c2438] opacity-60'
          : 'border-[#1c2438] hover:border-[#4f7fff40]',
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#4f7fff15] text-[#4f7fff]">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight text-white">{titulo}</h3>
            {subtitulo && (
              <p className="mt-0.5 line-clamp-1 text-sm text-[#6b7a99]">{subtitulo}</p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            expired
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-teal-500/10 text-teal-400',
          )}
        >
          {expired ? 'Expirado' : 'Disponível'}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-3 text-xs text-[#3a4a66]">
        <span className="flex items-center gap-1">
          <BookOpen className="size-3" />
          {capitulosCount} capítulos
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          Gerado em {formatDate(createdAt)}
        </span>
      </div>

      {/* Actions */}
      {!expired && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/receiver/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#080b14] px-3 py-1.5 text-xs font-medium text-[#c8d3eb] transition hover:border-[#4f7fff40] hover:text-white"
          >
            <ExternalLink className="size-3" />
            Ver briefing
          </Link>
          <a
            href={`/api/pdf/${slug}`}
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4f7fff15] px-3 py-1.5 text-xs font-medium text-[#4f7fff] transition hover:bg-[#4f7fff25]"
          >
            <FileDown className="size-3" />
            Baixar PDF
          </a>
        </div>
      )}
    </article>
  )
}
