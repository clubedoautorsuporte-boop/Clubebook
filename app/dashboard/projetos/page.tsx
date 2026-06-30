import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '../dashboard-client'
import type { BriefingPlan } from '@/lib/generate-pdf'

function buildChartData(
  deliveries: { createdAt: Date; tipo: string }[],
  draftDates: Date[],
) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const inMonth = (dt: Date) =>
      dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth()
    const livros    = deliveries.filter(x => x.tipo === 'livro' && inMonth(x.createdAt)).length
    const previews  = deliveries.filter(x => x.tipo !== 'livro'  && inMonth(x.createdAt)).length
    const rascunhos = draftDates.filter(dt => inMonth(dt)).length
    return { date: label, livros, previews, rascunhos, total: livros + previews + rascunhos }
  })
}

function formatRelativeTime(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 60) return `há ${mins} min`
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`
  if (days  < 30) return `há ${days} dia${days > 1 ? 's' : ''}`
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default async function ProjetosPage() {
  const session = await auth()
  const userId  = session?.user?.id
  const email   = session?.user?.email

  let credits = (session?.user as { credits?: number })?.credits ?? 1000
  if (userId) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      })
      if (dbUser) credits = dbUser.credits
    } catch { /* usa valor da sessão */ }
  }

  let rows: {
    slug: string; titulo: string; subtitulo: string
    capitulosCount: number; createdAt: string; expired: boolean; tipo: string
  }[] = []
  let drafts: {
    id: string; titulo: string; genero: string
    nomeAutor: string; step: number; updatedAt: string
  }[] = []
  let chartData: { date: string; livros: number; previews: number; rascunhos: number; total: number }[] = []

  if (userId || email) {
    try {
      const deliveryWhere = userId && email
        ? { OR: [{ userId }, { email }] }
        : userId
        ? { userId }
        : { email: email! }

      const [deliveries, draftList] = await Promise.all([
        prisma.delivery.findMany({
          where: deliveryWhere,
          orderBy: { createdAt: 'desc' },
          select: { slug: true, planJson: true, createdAt: true, expiresAt: true, tipo: true },
        }),
        userId
          ? prisma.draft.findMany({
              where: { userId },
              orderBy: { updatedAt: 'desc' },
              select: { id: true, titulo: true, genero: true, nomeAutor: true, step: true, updatedAt: true, createdAt: true },
            })
          : Promise.resolve([]),
      ])

      const seen = new Set<string>()
      const uniqueDeliveries = deliveries.filter(d => {
        if (seen.has(d.slug)) return false
        seen.add(d.slug)
        return true
      })

      rows = uniqueDeliveries.map((d) => {
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

      drafts = draftList.map((d) => ({
        id: d.id,
        titulo: d.titulo,
        genero: d.genero ?? '',
        nomeAutor: d.nomeAutor,
        step: d.step,
        updatedAt: d.updatedAt.toISOString(),
      }))

      chartData = buildChartData(
        uniqueDeliveries.map(d => ({ createdAt: d.createdAt, tipo: d.tipo })),
        draftList.map(d => (d as { createdAt: Date }).createdAt),
      )
    } catch (err) { console.error('[projetos] erro:', err) }
  }

  const recentActivity: { label: string; tipo: 'livro' | 'preview' | 'rascunho'; time: string }[] = [
    ...rows.map(r => ({ label: r.titulo, tipo: r.tipo as 'livro' | 'preview', time: r.createdAt })),
    ...drafts.map(d => ({ label: d.titulo, tipo: 'rascunho' as const, time: d.updatedAt })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 4)
    .map(a => ({
      label: a.label,
      tipo: a.tipo,
      time: formatRelativeTime(a.time),
    }))

  return (
    <DashboardClient
      rows={rows}
      drafts={drafts}
      credits={credits}
      chartData={chartData}
      recentActivity={recentActivity}
    />
  )
}
