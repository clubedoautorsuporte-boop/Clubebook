'use client'

import { useState } from 'react'
import { Gift, Copy, Check, Users, Share2, MessageCircle } from 'lucide-react'

export default function IndicarClient({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false)

  const refCode = userId.slice(-8)
  const refUrl = `https://clubedoautor.online/?ref=${refCode}`

  function copy() {
    navigator.clipboard.writeText(refUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`✨ Crie seu próprio ebook com IA em menos de 1 hora!\n\nCom a Aurora IA do Clube do Autor você gera um ebook completo — com PDF, DOCX e EPUB — para revender. Acesse pelo meu link e ganhe um bônus:\n\n${refUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="px-5 py-6 pb-12 md:px-8 max-w-2xl">

      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00e5c315]">
          <Gift className="size-5 text-[#00e5c3]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Indique e Ganhe</h1>
          <p className="text-sm text-[#6b7a99]">1 ebook grátis para você + 500 créditos para o amigo</p>
        </div>
      </div>

      {/* Como funciona */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { n: '1', icone: '🔗', titulo: 'Copie seu link', texto: 'Cada conta tem um código de indicação único e rastreável' },
          { n: '2', icone: '📤', titulo: 'Compartilhe', texto: 'Envie para amigos pelo WhatsApp, Instagram ou qualquer canal' },
          { n: '3', icone: '🎁', titulo: 'Ganhe juntos', texto: 'Você ganha 1 ebook grátis e seu amigo recebe 500 créditos de bônus' },
        ].map(({ n, icone, titulo, texto }) => (
          <div key={n} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
            <div className="mb-2 text-2xl">{icone}</div>
            <div className="mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00e5c320] text-[10px] font-bold text-[#00e5c3]">{n}</div>
            <p className="text-xs font-semibold text-white">{titulo}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#6b7a99]">{texto}</p>
          </div>
        ))}
      </div>

      {/* Link */}
      <div className="mb-4 rounded-2xl border border-[#00e5c320] bg-[#00e5c306] p-5">
        <p className="mb-3 text-sm font-semibold text-white">Seu link exclusivo de indicação</p>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm">
            <span className="text-[#4f7fff]">clubedoautor.online</span>
            <span className="text-[#3a4a66]">/?ref=</span>
            <span className="font-mono font-semibold text-[#00e5c3]">{refCode}</span>
          </div>
          <button
            onClick={copy}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#00e5c3] px-4 py-2.5 text-sm font-bold text-[#040810] transition hover:bg-[#00cfb0]"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#3a4a66]">
          <Users className="size-3" />
          <span>Código: <span className="font-mono text-[#2a3553]">{refCode}</span></span>
        </div>
      </div>

      {/* Compartilhar */}
      <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Share2 className="size-4 text-[#4f7fff]" />
          <p className="text-sm font-semibold text-white">Compartilhar agora</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25d36615] border border-[#25d36630] py-3 text-sm font-semibold text-[#25d366] transition hover:bg-[#25d36625]"
          >
            <MessageCircle className="size-4" />
            Compartilhar no WhatsApp
          </button>
          <button
            onClick={copy}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1c2438] bg-[#080b14] py-3 text-sm font-semibold text-[#6b7a99] transition hover:border-[#4f7fff40] hover:text-white"
          >
            <Copy className="size-4" />
            Copiar link
          </button>
        </div>
      </div>

      {/* Recompensas */}
      <div className="mt-4 rounded-2xl border border-[#4f7fff20] bg-[#4f7fff08] p-5">
        <p className="mb-3 text-sm font-semibold text-white">Suas recompensas</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { meta: '1 indicação', recompensa: '1 ebook grátis', cor: 'text-[#00e5c3]' },
            { meta: '5 indicações', recompensa: '5 ebooks grátis', cor: 'text-[#4f7fff]' },
            { meta: '10 indicações', recompensa: '10 ebooks + badge VIP', cor: 'text-amber-400' },
          ].map(r => (
            <div key={r.meta} className="rounded-xl border border-[#1c2438] bg-[#080b14] p-3 text-center">
              <p className="text-[10px] text-[#3a4a66]">{r.meta}</p>
              <p className={`mt-0.5 text-xs font-bold ${r.cor}`}>{r.recompensa}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-[#2a3553]">Sistema de recompensas em implementação. Suas indicações são rastreadas.</p>
      </div>
    </div>
  )
}
