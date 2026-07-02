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

  // Para livros gerados: usa o conteúdo real dos blocos (prosa)
  // Para planejamento: usa descricao + blocos de planejamento
  const capsList = capitulos.map(c => {
    const blocos = (c.blocos ?? []).slice(0, 3).join(' ').slice(0, 600)
    const conteudo = livroGerado
      ? `Conteúdo: ${blocos}`
      : `Descrição: ${c.descricao ?? ''} | Blocos: ${(c.blocos ?? []).slice(0, 2).join('; ')}`
    return `Capítulo ${c.numero}: ${c.titulo}\n${conteudo}`
  }).join('\n\n')

  const prompt = `Você é um roteirista profissional. Com base nos dados do livro abaixo, crie um ROTEIRO DETALHADO com exatamente 9 linhas por capítulo, explicando o que o redator deve produzir em cada capítulo.

LIVRO: "${titulo}"
AUTOR: ${autor}
${premissa ? `PREMISSA: ${premissa}` : ''}
${publico_alvo ? `PÚBLICO-ALVO: ${publico_alvo}` : ''}
${sinopse ? `SINOPSE: ${sinopse}` : ''}

CAPÍTULOS:
${capsList}

REGRAS OBRIGATÓRIAS:
- Cada capítulo DEVE ter EXATAMENTE 9 linhas — nem mais, nem menos
- Cada linha explica objetivamente um elemento, cena, desenvolvimento ou momento do capítulo
- NÃO escreva a história em si — apenas descreva o que será desenvolvido
- Cada linha deve ser específica e orientar o redator sobre o que produzir
- As linhas devem seguir ordem cronológica/lógica dentro do capítulo
- Conecte os capítulos naturalmente entre si
- Seja objetivo, profissional e informativo

Retorne APENAS JSON válido, sem markdown:
{
  "capitulos": [
    {
      "numero": 1,
      "titulo": "título do capítulo",
      "linhas": ["linha 1", "linha 2", "linha 3", "linha 4", "linha 5", "linha 6", "linha 7", "linha 8", "linha 9"]
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
