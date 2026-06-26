'use client'

import { useState } from 'react'
import { Gift, Copy, Check, Users, ArrowRight } from 'lucide-react'

export default function IndicarPage() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/?ref=meu-link`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="px-5 py-6 md:px-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00e5c315]">
          <Gift className="size-5 text-[#00e5c3]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Indique e Ganhe</h1>
          <p className="text-sm text-[#6b7a99]">Compartilhe e ganhe 1 ebook grátis por cada amigo que criar</p>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { n: '1', texto: 'Copie seu link exclusivo de indicação', icone: '🔗' },
          { n: '2', texto: 'Envie para amigos pelo WhatsApp ou redes sociais', icone: '📤' },
          { n: '3', texto: 'Quando ele criar o primeiro ebook, você ganha 1 grátis!', icone: '🎁' },
        ].map(({ n, texto, icone }) => (
          <div key={n} className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-4 text-center">
            <div className="mb-2 text-2xl">{icone}</div>
            <div className="mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00e5c320] text-[10px] font-bold text-[#00e5c3]">{n}</div>
            <p className="text-xs leading-relaxed text-[#6b7a99]">{texto}</p>
          </div>
        ))}
      </div>

      {/* Link copiável */}
      <div className="rounded-2xl border border-[#00e5c320] bg-[#00e5c308] p-5">
        <p className="mb-3 text-sm font-semibold text-white">Seu link de indicação</p>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-[#3a4a66]">
            <span className="text-[#4f7fff]">clubedoautor.online</span>/?ref=meu-link
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-xl bg-[#00e5c3] px-4 py-2.5 text-sm font-bold text-[#040810] transition hover:bg-[#00cfb0]"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#3a4a66]">
          <Users className="size-3" />
          0 indicações realizadas até agora
        </p>
      </div>
    </div>
  )
}
