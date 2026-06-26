import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { DraftCard } from '@/components/dashboard/draft-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { QuickCreate } from '@/components/dashboard/quick-create'
import { DismissableBanner } from '@/components/dashboard/dismissable-banner'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  type DeliveryRow = {
    slug: string
    titulo: string
    subtitulo: string
    capitulosCount: number
    createdAt: string
    expired: boolean
    tipo: string
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
        id: d.id,
        titulo: d.titulo,
        genero: d.genero ?? '',
        nomeAutor: d.nomeAutor,
        step: d.step,
        updatedAt: d.updatedAt.toISOString(),
      }))
    } catch (err) {
      console.error('[dashboard] erro ao buscar ebooks:', err)
    }
  }

  const livros   = rows.filter(r => r.tipo === 'livro')
  const previas  = rows.filter(r => r.tipo !== 'livro')
  const total    = rows.length + drafts.length

  return (
    <div className="px-5 pt-6 pb-12 md:px-8">
      {/* Dismissable banner */}
      <DismissableBanner />

      {/* Section heading */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Meus Ebooks</h2>
          <p className="mt-0.5 text-sm text-[#6b7a99]">
            Continue de onde parou ou comece uma nova história.
          </p>
        </div>
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-xl bg-[#00e5c3] px-4 py-2 text-sm font-bold text-[#040810] transition hover:bg-[#00cfb0]"
        >
          <Plus className="size-4" />
          Criar Novo Ebook
        </Link>
      </div>

      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          <QuickCreate />

          {/* ── Rascunhos em andamento ── */}
          {drafts.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-[#1c2438]" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#4f7fff]">
                  ✏ Em criação ({drafts.length})
                </p>
                <span className="h-px flex-1 bg-[#1c2438]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map(d => <DraftCard key={d.id} {...d} />)}
              </div>
            </section>
          )}

          {/* ── Livros completos gerados ── */}
          {livros.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-[#1c2438]" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#00e5c3]">
                  📖 Livros completos ({livros.length})
                </p>
                <span className="h-px flex-1 bg-[#1c2438]" />
              </div>
              <p className="mb-4 -mt-1 text-[12px] text-[#4a5578]">
                Livros escritos pela Aurora IA com conteúdo completo, prontos para download.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {livros.map(r => <EbookCard key={r.slug} {...r} tipo="livro" />)}
              </div>
            </section>
          )}

          {/* ── Prévias / Briefings ── */}
          {previas.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-[#1c2438]" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#6b7a99]">
                  📋 Prévias geradas ({previas.length})
                </p>
                <span className="h-px flex-1 bg-[#1c2438]" />
              </div>
              <p className="mb-4 -mt-1 text-[12px] text-[#4a5578]">
                Briefings e planejamentos — o livro completo é gerado após a confirmação.
              </p>
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
