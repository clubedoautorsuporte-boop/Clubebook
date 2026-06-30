'use client'

import Link from 'next/link'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { DraftCard } from '@/components/dashboard/draft-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  BookOpen, PenLine, Sparkles, Gem, TrendingUp,
  Plus, LayoutDashboard, Library, Gift, Wrench, Flame,
  ShoppingCart, ArrowUpRight,
} from 'lucide-react'

type EbookRow = { slug: string; titulo: string; subtitulo: string; capitulosCount: number; createdAt: string; expired: boolean; tipo: string }
type DraftRow = { id: string; titulo: string; genero: string; nomeAutor: string; step: number; updatedAt: string }

const NAV_CARDS = [
  { href: '/dashboard',            icon: LayoutDashboard, label: 'Meus Ebooks', desc: 'Estante digital',   g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: '0 4px 16px rgba(79,127,255,0.4)' },
  { href: '/dashboard/vendas',     icon: TrendingUp,      label: 'Vendas',       desc: 'Gerencie receitas', g: 'linear-gradient(135deg,#00e5c3,#00b09b)', s: '0 4px 16px rgba(0,229,195,0.4)' },
  { href: '/dashboard/creditos',   icon: Gem,             label: 'Créditos',     desc: 'Saldo disponível',  g: 'linear-gradient(135deg,#a855f7,#7c3aed)', s: '0 4px 16px rgba(168,85,247,0.4)' },
  { href: '/dashboard/biblioteca', icon: Library,         label: 'Biblioteca',   desc: 'Templates prontos', g: 'linear-gradient(135deg,#f97316,#ea580c)', s: '0 4px 16px rgba(249,115,22,0.4)'  },
]

const QUICK_CARDS = [
  { href: '/dashboard/kit-ferramentas', icon: Wrench,       label: 'Kit Ferramentas', color: '#4f7fff' },
  { href: '/dashboard/nichos',          icon: Flame,        label: 'Nichos',          color: '#f97316' },
  { href: '/dashboard/kit-vendas',      icon: ShoppingCart, label: 'Kit de Vendas',   color: '#00e5c3' },
  { href: '/dashboard/indicar',         icon: Gift,         label: 'Indicar',         color: '#a855f7' },
]

const STATS_CONFIG = [
  { key: 'total',     label: 'Total criados', unit: 'ebooks',     icon: BookOpen, g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: '0 4px 16px rgba(79,127,255,0.5)'   },
  { key: 'drafts',    label: 'Em criação',    unit: 'rascunhos',  icon: PenLine,  g: 'linear-gradient(135deg,#6366f1,#4338ca)', s: '0 4px 16px rgba(99,102,241,0.5)'   },
  { key: 'completos', label: 'Completos',     unit: 'livros',     icon: Sparkles, g: 'linear-gradient(135deg,#ec4899,#be185d)', s: '0 4px 16px rgba(236,72,153,0.5)'   },
  { key: 'creditos',  label: 'Créditos',      unit: 'disponíveis',icon: Gem,      g: 'linear-gradient(135deg,#a855f7,#7c3aed)', s: '0 4px 16px rgba(168,85,247,0.5)'   },
]

export function DashboardClient({ rows, drafts, credits }: { rows: EbookRow[]; drafts: DraftRow[]; credits: number }) {
  const livros = rows.filter(r => r.tipo === 'livro')
  const total = rows.length + drafts.length

  const statsValues: Record<string, string | number> = {
    total,
    drafts:    drafts.length,
    completos: livros.length,
    creditos:  credits.toLocaleString('pt-BR'),
  }

  const statsFooter: Record<string, { label: string; color: string }> = {
    total:     { label: total > 0 ? `+${total} nesta semana` : 'Crie seu primeiro!', color: total > 0 ? '#00e5c3' : '#8896b0' },
    drafts:    { label: drafts.length > 0 ? 'Em andamento' : 'Nenhum rascunho',      color: '#00e5c3' },
    completos: { label: livros.length > 0 ? 'Finalizados' : 'Finalize um livro!',    color: '#ec4899' },
    creditos:  { label: `≈ R$ ${(credits / 100).toFixed(0)} em serviços`,            color: '#00e5c3' },
  }

  return (
    <div className="px-4 pt-4 pb-10 md:px-6">

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS_CONFIG.map(({ key, label, unit, icon: Icon, g, s }) => (
          <div key={key} className="overflow-hidden rounded-2xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="flex h-full">
              <div className="grid w-[72px] shrink-0 place-items-center" style={{ background: g, boxShadow: s }}>
                <Icon className="size-7 text-white" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0b0c8]">{label}</p>
                <div>
                  <p className="text-2xl font-black text-white tabular-nums leading-none">{statsValues[key]}</p>
                  <p className="text-[10px] text-[#8896b0]">{unit}</p>
                </div>
                <p className="text-[10px] font-semibold" style={{ color: statsFooter[key].color }}>{statsFooter[key].label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc, g, s }) => (
          <Link key={href} href={href}
            className="group flex items-center gap-3 rounded-2xl border border-[#1c2438] p-4 transition-all hover:border-[#2a3553] hover:-translate-y-0.5"
            style={{ background: '#0d1220' }}>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
              style={{ background: g, boxShadow: s }}>
              <Icon className="size-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-white">{label}</p>
              <p className="truncate text-[11px] text-[#a0b0c8]">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main area */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Ebooks 2/3 */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="flex items-center justify-between border-b border-[#1c2438] px-5 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-white">Meus Ebooks</h2>
                <p className="text-[11px] text-[#a0b0c8]">{total > 0 ? `${total} projeto${total > 1 ? 's' : ''}` : 'Comece criando seu primeiro'}</p>
              </div>
              <Link href="/dashboard/criar"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold text-white transition hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.35)' }}>
                <Plus className="size-3.5" /> Criar Novo
              </Link>
            </div>

            <div className="p-5">
              {total === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-5">
                  {drafts.length > 0 && (
                    <section>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#f97316]">Em criação ({drafts.length})</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {drafts.map(d => <DraftCard key={d.id} {...d} />)}
                      </div>
                    </section>
                  )}
                  {livros.length > 0 && (
                    <section>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#00e5c3]">Completos ({livros.length})</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {livros.map(r => <EbookCard key={r.slug} {...r} tipo="livro" />)}
                      </div>
                    </section>
                  )}
                  {rows.filter(r => r.tipo !== 'livro').length > 0 && (
                    <section>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#a0b0c8]">Prévias</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {rows.filter(r => r.tipo !== 'livro').map(r => <EbookCard key={r.slug} {...r} tipo="preview" />)}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar 1/3 */}
        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-2xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="border-b border-[#1c2438] px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">Ferramentas</h2>
              <p className="text-[11px] text-[#a0b0c8]">Acesso rápido</p>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {QUICK_CARDS.map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${color}20` }}>
                    <Icon className="size-4" style={{ color }} />
                  </div>
                  <span className="text-[13px] font-medium text-[#c4d0e8]">{label}</span>
                  <ArrowUpRight className="ml-auto size-3.5 text-[#8896b0]" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1a0545 0%, #4f1a8a 50%, #7c3aed 100%)' }}>
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 20%, #a855f7, transparent 60%)' }} />
            <Gem className="mb-3 size-8 text-purple-300" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-1">Saldo de Créditos</p>
            <p className="text-3xl font-black tabular-nums">{credits.toLocaleString('pt-BR')}</p>
            <p className="mt-0.5 text-[11px] text-purple-300">≈ R$ {(credits / 100).toFixed(0)} em serviços</p>
            <Link href="/dashboard/creditos"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2.5 text-[12px] font-bold text-white transition hover:bg-white/20">
              Comprar créditos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
