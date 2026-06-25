'use client'

import { useState } from 'react'
import { Loader2, FileX } from 'lucide-react'

type Props = {
  slug: string
  titulo: string
}

export default function PdfViewer({ slug, titulo }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const pdfUrl = `/api/pdf/${slug}`

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-16 text-center">
        <FileX className="h-10 w-10 text-white/30" />
        <p className="text-sm text-white/50">Não foi possível exibir o PDF.</p>
        <a
          href={`/api/pdf/${slug}`}
          download
          className="mt-2 rounded-lg border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-400 transition hover:bg-teal-500/20"
        >
          Baixar PDF diretamente
        </a>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/5">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            <p className="text-sm text-white/50">Carregando documento...</p>
          </div>
        </div>
      )}
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full rounded-xl"
        style={{ height: '680px', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        aria-label={`PDF: ${titulo}`}
      >
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-16 text-center">
          <p className="text-sm text-white/60">Seu navegador não suporta visualização inline de PDF.</p>
          <a
            href={`/api/pdf/${slug}`}
            download
            className="mt-2 rounded-lg border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-400 transition hover:bg-teal-500/20"
          >
            Baixar PDF
          </a>
        </div>
      </object>
    </div>
  )
}
