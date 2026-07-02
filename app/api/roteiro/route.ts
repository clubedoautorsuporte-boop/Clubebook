import { NextRequest } from 'next/server'
import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export const maxDuration = 90

const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

interface CapituloInput {
  numero: number
  titulo: string
  descricao?: string
  blocos?: string[]
}

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: 'DEEPSEEK_API_KEY não configurada' }, { status: 500 })
  }

  const body = await req.json() as {
    titulo: string
    autor: string
    premissa?: string
    publico_alvo?: string
    sinopse?: string
    capitulos: CapituloInput[]
    tipo?: string
  }

  const { titulo, autor, premissa, publico_alvo, sinopse, capitulos, tipo } = body

  if (!titulo || !capitulos?.length) {
    return Response.json({ error: 'Dados insuficientes' }, { status: 400 })
  }

  const livroGerado = tipo === 'livro'

  const capsList = capitulos.map(c => {
    const conteudo = livroGerado
      ? (c.blocos ?? []).slice(0, 2).join(' ').slice(0, 500)
      : `${c.descricao ?? ''} ${(c.blocos ?? []).slice(0, 2).join(' ')}`.slice(0, 500)
    return `Capítulo ${c.numero}: ${c.titulo}\n${conteudo}`
  }).join('\n\n')

  const prompt = `Você é um especialista em estruturação de livros. Com base nos dados abaixo, escreva para cada capítulo um BRIEFING DETALHADO em parágrafo corrido — sem listas, sem números — explicando claramente o que acontecerá naquele capítulo e o que o redator deve produzir.

LIVRO: "${titulo}"
AUTOR: ${autor}
${premissa ? `PREMISSA: ${premissa}` : ''}
${publico_alvo ? `PÚBLICO-ALVO: ${publico_alvo}` : ''}
${sinopse ? `SINOPSE: ${sinopse}` : ''}

CAPÍTULOS:
${capsList}

REGRAS:
- Cada capítulo terá exatamente 3 campos: "resumo", "topicos" e "proposito"
- "resumo": parágrafo único corrido de 9 linhas (≈ 500 a 600 caracteres) explicando o que acontece no capítulo — NÃO escreva a história, apenas descreva o conteúdo que o redator deve criar
- "topicos": array com 3 bullets curtos (cada um com menos de 80 chars) destacando os principais elementos do capítulo
- "proposito": 1 frase curta explicando o objetivo narrativo do capítulo

Retorne APENAS JSON válido, sem markdown:
{
  "capitulos": [
    {
      "numero": 1,
      "titulo": "título do capítulo",
      "resumo": "parágrafo corrido de 9 linhas descrevendo o conteúdo...",
      "topicos": ["elemento chave 1", "elemento chave 2", "elemento chave 3"],
      "proposito": "objetivo narrativo deste capítulo"
    }
  ]
}`

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system: 'Responda APENAS com JSON válido, sem markdown, sem texto extra.',
      prompt,
    })

    const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const json = JSON.parse(clean)

    return Response.json(json)
  } catch (e) {
    console.error('Roteiro error:', e)
    return Response.json({ error: 'Falha ao gerar roteiro' }, { status: 502 })
  }
}
