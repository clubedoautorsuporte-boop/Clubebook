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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso negado' }, { status: 403 })

  // Impede o admin de deletar a própria conta
  const target = await prisma.user.findUnique({ where: { id: params.id }, select: { email: true } })
  if (!target) return Response.json({ error: 'Usuário não encontrado' }, { status: 404 })
  if (target.email === ADMIN_EMAIL) return Response.json({ error: 'Não é possível deletar a conta admin' }, { status: 403 })

  // Cascade: drafts e accounts são deletados pelo onDelete: Cascade do schema
  // Deliveries têm userId nullable — desvincula em vez de deletar
  await prisma.delivery.updateMany({ where: { userId: params.id }, data: { userId: null } })
  await prisma.user.delete({ where: { id: params.id } })

  return Response.json({ success: true })
}
