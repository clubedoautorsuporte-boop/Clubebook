'use client'

import { useState } from 'react'
import { Store, BookOpen, ExternalLink } from 'lucide-react'

export default function LojaPage() {
  const [nome, setNome] = useState('')
  const [bio, setBio] = useState('')
  const [toast, setToast] = useState(false)

  const ativar = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="px-5 py-6 md:px-8 max-w-4xl">
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl border border-[#4f7fff30] bg-[#0f1523] px-5 py-3 text-sm font-medium text-white shadow-xl">
          🚀 Minha Loja será lançada em breve!
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Store className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Minha Loja</h1>
          <p className="text-sm text-[#6b7a99]">Seu perfil público de autor com todos os seus ebooks</p>
        </div>
        <span className="ml-auto rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400">
          EM BREVE
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulário */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6">
          <h2 className="mb-5 font-semibold text-white">Configure seu perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Nome de autor</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Bio curta</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Ex: Especialista em finanças pessoais e criador de conteúdo..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">URL da loja</label>
              <div className="flex items-center rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5">
                <span className="text-xs text-[#3a4a66]">clubedoautor.online/autor/</span>
                <span className="text-sm text-[#4f7fff]">
                  {nome ? nome.toLowerCase().replace(/\s+/g, '-') : 'seu-nome'}
                </span>
              </div>
            </div>
            <button
              onClick={ativar}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-3 text-sm font-bold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.5)]"
            >
              Ativar minha loja
              <ExternalLink className="size-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#080b14] p-6">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#3a4a66]">Prévia da sua loja</p>
          {/* Mock profile */}
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#4f7fff] to-[#00e5c3] text-lg font-bold text-white">
              {nome ? nome[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-bold text-white">{nome || 'Seu Nome'}</p>
              <p className="text-xs text-[#6b7a99]">{bio || 'Sua bio aparecerá aqui...'}</p>
            </div>
          </div>
          {/* Mock ebook cards */}
          <div className="space-y-3">
            {['Seu próximo ebook', 'Outro ebook incrível'].map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-[#1c2438] bg-[#0f1523] p-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-lg"
                  style={{ background: i === 0 ? 'linear-gradient(135deg,#1e3a5f,#2563eb)' : 'linear-gradient(135deg,#0f4c3a,#10b981)' }}
                >
                  <BookOpen className="size-5 text-white/70" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3a4a66]">{t}</p>
                  <p className="text-xs text-[#2a3553]">PDF · DOCX · EPUB</p>
                </div>
                <div className="ml-auto shrink-0 text-sm font-bold text-[#3a4a66]">R$47</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
