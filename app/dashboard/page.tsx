import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { DraftCard } from '@/components/dashboard/draft-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { DismissableBanner } from '@/components/dashboard/dismissable-banner'
import {
  Plus, TrendingUp, Gem, Library, Gift, Wrench, Flame,
  ShoppingCart, LayoutDashboard, BookOpen, PenLine, Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

const NAV_CARDS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks', desc: 'Sua estante digital', color: '#4f7fff', active: true },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas', desc: 'Gerencie e distribua', color: '#00e5c3' },
  { href: '/dashboard/creditos', icon: Gem, label: 'Créditos', desc: 'Saldo e histórico', color: '#8b5cf6' },
  { href: '/dashboard/biblioteca', icon: Library, label: 'Biblioteca', desc: 'Templates prontos', color: '#f97316' },
]

const QUICK_CARDS = [
  { href: '/dashboard/kit-ferramentas', icon: Wrench, label: 'Kit Ferramentas', desc: '18 ferramentas de edição', color: '#4f7fff' },
  { href: '/dashboard/nichos', icon: Flame, label: 'Nichos Lucrativos', desc: 'Mercados em alta', color: '#f97316' },
  { href: '/dashboard/kit-vendas', icon: ShoppingCart, label: 'Kit de Vendas', desc: 'Copies e materiais', color: '#00e5c3' },
  { href: '/dashboard/indicar', icon: Gift, label: 'Indicar Amigos', desc: 'Ganhe ebooks grátis', color: '#ec4899' },
]

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  const credits = (session?.user as { credits?: number })?.credits ?? 1000

  type DeliveryRow = {
    slug: string; titulo: string; subtitulo: string; capitulosCount: number
    createdAt: string; expired: boolean; tipo: string
  }
  type DraftRow = {
    id: string; titulo: string; genero: string; nomeAutor: string; step: number; updatedAt: string
  }

  let rows: DeliveryRow[] = []
  let drafts: DraftRow[] = []

  if (userId) {
    try {
      const [deliveries, draftList] = await Promise.all([
        prisma.delivery.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { slug: true, planJson: true, createdAt: true, expiresAt: true, tipo: true },
        }),
        prisma.draft.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: { id: true, titulo: true, genero: true, nomeAutor: true, step: true, updatedAt: true },
        }),
      ])
      rows = deliveries.map((d: { slug: string; planJson: unknown; createdAt: Date; expiresAt: Date; tipo: string }) => {
        const plan = d.planJson as BriefingPlan
        return {
          slug: d.slug,
          titulo: plan.titulo ?? 'Sem título',
          subtitulo: plan.subtitulo ?? '',
          capitulosCount: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
          createdAt: d.createdAt.toISOString(),
          expired: d.expiresAt < new Date(),
          tipo: d.tipo ?? 'preview',
        }
      })
      drafts = draftList.map((d: { id: string; titulo: string; genero: string | null; nomeAutor: string; step: number; updatedAt: Date }) => ({
        id: d.id, titulo: d.titulo, genero: d.genero ?? '', nomeAutor: d.nomeAutor,
        step: d.step, updatedAt: d.updatedAt.toISOString(),
      }))
    } catch (err) {
      console.error('[dashboard] erro ao buscar ebooks:', err)
    }
  }

  const livros = rows.filter(r => r.tipo === 'livro')
  const previas = rows.filter(r => r.tipo !== 'livro')
  const total = rows.length + drafts.length

  const STATS = [
    { label: 'Total criados', value: total, icon: BookOpen, color: '#4f7fff', bg: '#4f7fff18' },
    { label: 'Em criação', value: drafts.length, icon: PenLine, color: '#facc15', bg: '#facc1518' },
    { label: 'Livros completos', value: livros.length, icon: Sparkles, color: '#00e5c3', bg: '#00e5c318' },
    { label: 'Créditos', value: credits.toLocaleString('pt-BR'), icon: Gem, color: '#8b5cf6', bg: '#8b5cf618' },
  ]

  return (
    <div className="px-5 pt-6 pb-16 md:px-8">
      <DismissableBanner />

      {/* ── Navegação principal em cards ── */}
      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc, color, active }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2 rounded-2xl border p-4 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: active ? `${color}40` : '#1c2438',
              background: active ? `${color}0d` : '#0b0f1c',
            }}
          >
            <div
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: `${color}18` }}
            >
              <Icon className="size-4" style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{label}</p>
              <p className="text-[11px] text-[#6b7a99] mt-0.5">{desc}</p>
            </div>
            {active && (
              <span
                className="mt-auto w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ background: `${color}25`, color }}
              >
                Ativo
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── Acesso rápido ── */}
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {QUICK_CARDS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-[#1c2438] bg-[#080b14] px-4 py-3 transition-all hover:border-[#1c2438]/60 hover:bg-[#0b0f1c] hover:-translate-y-0.5"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: `${color}18` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{label}</p>
              <p className="truncate text-[10px] text-[#6b7a99]">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Estatísticas ── */}
      <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] text-[#6b7a99]">{label}</p>
              <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: bg }}>
                <Icon className="size-3.5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Meus Ebooks</h2>
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-xl bg-[#4f7fff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3a6be0]"
        >
          <Plus className="size-4" />
          Criar Novo
        </Link>
      </div>

      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {drafts.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#facc1540] to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                  ✏ Em criação ({drafts.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#facc1540] to-transparent" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map(d => <DraftCard key={d.id} {...d} />)}
              </div>
            </section>
          )}

          {livros.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#00e5c340] to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5c3]">
                  📖 Livros completos ({livros.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#00e5c340] to-transparent" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {livros.map(r => <EbookCard key={r.slug} {...r} tipo="livro" />)}
              </div>
            </section>
          )}

          {previas.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#4f7fff40] to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7a99]">
                  📋 Prévias geradas ({previas.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#4f7fff40] to-transparent" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {previas.map(r => <EbookCard key={r.slug} {...r} tipo="preview" />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
