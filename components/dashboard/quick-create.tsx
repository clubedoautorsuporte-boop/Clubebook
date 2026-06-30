'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'

export function QuickCreate() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#4f7fff25] bg-gradient-to-r from-[#0d1526] to-[#0a1020] p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff50] to-transparent" />
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-4 text-[#4f7fff]" />
        <span className="text-xs font-semibold text-[#8aa6ff]">Criar novo ebook</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          onClick={() => router.push('/dashboard/criar')}
          placeholder="Sobre qual tema você quer criar um ebook?"
          className="flex-1 cursor-pointer rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-[#8896b0] placeholder:text-[#8896b0] focus:outline-none"
        />
        <button
          onClick={() => router.push('/dashboard/criar')}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.5)]"
        >
          Gerar
          <ArrowRight className="size-3.5" />
        </button>
      </div>
      <p className="mt-2 text-[10px] text-[#8896b0]">Entrega em ~47 min • PDF + DOCX + EPUB • Direitos 100% seus</p>
    </div>
  )
}
