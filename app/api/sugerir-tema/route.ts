import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export const maxDuration = 30

const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Content-Type inválido' }, { status: 415 })
  }

  let objetivo = ''
  let detalhes = ''
  try {
    const body = await req.json()
    objetivo = String(body?.objetivo ?? '').slice(0, 200)
    detalhes = String(body?.detalhes ?? '').slice(0, 500)
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!objetivo) {
    return Response.json({ error: 'Objetivo é obrigatório' }, { status: 400 })
  }

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system:
        'Você é um especialista em criação de ebooks best-sellers para o mercado digital brasileiro. Responda APENAS com o tema sugerido, sem explicações adicionais.',
      prompt: `Objetivo do autor: "${objetivo}"
Detalhes adicionais do autor: "${detalhes || 'nenhum'}"

Crie UM tema específico e atrativo para um ebook best-seller no Brasil em 2026 que:
1. Esteja diretamente alinhado com o objetivo do autor
2. Tenha alto potencial de venda no mercado digital brasileiro
3. Seja específico o suficiente para ser desenvolvido em 8-10 capítulos práticos
4. Use linguagem direta e vendedora

Retorne APENAS o tema em uma frase direta e poderosa (máximo 80 caracteres), sem aspas, sem pontos finais, sem explicações.`,
    })

    return Response.json({ tema: text.trim().replace(/^["']|["']$/g, '') })
  } catch {
    return Response.json({ error: 'Erro ao gerar sugestão' }, { status: 500 })
  }
}
