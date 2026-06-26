'use client'

import { useState } from 'react'
import { Store, BookOpen, ExternalLink, Copy, Check, Palette, Globe } from 'lucide-react'

const CORES = [
  { label: 'Aurora', from: '#4f7fff', to: '#00e5c3' },
  { label: 'Fogo',   from: '#f97316', to: '#ef4444' },
  { label: 'Roxo',   from: '#8b5cf6', to: '#ec4899' },
  { label: 'Verde',  from: '#10b981', to: '#06b6d4' },
]

export default function LojaPage() {
  const [nome, setNome] = useState('')
  const [bio, setBio] = useState('')
  const [corIdx, setCorIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const slug = nome ? nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'seu-nome'
  const lojaUrl = `clubedoautor.online/autor/${slug}`
  const cor = CORES[corIdx]

  function copiarLink() {
    navigator.clipboard.writeText(`https://${lojaUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function salvar() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="px-5 pt-6 pb-12 md:px-8 max-w-4xl">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
            <Store className="size-5 text-[#4f7fff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Minha Loja</h1>
            <p className="text-sm text-[#6b7a99]">Seu perfil público de autor</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400">Em breve</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Editor ── */}
        <div className="space-y-4">
          {/* Perfil */}
          <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Configure seu perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Nome de autor *</label>
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
                  placeholder="Ex: Especialista em finanças pessoais. Já ajudei mais de 200 pessoas..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cor do tema */}
          <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Palette className="size-4 text-[#4f7fff]" />
              <h2 className="text-sm font-semibold text-white">Cor da loja</h2>
            </div>
            <div className="flex gap-3">
              {CORES.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setCorIdx(i)}
                  className={`group flex flex-col items-center gap-1.5 ${corIdx === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <div
                    className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-[#0b0f1c] transition ${corIdx === i ? 'ring-white' : 'ring-transparent'}`}
                    style={{ background: `linear-gradient(135deg,${c.from},${c.to})` }}
                  />
                  <span className="text-[9px] text-[#6b7a99]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* URL da loja */}
          <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="size-4 text-[#4f7fff]" />
              <h2 className="text-sm font-semibold text-white">Link da sua loja</h2>
            </div>
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-0 overflow-hidden rounded-xl border border-[#1c2438] bg-[#080b14] px-3 py-2.5">
                <span className="shrink-0 text-xs text-[#3a4a66]">clubedoautor.online/autor/</span>
                <span className="truncate text-xs font-semibold text-[#4f7fff]">{slug}</span>
              </div>
              <button
                onClick={copiarLink}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#4f7fff15] px-3 py-2 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Ativar */}
          <button
            onClick={salvar}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_32px_rgba(79,127,255,0.5)]"
          >
            {saved ? <><Check className="size-4" /> Configurações salvas!</> : <><ExternalLink className="size-4" /> Ativar minha loja</>}
          </button>
          <p className="text-center text-[11px] text-[#2a3553]">A loja pública estará disponível em breve. Suas configurações já ficam salvas.</p>
        </div>

        {/* ── Preview ── */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#3a4a66]">Prévia da sua loja</p>
          <div className="overflow-hidden rounded-2xl border border-[#1c2438] bg-[#040810]">
            {/* Header da loja */}
            <div className="h-20 w-full" style={{ background: `linear-gradient(135deg,${cor.from},${cor.to})` }} />

            <div className="p-5">
              {/* Avatar sobre o banner */}
              <div className="-mt-10 mb-4 flex items-end gap-4">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-4 border-[#040810] text-2xl font-extrabold text-white"
                  style={{ background: `linear-gradient(135deg,${cor.from},${cor.to})` }}
                >
                  {nome ? nome.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="mb-1">
                  <p className="font-bold text-white">{nome || 'Seu Nome'}</p>
                  <p className="text-[11px] text-[#6b7a99]">{bio ? bio.slice(0, 55) + (bio.length > 55 ? '…' : '') : 'Sua bio aparecerá aqui...'}</p>
                </div>
              </div>

              {/* Label URL */}
              <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-[#0b0f1c] px-3 py-1.5">
                <Globe className="size-3 text-[#3a4a66]" />
                <span className="text-[11px] text-[#4f7fff]">{lojaUrl}</span>
              </div>

              {/* Cards mock */}
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#2a3553]">Ebooks disponíveis</p>
              <div className="space-y-2.5">
                {['Seu próximo ebook', 'Outro ebook incrível'].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-[#1c2438] bg-[#0b0f1c] p-3">
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-lg"
                      style={{ background: i === 0 ? `linear-gradient(135deg,${cor.from},${cor.to})` : 'linear-gradient(135deg,#1e3a5f,#1e6b9e)' }}
                    >
                      <BookOpen className="size-4 text-white/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#6b7a99]">{t}</p>
                      <p className="text-[9px] text-[#2a3553]">PDF · DOCX · EPUB</p>
                    </div>
                    <div className="shrink-0 rounded-lg bg-[#4f7fff15] px-2 py-1 text-xs font-bold text-[#4f7fff]">R$47</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
