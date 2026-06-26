import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { BookOpen } from 'lucide-react'
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

  if (userId) {
    const deliveries = await prisma.delivery.findMany({
      where: { userId },
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
  }

  return (
    <div className="flex min-h-screen bg-[#080b14]">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar
          userName={session?.user?.name}
          userImage={session?.user?.image}
          userEmail={session?.user?.email}
        />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-8 md:pb-10 md:pl-8 md:pr-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Olá, {session?.user?.name?.split(' ')[0] ?? 'Autor'} 👋
            </h1>
            <p className="mt-1 text-sm text-[#6b7a99]">
              {rows.length > 0
                ? `Você tem ${rows.length} ebook${rows.length > 1 ? 's' : ''} gerado${rows.length > 1 ? 's' : ''}`
                : 'Crie seu primeiro ebook agora'}
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#4f7fff15] text-[#4f7fff]">
              <BookOpen className="size-4" />
            </div>
          </div>
        </div>

        {/* Section title */}
        {rows.length > 0 && (
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#3a4a66]">
            Meus Ebooks
          </h2>
        )}

        {/* Content */}
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map(r => (
              <EbookCard key={r.slug} {...r} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
