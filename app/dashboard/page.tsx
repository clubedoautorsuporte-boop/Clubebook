import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EbookCard } from '@/components/dashboard/ebook-card'
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
  }

  let rows: DeliveryRow[] = []
  const userEmail = session?.user?.email

  if (userId || userEmail) {
    try {
      // Busca por userId OU por email (fallback para ebooks criados antes de ter conta vinculada)
      const deliveries = await prisma.delivery.findMany({
        where: {
          OR: [
            ...(userId ? [{ userId }] : []),
            ...(userEmail ? [{ email: userEmail, userId: null }] : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, slug: true, planJson: true, createdAt: true, expiresAt: true },
      })
      rows = deliveries.map((d: { id: string; slug: string; planJson: unknown; createdAt: Date; expiresAt: Date }) => {
        const plan = d.planJson as BriefingPlan
        return {
          slug: d.slug,
          titulo: plan.titulo ?? 'Sem título',
          subtitulo: plan.subtitulo ?? '',
          capitulosCount: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
          createdAt: d.createdAt.toISOString(),
          expired: d.expiresAt < new Date(),
        }
      })
    } catch (err) {
      console.error('[dashboard] erro ao buscar ebooks:', err)
    }
  }

  const total = rows.length

  return (
    <div className="px-5 pt-6 md:px-8">
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
        <>
          <div className="mb-6">
            <QuickCreate />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(r => (
              <EbookCard key={r.slug} {...r} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
