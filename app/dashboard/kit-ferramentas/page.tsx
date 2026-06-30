'use client'

import Link from 'next/link'
import { Wrench, BookOpen, Image, Palette, Headphones, Rocket, Megaphone, ArrowRight, Zap } from 'lucide-react'

const FERRAMENTAS = [
  {
    titulo: 'Gerador de Ebooks com IA',
    desc: 'Crie um ebook completo em até 1 hora com estrutura profissional. PDF, DOCX e EPUB inclusos.',
    icone: BookOpen,
    cor: '#4f7fff',
    g: 'linear-gradient(135deg,#4f7fff,#2554e0)',
    s: 'rgba(79,127,255,0.4)',
    href: '/dashboard/criar',
    cta: 'Criar agora',
    badge: 'Principal',
  },
  {
    titulo: 'Gerador de Capas',
    desc: 'Crie capas profissionais para seus ebooks com templates prontos e personalização total.',
    icone: Image,
    cor: '#ec4899',
    g: 'linear-gradient(135deg,#ec4899,#be185d)',
    s: 'rgba(236,72,153,0.4)',
    href: '/dashboard/criar',
    cta: 'Criar capa',
    badge: null,
  },
  {
    titulo: 'Áudio do Ebook (Audiobook)',
    desc: 'Transforme seu ebook em audiobook com voz sintética em português do Brasil.',
    icone: Headphones,
    cor: '#a855f7',
    g: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    s: 'rgba(168,85,247,0.4)',
    href: '/dashboard/criar',
    cta: 'Gerar áudio',
    badge: 'Em breve',
  },
  {
    titulo: 'Kit de Vendas Completo',
    desc: 'Landing page, copy de vendas e posts prontos para redes sociais — tudo gerado por IA.',
    icone: Megaphone,
    cor: '#f97316',
    g: 'linear-gradient(135deg,#f97316,#ea580c)',
    s: 'rgba(249,115,22,0.4)',
    href: '/dashboard/kit-vendas',
    cta: 'Gerar kit',
    badge: null,
  },
  {
    titulo: 'Design Personalizado',
    desc: 'Aplique seu branding ao ebook: cores, fontes, logotipo e estilo tipográfico customizados.',
    icone: Palette,
    cor: '#00e5c3',
    g: 'linear-gradient(135deg,#00e5c3,#00b09b)',
    s: 'rgba(0,229,195,0.4)',
    href: '/dashboard/criar',
    cta: 'Personalizar',
    badge: null,
  },
  {
    titulo: 'Publicação Automática',
    desc: 'Envie seu ebook direto para Hotmart, Amazon KDP e outras plataformas com um clique.',
    icone: Rocket,
    cor: '#0ea5e9',
    g: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
    s: 'rgba(14,165,233,0.4)',
    href: '/dashboard/plataformas',
    cta: 'Ver plataformas',
    badge: 'Em breve',
  },
]

export default function KitFerramentasPage() {
  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#2554e0)', boxShadow: '0 4px 20px rgba(79,127,255,0.4)' }}>
          <Wrench className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Kit de Ferramentas</h1>
          <p className="text-sm text-[#a0b0c8]">Tudo que você precisa para criar, vender e escalar</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FERRAMENTAS.map(({ titulo, desc, icone: Icon, cor, g, s, href, cta, badge }) => (
          <div key={titulo} className="flex flex-col rounded-xl border border-[#1c2438] overflow-hidden transition hover:-translate-y-0.5 hover:border-[#2a3553]" style={{ background: '#0d1220' }}>
            <div className="relative p-5 pb-0">
              {badge && (
                <span className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[9px] font-bold" style={{ background: `${cor}18`, color: cor }}>
                  {badge}
                </span>
              )}
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl" style={{ background: g, boxShadow: `0 4px 20px ${s}` }}>
                <Icon className="size-6 text-white" />
              </div>
              <h3 className="mb-1.5 text-[14px] font-bold text-white">{titulo}</h3>
              <p className="text-[12px] leading-relaxed text-[#a0b0c8]">{desc}</p>
            </div>
            <div className="mt-auto p-5 pt-4">
              <Link href={href}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-bold text-white transition hover:opacity-90"
                style={{ background: g, boxShadow: `0 4px 12px ${cor}40` }}>
                {cta} <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-[#1c2438] p-5" style={{ background: '#0d1220' }}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 12px rgba(79,127,255,0.3)' }}>
          <Zap className="size-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white">Pronto para criar seu primeiro ebook?</p>
          <p className="text-[11px] text-[#a0b0c8]">Leva menos de 1 hora e você já pode colocar à venda</p>
        </div>
        <Link href="/dashboard/criar"
          className="shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
          Criar ebook <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
