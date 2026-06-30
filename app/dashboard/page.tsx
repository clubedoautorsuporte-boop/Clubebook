import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './dashboard-client'
import type { BriefingPlan } from '@/lib/generate-pdf'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  const credits = (session?.user as { credits?: number })?.credits ?? 1000

  let rows: { slug: string; titulo: string; subtitulo: string; capitulosCount: number; createdAt: string; expired: boolean; tipo: string }[] = []
  let drafts: { id: string; titulo: string; genero: string; nomeAutor: string; step: number; updatedAt: string }[] = []

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

  return <DashboardClient rows={rows} drafts={drafts} credits={credits} />
}
