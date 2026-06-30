'use client'

import { useState } from 'react'
import { Store, BookOpen, ExternalLink, Copy, Check, Globe, Palette } from 'lucide-react'

const TEMAS = [
  { id: 'azul', nome: 'Azul', cor: '#4f7fff' },
  { id: 'roxo', nome: 'Roxo', cor: '#a855f7' },
  { id: 'rosa', nome: 'Rosa', cor: '#ec4899' },
  { id: 'teal', nome: 'Teal', cor: '#00e5c3' },
]

export default function LojaPage() {
  const [tema, setTema] = useState(TEMAS[0])
  const [copiado, setCopiado] = useState(false)
  const lojaUrl = 'clubedoautor.online/loja/seu-nome'

  function copiar() {
    navigator.clipboard.writeText(`https://${lojaUrl}`)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#ec4899,#be185d)', boxShadow: '0 4px 20px rgba(236,72,153,0.4)' }}>
          <Store className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Minha Loja</h1>
          <p className="text-sm text-[#a0b0c8]">Sua vitrine digital para exibir e vender seus ebooks</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="space-y-4">

          {/* URL */}
          <div className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
            <div className="flex items-center gap-2 border-b border-[#1c2438] px-5 py-4">
              <Globe className="size-4 text-[#8896b0]" />
              <h2 className="text-[14px] font-bold text-white">URL da Loja</h2>
            </div>
            <div className="p-5">
              <p className="mb-2 text-[12px] text-[#a0b0c8]">Seu link exclusivo de vendas</p>
              <div className="flex gap-2">
                <div className="flex-1 overflow-hidden rounded-lg border border-[#1c2438] px-3 py-2.5 text-[12px] truncate text-[#c4d0e8]" style={{ background: '#0b0f1c' }}>
                  {lojaUrl}
                </div>
                <button onClick={copiar}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                  {copiado ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          {/* Tema */}
          <div className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
            <div className="flex items-center gap-2 border-b border-[#1c2438] px-5 py-4">
              <Palette className="size-4 text-[#8896b0]" />
              <h2 className="text-[14px] font-bold text-white">Tema da Loja</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-2">
                {TEMAS.map(t => (
                  <button key={t.id} onClick={() => setTema(t)}
                    className={`flex items-center gap-2 rounded-lg border p-3 transition ${tema.id === t.id ? 'border-[#4f7fff]' : 'border-[#1c2438] hover:border-[#2a3553]'}`}
                    style={{ background: tema.id === t.id ? 'rgba(79,127,255,0.08)' : '#0b0f1c' }}>
                    <div className="h-6 w-6 rounded-full" style={{ background: t.cor }} />
                    <span className="text-[12px] font-medium text-white">{t.nome}</span>
                    {tema.id === t.id && <Check className="ml-auto size-3.5 text-[#4f7fff]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-[#1c2438] p-5" style={{ background: '#0d1220' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-white">Status da loja</p>
                <p className="text-[11px] text-[#a0b0c8]">Visível para visitantes</p>
              </div>
              <span className="rounded-full px-3 py-1 text-[11px] font-bold text-[#00e5c3]" style={{ background: 'rgba(0,229,195,0.12)' }}>Ativa</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
          <div className="flex items-center justify-between border-b border-[#1c2438] px-5 py-4">
            <h2 className="text-[14px] font-bold text-white">Preview</h2>
            <a href="#" className="flex items-center gap-1 text-[11px] font-semibold text-[#4f7fff] hover:underline">
              Ver loja <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="p-4">
            <div className="rounded-lg overflow-hidden border border-[#1c2438]">
              <div className="h-16 flex items-center justify-between px-4" style={{ background: tema.cor }}>
                <span className="text-[13px] font-bold text-white">📚 Minha Loja de Ebooks</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">0 produtos</span>
              </div>
              <div className="flex flex-col items-center justify-center py-10" style={{ background: '#0b0f1c' }}>
                <BookOpen className="size-8 text-[#1c2438] mb-2" />
                <p className="text-[12px] font-medium text-[#8896b0]">Seus ebooks aparecerão aqui</p>
                <p className="text-[10px] text-[#1c2438]">Crie ebooks para popular sua loja</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1c2438] p-5">
            <p className="text-[11px] text-[#8896b0] text-center">
              Crie ebooks na aba <span className="font-semibold text-[#a0b0c8]">Criar Ebook</span> para que eles apareçam automaticamente na sua loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
