import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export async function GET(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = 20

  const where = q
    ? { OR: [{ email: { contains: q, mode: 'insensitive' as const } }, { name: { contains: q, mode: 'insensitive' as const } }] }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, name: true, email: true, image: true, credits: true, createdAt: true,
        _count: { select: { deliveries: true, drafts: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return Response.json({ users, total, page, pageSize, pages: Math.ceil(total / pageSize) })
}
