'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export function CreditsWidget({ credits }: { credits: number }) {
  return (
    <div className="mx-4 mb-3 flex items-center justify-between rounded-xl border border-[#2a2210] bg-[#1a140a] px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-sm font-black text-black shadow-[0_0_10px_rgba(251,191,36,0.4)]">
          $
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-extrabold text-white">{credits.toLocaleString()}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70">Créditos</span>
        </div>
      </div>
      <Link
        href="/dashboard/creditos"
        className="grid h-6 w-6 place-items-center rounded-lg bg-[#4f7fff20] text-[#4f7fff] transition hover:bg-[#4f7fff35]"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
      </Link>
    </div>
  )
}
