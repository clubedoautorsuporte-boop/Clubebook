import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Não autenticado' }, { status: 401 })

  const draft = await prisma.draft.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true, titulo: true, subtitulo: true, genero: true, nomeAutor: true, publico: true, tom: true, topicos: true, estrategia: true, step: true },
  }).catch(() => null)

  if (!draft) return Response.json({ error: 'Não encontrado' }, { status: 404 })
  return Response.json(draft)
}
