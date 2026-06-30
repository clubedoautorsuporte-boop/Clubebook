import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { DraftCard } from '@/components/dashboard/draft-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { DismissableBanner } from '@/components/dashboard/dismissable-banner'
import {
  Plus, TrendingUp, Gem, Library, Gift, Wrench, Flame,
  ShoppingCart, LayoutDashboard, BookOpen, PenLine, Sparkles,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

const NAV_CARDS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks', desc: 'Estante digital', color: '#4f7fff', active: true },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas', desc: 'Gerencie', color: '#00e5c3' },
  { href: '/dashboard/creditos', icon: Gem, label: 'Créditos', desc: 'Saldo', color: '#8b5cf6' },
  { href: '/dashboard/biblioteca', icon: Library, label: 'Biblioteca', desc: 'Templates', color: '#f97316' },
]

const QUICK_CARDS = [
  { href: '/dashboard/kit-ferramentas', icon: Wrench, label: 'Kit Ferramentas', color: '#4f7fff' },
  { href: '/dashboard/nichos', icon: Flame, label: 'Nichos', color: '#f97316' },
  { href: '/dashboard/kit-vendas', icon: ShoppingCart, label: 'Kit de Vendas', color: '#00e5c3' },
  { href: '/dashboard/indicar', icon: Gift, label: 'Indicar', color: '#ec4899' },
]

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  const credits = (session?.user as { credits?: number })?.credits ?? 1000

  type DeliveryRow = { slug: string; titulo: string; subtitulo: string; capitulosCount: number; createdAt: string; expired: boolean; tipo: string }
  type DraftRow = { id: string; titulo: string; genero: string; nomeAutor: string; step: number; updatedAt: string }

  let rows: DeliveryRow[] = []
  let drafts: DraftRow[] = []

  if (userId) {
    try {
      const [deliveries, draftList] = await Promise.all([
        prisma.delivery.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { slug: true, planJson: true, createdAt: true, expiresAt: true, tipo: true } }),
        prisma.draft.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, select: { id: true, titulo: true, genero: true, nomeAutor: true, step: true, updatedAt: true } }),
      ])
      rows = deliveries.map((d: { slug: string; planJson: unknown; createdAt: Date; expiresAt: Date; tipo: string }) => {
        const plan = d.planJson as BriefingPlan
        return { slug: d.slug, titulo: plan.titulo ?? 'Sem título', subtitulo: plan.subtitulo ?? '', capitulosCount: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0, createdAt: d.createdAt.toISOString(), expired: d.expiresAt < new Date(), tipo: d.tipo ?? 'preview' }
      })
      drafts = draftList.map((d: { id: string; titulo: string; genero: string | null; nomeAutor: string; step: number; updatedAt: Date }) => ({
        id: d.id, titulo: d.titulo, genero: d.genero ?? '', nomeAutor: d.nomeAutor, step: d.step, updatedAt: d.updatedAt.toISOString(),
      }))
    } catch (err) { console.error('[dashboard] erro:', err) }
  }

  const livros = rows.filter(r => r.tipo === 'livro')
  const previas = rows.filter(r => r.tipo !== 'livro')
  const total = rows.length + drafts.length

  const STATS = [
    { label: 'Total criados', value: total, icon: BookOpen, color: '#4f7fff', bg: '#4f7fff18', progress: Math.min((total / 10) * 100, 100), trend: '+0%', up: true },
    { label: 'Em criação', value: drafts.length, icon: PenLine, color: '#facc15', bg: '#facc1518', progress: Math.min((drafts.length / 5) * 100, 100), trend: 'Rascunhos', up: true },
    { label: 'Completos', value: livros.length, icon: Sparkles, color: '#00e5c3', bg: '#00e5c318', progress: total > 0 ? Math.round((livros.length / total) * 100) : 0, trend: `${total > 0 ? Math.round((livros.length / total) * 100) : 0}% do total`, up: true },
    { label: 'Créditos', value: credits.toLocaleString('pt-BR'), icon: Gem, color: '#8b5cf6', bg: '#8b5cf618', progress: Math.min((credits / 5000) * 100, 100), trend: `≈ R$ ${(credits / 100).toFixed(0)}`, up: credits > 500 },
  ]

  return (
    <div className="px-5 pt-5 pb-16 md:px-6">
      <DismissableBanner />

      {/* ── Stats cards estilo Datta Able ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, progress, trend, up }) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-[#ffffff08] bg-[#0b0f1c] p-4 transition hover:border-[#ffffff12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Glow accent top */}
            <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />

            <div className="mb-3 flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: bg }}>
                <Icon className="size-4" style={{ color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${up ? 'text-[#00e5c3]' : 'text-red-400'}`}>
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {trend}
              </div>
            </div>

            <p className="text-2xl font-extrabold text-white tabular-nums leading-none mb-1">{value}</p>
            <p className="text-[11px] text-[#6b7a99] mb-3">{label}</p>

            {/* Progress bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#ffffff08]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Nav + Quick em 2 linhas ── */}
      <div className="mb-5 space-y-2">
        {/* Linha 1: Navegação principal */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NAV_CARDS.map(({ href, icon: Icon, label, desc, color, active }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              style={{ borderColor: active ? `${color}30` : '#ffffff08', background: active ? `${color}08` : '#0b0f1c' }}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${color}18` }}>
                <Icon className="size-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-white leading-tight">{label}</p>
                <p className="truncate text-[10px] text-[#6b7a99]">{desc}</p>
              </div>
              {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />}
            </Link>
          ))}
        </div>

        {/* Linha 2: Ferramentas */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_CARDS.map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-[#ffffff08] bg-[#080b14] p-3 transition-all hover:border-[#ffffff12] hover:bg-[#0b0f1c] hover:-translate-y-0.5"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${color}15` }}>
                <Icon className="size-3.5" style={{ color }} />
              </div>
              <p className="truncate text-[12px] font-medium text-[#c4d0e8]">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Meus Ebooks ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full bg-[#4f7fff]" />
          <h2 className="text-[15px] font-bold text-white">Meus Ebooks</h2>
          {total > 0 && <span className="rounded-full bg-[#4f7fff18] px-2 py-0.5 text-[10px] font-bold text-[#4f7fff]">{total}</span>}
        </div>
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-xl bg-[#4f7fff] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#3a6be0] hover:-translate-y-0.5"
        >
          <Plus className="size-3.5" />
          Criar Novo
        </Link>
      </div>

      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {drafts.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#facc1530] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#facc15]">Em criação ({drafts.length})</p>
                <div className="h-px flex-1 bg-gradient-to-l from-[#facc1530] to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map(d => <DraftCard key={d.id} {...d} />)}
              </div>
            </section>
          )}
          {livros.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00e5c330] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#00e5c3]">Livros completos ({livros.length})</p>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00e5c330] to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {livros.map(r => <EbookCard key={r.slug} {...r} tipo="livro" />)}
              </div>
            </section>
          )}
          {previas.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#4f7fff30] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#6b7a99]">Prévias ({previas.length})</p>
                <div className="h-px flex-1 bg-gradient-to-l from-[#4f7fff30] to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {previas.map(r => <EbookCard key={r.slug} {...r} tipo="preview" />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
