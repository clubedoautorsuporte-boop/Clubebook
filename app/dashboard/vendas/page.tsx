import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { BriefingPlan } from '@/lib/generate-pdf'
import VendasClientPage from './vendas-client'

export default async function VendasPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const userId = session.user.id
  const email  = session.user.email

  const deliveryWhere = userId && email
    ? { OR: [{ userId }, { email }] }
    : { userId }

  const deliveries = await prisma.delivery.findMany({
    where: deliveryWhere,
    orderBy: { createdAt: 'desc' },
    select: { slug: true, planJson: true, createdAt: true, expiresAt: true },
  }).catch(() => [])

  // Deduplicar por slug
  const seen = new Set<string>()
  const unique = deliveries.filter(d => { if (seen.has(d.slug)) return false; seen.add(d.slug); return true })

  const ebooks = unique.map(d => {
    const plan = d.planJson as BriefingPlan
    return {
      slug:      d.slug,
      titulo:    plan.titulo    ?? 'Sem título',
      subtitulo: plan.subtitulo ?? '',
      capitulos: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
      createdAt: d.createdAt.toISOString(),
      expired:   d.expiresAt < new Date(),
    }
  })

  return <VendasClientPage ebooks={ebooks} />
}
