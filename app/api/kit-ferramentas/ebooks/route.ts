import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { BriefingPlan } from '@/lib/generate-pdf'

export type EbookOption = {
  id: string
  tipo: 'livro' | 'preview' | 'draft'
  titulo: string
  subtitulo?: string
  autor?: string
  genero?: string
  publico?: string
  tom?: string
  capitulos?: { numero: number; titulo: string; texto: string }[]
}

async function resolveUserId(session: { user?: { id?: string; email?: string | null; name?: string | null; image?: string | null } }): Promise<string | null> {
  const rawId = session.user?.id
  const email = session.user?.email
  if (!rawId) return null
  if (!/^\d+$/.test(rawId)) return rawId
  if (!email) return null
  try {
    const dbUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    return dbUser?.id ?? null
  } catch { return null }
}

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Não autorizado' }, { status: 401 })

  const userId = await resolveUserId(session as Parameters<typeof resolveUserId>[0])
  if (!userId) return Response.json({ ebooks: [] })

  const [deliveries, drafts] = await Promise.all([
    prisma.delivery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, planJson: true, tipo: true },
    }),
    prisma.draft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, titulo: true, genero: true, nomeAutor: true, publico: true, tom: true },
    }),
  ])

  const ebooks: EbookOption[] = [
    ...deliveries.map(d => {
      const plan = d.planJson as BriefingPlan
      return {
        id: d.slug,
        tipo: (d.tipo === 'livro' ? 'livro' : 'preview') as EbookOption['tipo'],
        titulo: plan.titulo ?? 'Sem título',
        subtitulo: plan.subtitulo,
        autor: plan.autor,
        capitulos: plan.capitulos?.map(c => ({
          numero: c.numero,
          titulo: c.titulo,
          texto: [c.descricao, ...(c.blocos ?? [])].filter(Boolean).join('\n\n'),
        })) ?? [],
      }
    }),
    ...drafts.map(d => ({
      id: d.id,
      tipo: 'draft' as EbookOption['tipo'],
      titulo: d.titulo,
      genero: d.genero ?? undefined,
      publico: d.publico ?? undefined,
      tom: d.tom ?? undefined,
      autor: d.nomeAutor,
    })),
  ]

  return Response.json({ ebooks })
}
