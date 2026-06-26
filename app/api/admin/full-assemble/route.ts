import { auth } from '@/auth'
import { generateFullBookPdf } from '@/lib/generate-full-pdf'
import { createDelivery } from '@/lib/delivery-store'
import type { BriefingPlan } from '@/lib/generate-pdf'

export const maxDuration = 120

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso restrito' }, { status: 403 })

  const { titulo, subtitulo, autor, capitulos } = await req.json() as {
    titulo: string
    subtitulo: string
    autor: string
    capitulos: Array<{ numero: number; titulo: string; content: string }>
  }

  // Gera o PDF do livro completo
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generateFullBookPdf({ titulo, subtitulo, autor, capitulos })
  } catch (e) {
    console.error('[full-assemble] PDF error:', e)
    return Response.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }

  // planJson no formato BriefingPlan para compatibilidade com o dashboard
  const planJson: BriefingPlan = {
    titulo,
    subtitulo,
    autor,
    promessa: `Livro completo com ${capitulos.length} capítulos escritos pela Aurora IA`,
    mensagem_final: `Seu livro "${titulo}" foi gerado com sucesso com ${capitulos.length} capítulos de conteúdo completo e profissional.`,
    capitulos: capitulos.map(c => ({
      numero: c.numero,
      titulo: c.titulo,
      descricao: c.content.slice(0, 300) + '...',
      blocos: [],
    })),
  }

  const slug = await createDelivery({
    nomeAutor: autor,
    email: ADMIN_EMAIL,
    planJson,
    pdfBase64: pdfBuffer.toString('base64'),
    userId: session.user.id,
  })

  return Response.json({ slug, titulo, capitulos: capitulos.length, pdfSize: pdfBuffer.length })
}
