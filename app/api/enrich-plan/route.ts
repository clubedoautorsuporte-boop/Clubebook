import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { getDelivery, updateDeliveryPlan } from '@/lib/delivery-store'

export const maxDuration = 60

const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  const { slug } = await req.json() as { slug: string }
  if (!slug) return Response.json({ error: 'slug obrigatório' }, { status: 400 })

  const delivery = await getDelivery(slug)
  if (!delivery) return Response.json({ error: 'não encontrado' }, { status: 404 })

  const plan = delivery.planJson

  // Se já tem todos os campos, retorna sem gastar tokens
  if (plan.premissa && plan.publico_alvo && plan.tom_estilo && plan.sinopse) {
    return Response.json({ ok: true, cached: true, plan })
  }

  const resumo = `
Título: ${plan.titulo}
Subtítulo: ${plan.subtitulo}
Promessa: ${plan.promessa}
Capítulos: ${plan.capitulos.map(c => `${c.numero}. ${c.titulo}: ${c.descricao}`).join('\n')}
  `.trim()

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system: 'Você é um especialista editorial. Responda APENAS com JSON válido, sem markdown.',
      prompt: `Com base neste livro, gere o planejamento editorial completo:

${resumo}

Retorne APENAS este JSON:
{
  "premissa": "3-4 frases sobre a proposta central e unicidade do livro (máx 500 chars)",
  "publico_alvo": "3-4 frases sobre o leitor ideal, faixa etária, interesses e motivações (máx 400 chars)",
  "tom_estilo": "3-4 frases sobre tom narrativo, estilo de escrita, ritmo e referências (máx 400 chars)",
  "temas_centrais": ["tema 1: breve explicação", "tema 2", "tema 3", "tema 4", "tema 5"],
  "sinopse": "sinopse completa 4-6 parágrafos narrando a jornada do livro (máx 1500 chars)"
}

Tudo em português do Brasil.`,
    })

    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const enriched = JSON.parse(clean)

    const updatedPlan = {
      ...plan,
      premissa: String(enriched.premissa || '').slice(0, 500),
      publico_alvo: String(enriched.publico_alvo || '').slice(0, 400),
      tom_estilo: String(enriched.tom_estilo || '').slice(0, 400),
      temas_centrais: Array.isArray(enriched.temas_centrais)
        ? enriched.temas_centrais.slice(0, 6).map((t: unknown) => String(t).slice(0, 120))
        : [],
      sinopse: String(enriched.sinopse || '').slice(0, 1500),
    }

    await updateDeliveryPlan(slug, updatedPlan)

    return Response.json({ ok: true, cached: false, plan: updatedPlan })
  } catch (err) {
    console.error('[enrich-plan] erro:', err)
    return Response.json({ error: 'falha ao enriquecer' }, { status: 500 })
  }
}
