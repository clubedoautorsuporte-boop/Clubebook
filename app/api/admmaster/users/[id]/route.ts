import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso negado' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, email: true, image: true, credits: true, createdAt: true,
      deliveries: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, slug: true, nomeAutor: true, planJson: true, createdAt: true, expiresAt: true },
      },
      drafts: {
        orderBy: { updatedAt: 'desc' },
        select: { id: true, titulo: true, step: true, genero: true, createdAt: true, updatedAt: true },
      },
    },
  })

  if (!user) return Response.json({ error: 'Usuário não encontrado' }, { status: 404 })
  return Response.json(user)
}
