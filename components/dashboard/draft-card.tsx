'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sparkles, FileText, Clock, Trash2 } from 'lucide-react'

type DraftCardProps = {
  id: string
  titulo: string
  updatedAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function DraftCard({ id, titulo, updatedAt }: DraftCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Excluir este rascunho?')) return
    setDeleting(true)
    try {
      await fetch(`/api/ebook/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="flex items-center gap-3 rounded-xl border border-[#1c2438] p-4 transition hover:-translate-y-0.5 hover:border-[#2a3553]" style={{ background: '#0d1220' }}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ background: '#0b0f1c' }}>
        <FileText className="size-5 text-[#8896b0]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-[13px] font-semibold text-white">{titulo}</p>
        <p className="flex items-center gap-1 text-[10px] text-[#8896b0]">
          <Clock className="size-2.5" /> {formatDate(updatedAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => router.push(`/dashboard/criar?rascunho=${id}`)}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}
        >
          <Sparkles className="size-3" /> Continuar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="grid h-7 w-7 place-items-center rounded-lg border border-[#1c2438] text-[#8896b0] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </article>
  )
}
