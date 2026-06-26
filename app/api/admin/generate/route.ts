import { auth } from '@/auth'
import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateEbookPdf, type BriefingPlan } from '@/lib/generate-pdf'
import { createDelivery } from '@/lib/delivery-store'

export const maxDuration = 60

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'
const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) {
    return Response.json({ error: 'Acesso restrito' }, { status: 403 })
  }

  let body: { tema?: string; autor?: string }
  try { body = await req.json() } catch { return Response.json({ error: 'JSON inválido' }, { status: 400 }) }

  const tema = String(body.tema ?? '').trim().slice(0, 300)
  const autor = String(body.autor ?? 'Clube do Autor').trim().slice(0, 100)

  if (!tema) return Response.json({ error: 'Tema obrigatório' }, { status: 400 })

  // Gera planejamento via DeepSeek
  let plan: BriefingPlan
  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system: 'Você é um especialista em criação de ebooks best-sellers. Responda APENAS com JSON válido, sem markdown.',
      prompt: `Crie um planejamento completo de ebook para: "${tema}". Autor: "${autor}".

Retorne APENAS este JSON (10 capítulos obrigatórios):
{
  "titulo": "título criativo (máx 80 chars)",
  "subtitulo": "subtítulo persuasivo (máx 100 chars)",
  "capitulos": [{"numero":1,"titulo":"...","descricao":"...","blocos":["Bloco 1: ...","Bloco 2: ...","Bloco 3: ...","Bloco 4: ..."]}],
  "promessa": "resultado transformador (máx 150 chars)",
  "mensagem_final": "3 parágrafos motivacionais (máx 900 chars)"
}`,
    })
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    plan = {
      titulo: String(parsed.titulo ?? tema).slice(0, 100),
      subtitulo: String(parsed.subtitulo ?? '').slice(0, 150),
      autor,
      capitulos: Array.isArray(parsed.capitulos)
        ? parsed.capitulos.slice(0, 10).map((c: Record<string, unknown>, i: number) => ({
            numero: i + 1,
            titulo: String(c.titulo ?? `Capítulo ${i + 1}`).slice(0, 80),
            descricao: String(c.descricao ?? '').slice(0, 400),
            blocos: Array.isArray(c.blocos) ? c.blocos.slice(0, 4).map(b => String(b).slice(0, 200)) : [],
          }))
        : [],
      promessa: String(parsed.promessa ?? '').slice(0, 200),
      mensagem_final: String(parsed.mensagem_final ?? '').slice(0, 900),
    }
  } catch (err) {
    console.error('[admin/generate] DeepSeek error:', err)
    return Response.json({ error: 'Erro ao gerar planejamento com IA' }, { status: 500 })
  }

  // Gera PDF
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generateEbookPdf(plan)
  } catch (err) {
    console.error('[admin/generate] PDF error:', err)
    return Response.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }

  // Salva no banco vinculado ao admin
  const slug = await createDelivery({
    nomeAutor: autor,
    email: ADMIN_EMAIL,
    planJson: plan,
    pdfBase64: pdfBuffer.toString('base64'),
    userId: session.user.id,
  })

  return Response.json({ slug, titulo: plan.titulo, capitulos: plan.capitulos.length })
}
