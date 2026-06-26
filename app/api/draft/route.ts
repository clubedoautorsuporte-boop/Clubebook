import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sanitizeField } from '@/lib/sanitize'

const schema = z.object({
  draftId: z.string().optional(),
  step: z.number().int().min(1).max(3),
  titulo: z.string().max(200),
  subtitulo: z.string().max(200).optional().default(''),
  genero: z.string().max(100).optional().default(''),
  nomeAutor: z.string().max(100),
  publico: z.string().max(100).optional().default(''),
  tom: z.string().max(50).optional().default(''),
  topicos: z.array(z.string()).optional().default([]),
  estrategia: z.string().max(20).optional().default(''),
})

// POST — criar ou atualizar rascunho
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Não autenticado' }, { status: 401 })
  const userId = session.user.id

  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'JSON inválido' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Dados inválidos' }, { status: 400 })

  const { draftId, step, topicos, ...rest } = parsed.data
  const data = {
    userId,
    step,
    titulo: sanitizeField(rest.titulo, 200),
    subtitulo: sanitizeField(rest.subtitulo ?? '', 200),
    genero: sanitizeField(rest.genero ?? '', 100),
    nomeAutor: sanitizeField(rest.nomeAutor, 100),
    publico: sanitizeField(rest.publico ?? '', 100),
    tom: sanitizeField(rest.tom ?? '', 50),
    topicos: topicos ?? [],
    estrategia: sanitizeField(rest.estrategia ?? '', 20),
  }

  try {
    if (draftId) {
      // Atualiza rascunho existente (só se pertence ao usuário)
      const draft = await prisma.draft.updateMany({
        where: { id: draftId, userId },
        data,
      })
      if (draft.count === 0) return Response.json({ error: 'Rascunho não encontrado' }, { status: 404 })
      return Response.json({ draftId })
    } else {
      // Cria novo rascunho
      const draft = await prisma.draft.create({ data })
      return Response.json({ draftId: draft.id })
    }
  } catch (e) {
    console.error('[draft] error:', e)
    return Response.json({ error: 'Erro ao salvar rascunho' }, { status: 500 })
  }
}

// DELETE — remover rascunho após geração concluída
export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Não autenticado' }, { status: 401 })
  const userId = session.user.id

  const { searchParams } = new URL(req.url)
  const draftId = searchParams.get('id')
  if (!draftId) return Response.json({ error: 'ID obrigatório' }, { status: 400 })

  await prisma.draft.deleteMany({ where: { id: draftId, userId } }).catch(() => {})
  return Response.json({ ok: true })
}
