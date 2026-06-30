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
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks', desc: 'Estante digital', color: '#4f7fff', active: true },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas', desc: 'Gerencie e distribua', color: '#00e5c3' },
  { href: '/dashboard/creditos', icon: Gem, label: 'Créditos', desc: 'Saldo e histórico', color: '#8b5cf6' },
  { href: '/dashboard/biblioteca', icon: Library, label: 'Biblioteca', desc: 'Templates prontos', color: '#f97316' },
]

const QUICK_CARDS = [
  { href: '/dashboard/kit-ferramentas', icon: Wrench, label: 'Kit Ferramentas', color: '#4f7fff' },
  { href: '/dashboard/nichos', icon: Flame, label: 'Nichos Lucrativos', color: '#f97316' },
  { href: '/dashboard/kit-vendas', icon: ShoppingCart, label: 'Kit de Vendas', color: '#00e5c3' },
  { href: '/dashboard/indicar', icon: Gift, label: 'Indicar Amigos', color: '#ec4899' },
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
    { label: 'Total criados', value: total, icon: BookOpen, color: '#4f7fff' },
    { label: 'Em criação', value: drafts.length, icon: PenLine, color: '#facc15' },
    { label: 'Livros completos', value: livros.length, icon: Sparkles, color: '#00e5c3' },
    { label: 'Créditos', value: credits.toLocaleString('pt-BR'), icon: Gem, color: '#8b5cf6' },
  ]

  return (
    <div className="px-5 pt-5 pb-16 md:px-6 max-w-6xl">
      <DismissableBanner />

      {/* ── Stats bar ── */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 transition hover:border-[#1c2438]/60"
          >
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{ background: `${color}15` }}
            >
              <Icon className="size-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#6b7a99] leading-none mb-1">{label}</p>
              <p className="text-lg font-extrabold text-white tabular-nums leading-none">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Nav + Quick cards em linha ── */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc, color, active }) => (
          <Link
            key={href}
            href={href}
            className="group col-span-1 flex flex-col gap-2 rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{
              borderColor: active ? `${color}35` : '#1c2438',
              background: active ? `${color}0a` : '#0b0f1c',
            }}
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${color}18` }}>
              <Icon className="size-3.5" style={{ color }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-tight">{label}</p>
              <p className="text-[10px] text-[#6b7a99] mt-0.5 leading-tight">{desc}</p>
            </div>
            {active && (
              <span
                className="w-fit rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                style={{ background: `${color}20`, color }}
              >
                Ativo
              </span>
            )}
          </Link>
        ))}

        {QUICK_CARDS.map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className="col-span-1 flex flex-col gap-2 rounded-xl border border-[#1c2438] bg-[#080b14] p-3.5 transition-all hover:border-[#1c2438]/60 hover:bg-[#0b0f1c] hover:-translate-y-0.5"
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${color}18` }}>
              <Icon className="size-3.5" style={{ color }} />
            </div>
            <p className="text-[13px] font-semibold text-white leading-tight">{label}</p>
          </Link>
        ))}
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Meus Ebooks</h2>
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-lg bg-[#4f7fff] px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-[#3a6be0] hover:-translate-y-0.5"
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
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#facc1530] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#facc15]">
                  Em criação ({drafts.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#facc1530] to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map(d => <DraftCard key={d.id} {...d} />)}
              </div>
            </section>
          )}

          {livros.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#00e5c330] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#00e5c3]">
                  Livros completos ({livros.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#00e5c330] to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {livros.map(r => <EbookCard key={r.slug} {...r} tipo="livro" />)}
              </div>
            </section>
          )}

          {previas.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-[#4f7fff30] to-transparent" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#6b7a99]">
                  Prévias geradas ({previas.length})
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-[#4f7fff30] to-transparent" />
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
