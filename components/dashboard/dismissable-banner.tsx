'use client'

import { useState } from 'react'
import { X, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function DismissableBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#00e5c320] bg-gradient-to-r from-[#00e5c308] to-[#4f7fff06] px-5 py-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#00e5c315]">
          <Zap className="size-5 text-[#00e5c3]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">
              Novidade: seu ebook pronto em ~47 minutos
            </p>
            <span className="rounded-full bg-[#4f7fff20] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4f7fff]">
              LANÇAMENTO
            </span>
          </div>
          <p className="text-xs text-[#a0b0c8]">
            Crie agora e receba PDF + DOCX + EPUB com direitos de revenda 100% seus
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/dashboard/criar"
          className="hidden items-center gap-1.5 rounded-xl bg-[#00e5c3] px-4 py-2 text-xs font-bold text-[#040810] transition hover:bg-[#00cfb0] sm:flex"
        >
          Criar meu ebook agora
          <ArrowRight className="size-3.5" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="grid h-7 w-7 place-items-center rounded-lg text-[#9ca3af] transition hover:bg-[#e9ecef] hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
