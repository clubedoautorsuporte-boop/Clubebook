import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import type { BriefingPlan } from '@/lib/generate-pdf'

export type DeliveryRecord = {
  id: string
  slug: string
  nomeAutor: string
  planJson: BriefingPlan
  pdfBase64: string
  createdAt: Date
  expiresAt: Date
}

export async function createDelivery(data: {
  nomeAutor: string
  email?: string
  planJson: BriefingPlan
  pdfBase64: string
  userId?: string
}): Promise<string> {
  const slug = randomUUID().replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await prisma.delivery.create({
    data: {
      slug,
      nomeAutor: data.nomeAutor,
      planJson: data.planJson as object,
      pdfBase64: data.pdfBase64,
      expiresAt,
      ...(data.email ? { email: data.email } : {}),
      ...(data.userId ? { userId: data.userId } : {}),
    },
  })

  return slug
}

export async function getDelivery(slug: string): Promise<DeliveryRecord | null> {
  const d = await prisma.delivery.findUnique({ where: { slug } })
  if (!d) return null
  if (d.expiresAt < new Date()) return null
  return {
    id: d.id,
    slug: d.slug,
    nomeAutor: d.nomeAutor,
    planJson: d.planJson as unknown as BriefingPlan,
    pdfBase64: d.pdfBase64,
    createdAt: d.createdAt,
    expiresAt: d.expiresAt,
  }
}
