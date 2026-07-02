import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { saveRoteiroJson } from '@/lib/delivery-store'
import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export const maxDuration = 300

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'
const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

async function gerarRoteiroParaDelivery(delivery: {
  slug: string
  planJson: unknown
  tipo: string
  nomeAutor: string
}) {
  const plan = delivery.planJson as Record<string, unknown>
  const capitulos = (plan.capitulos as unknown[]) ?? []
  const tipo = delivery.tipo
  const livroGerado = tipo === 'livro'

  const capsList = (capitulos as Array<Record<string, unknown>>).map(c => {
    const blocos = ((c.blocos as string[]) ?? []).slice(0, 2).join(' ').slice(0, 400)
    const conteudo = livroGerado
      ? `Conteúdo: ${blocos}`
      : `Descrição: ${c.descricao ?? ''} | Blocos: ${((c.blocos as string[]) ?? []).slice(0, 2).join('; ')}`.slice(0, 400)
    return `Capítulo ${c.numero}: ${c.titulo}\n${conteudo}`
  }).join('\n\n')

  const prompt = `Você é um especialista em estruturação de livros. Crie um ROTEIRO DETALHADO para cada capítulo do livro "${plan.titulo}" de ${delivery.nomeAutor}.

${plan.premissa ? `PREMISSA: ${plan.premissa}` : ''}
${plan.sinopse ? `SINOPSE: ${String(plan.sinopse).slice(0, 400)}` : ''}

CAPÍTULOS:
${capsList}

REGRAS:
- "resumo": parágrafo único corrido de 9 linhas (≈ 500-600 chars) explicando o que acontece no capítulo
- "topicos": array com 3 bullets curtos (< 80 chars cada)
- "proposito": 1 frase curta com o objetivo narrativo

Retorne APENAS JSON válido, sem markdown:
{
  "capitulos": [
    {
      "numero": 1,
      "titulo": "título",
      "resumo": "parágrafo de 9 linhas...",
      "topicos": ["tópico 1", "tópico 2", "tópico 3"],
      "proposito": "objetivo narrativo"
    }
  ]
}`

  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    system: 'Responda APENAS com JSON válido, sem markdown, sem texto extra.',
    prompt,
  })

  const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(clean)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) {
    return Response.json({ error: 'Acesso restrito' }, { status: 403 })
  }

  const { batchSize = 5 } = await req.json().catch(() => ({})) as { batchSize?: number }

  // Busca todos os deliveries sem roteiro ainda
  const deliveries = await prisma.delivery.findMany({
    where: { roteiroJson: null },
    select: { slug: true, planJson: true, tipo: true, nomeAutor: true },
    orderBy: { createdAt: 'desc' },
    take: batchSize,
  })

  if (deliveries.length === 0) {
    return Response.json({ message: 'Todos os livros já têm roteiro gerado.', total: 0 })
  }

  const resultados: { slug: string; status: string; erro?: string }[] = []

  for (const delivery of deliveries) {
    try {
      const roteiro = await gerarRoteiroParaDelivery({
        slug: delivery.slug,
        planJson: delivery.planJson,
        tipo: delivery.tipo,
        nomeAutor: delivery.nomeAutor,
      })
      await saveRoteiroJson(delivery.slug, roteiro)
      resultados.push({ slug: delivery.slug, status: 'ok' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`[generate-roteiros] erro no slug ${delivery.slug}:`, msg)
      resultados.push({ slug: delivery.slug, status: 'erro', erro: msg })
    }

    // Pausa entre chamadas para não sobrecarregar a API
    await new Promise(r => setTimeout(r, 1500))
  }

  const pendentes = await prisma.delivery.count({ where: { roteiroJson: null } })

  return Response.json({
    processados: resultados.length,
    pendentes,
    resultados,
  })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) {
    return Response.json({ error: 'Acesso restrito' }, { status: 403 })
  }

  const total = await prisma.delivery.count()
  const comRoteiro = await prisma.delivery.count({ where: { roteiroJson: { not: null } } })
  const semRoteiro = total - comRoteiro

  return Response.json({ total, comRoteiro, semRoteiro })
}
