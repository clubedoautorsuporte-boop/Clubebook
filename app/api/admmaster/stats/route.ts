import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export async function GET() {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso negado' }, { status: 403 })

  const [
    totalUsers,
    totalDeliveries,
    totalDrafts,
    recentUsers,
    recentDeliveries,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.delivery.count(),
    prisma.draft.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, name: true, email: true, image: true, credits: true, createdAt: true, _count: { select: { deliveries: true, drafts: true } } },
    }),
    prisma.delivery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true, slug: true, nomeAutor: true, planJson: true, createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ])

  return Response.json({ totalUsers, totalDeliveries, totalDrafts, recentUsers, recentDeliveries })
}
