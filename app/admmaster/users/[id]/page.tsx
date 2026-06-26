import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UserDetailClient from './client'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      credits: true,
      createdAt: true,
      deliveries: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, slug: true, nomeAutor: true, planJson: true,
          createdAt: true, expiresAt: true,
        },
      },
      drafts: {
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true, titulo: true, step: true, genero: true,
          createdAt: true, updatedAt: true,
        },
      },
    },
  })

  if (!user) notFound()

  return <UserDetailClient user={user as UserFull} />
}

export type DeliveryRow = {
  id: string; slug: string; nomeAutor: string
  planJson: { titulo?: string; subtitulo?: string; capitulos?: unknown[] }
  createdAt: Date; expiresAt: Date
}

export type DraftRow = {
  id: string; titulo: string; step: number
  genero: string | null; createdAt: Date; updatedAt: Date
}

export type UserFull = {
  id: string; name: string | null; email: string | null
  image: string | null; credits: number; createdAt: Date
  deliveries: DeliveryRow[]; drafts: DraftRow[]
}
