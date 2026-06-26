'use client'

import { useRef } from 'react'

const COVERS = [
  { title: 'Produtividade para Freelancers', cat: 'Negócios', from: '#1e3a5f', to: '#2563eb', emoji: '⚡' },
  { title: 'Marketing Digital 2025', cat: 'Marketing', from: '#0f4c3a', to: '#10b981', emoji: '📈' },
  { title: 'Finanças Pessoais do Zero', cat: 'Finanças', from: '#3b1f6b', to: '#8b5cf6', emoji: '💰' },
  { title: 'Culinária Saudável em 30min', cat: 'Lifestyle', from: '#7c2d12', to: '#f97316', emoji: '🥗' },
  { title: 'Mindfulness para Líderes', cat: 'Bem-estar', from: '#1e3a5f', to: '#0ea5e9', emoji: '🧘' },
  { title: 'Python para Iniciantes', cat: 'Tecnologia', from: '#14532d', to: '#22c55e', emoji: '💻' },
  { title: 'Fotografia com Celular', cat: 'Arte', from: '#831843', to: '#ec4899', emoji: '📸' },
  { title: 'Vendas Consultivas', cat: 'Vendas', from: '#451a03', to: '#f59e0b', emoji: '🤝' },
  { title: 'Criação de Conteúdo', cat: 'Marketing', from: '#1e1b4b', to: '#6366f1', emoji: '✍️' },
  { title: 'Empreendedorismo Feminino', cat: 'Negócios', from: '#500724', to: '#fb7185', emoji: '🚀' },
  { title: 'IA para Profissionais', cat: 'Tecnologia', from: '#0c1a2e', to: '#4f7fff', emoji: '🤖' },
  { title: 'Yoga e Meditação', cat: 'Saúde', from: '#042f2e', to: '#2dd4bf', emoji: '🌿' },
]

function EbookCover({ title, cat, from, to, emoji }: typeof COVERS[0]) {
  return (
    <div
      className="relative h-48 w-32 shrink-0 overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      {/* Spine effect */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
      {/* Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <span className="rounded-md bg-black/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/80">
          {cat}
        </span>
        <div>
          <div className="mb-1 text-xl">{emoji}</div>
          <p className="text-[11px] font-bold leading-tight text-white">{title}</p>
        </div>
      </div>
    </div>
  )
}

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...COVERS].reverse() : COVERS
  return (
    <div className="flex gap-4 overflow-hidden">
      <div
        className="flex animate-[marquee_35s_linear_infinite] gap-4"
        style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...items, ...items].map((c, i) => (
          <EbookCover key={i} {...c} />
        ))}
      </div>
    </div>
  )
}

export function EbookShowcase() {
  return (
    <section className="overflow-hidden bg-[#040810] py-16">
      <div className="mx-auto mb-8 max-w-2xl px-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#3a4a66]">
          O que nossos autores já criaram
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold text-white md:text-3xl">
          +1.200 ebooks criados pela Aurora IA
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <Marquee />
        <Marquee reverse />
      </div>

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
