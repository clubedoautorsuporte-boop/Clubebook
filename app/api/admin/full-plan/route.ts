import { auth } from '@/auth'
import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export const maxDuration = 60

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'
const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso restrito' }, { status: 403 })

  const { tema, autor } = await req.json() as { tema?: string; autor?: string }
  if (!tema?.trim()) return Response.json({ error: 'Tema obrigatório' }, { status: 400 })

  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    system: 'Responda APENAS com JSON válido, sem markdown, sem texto extra.',
    prompt: `Crie a estrutura de um livro completo sobre "${tema.trim()}". Autor: "${autor ?? 'Clube do Autor IA'}".

Retorne EXATAMENTE este JSON com 10 capítulos:
{
  "titulo": "título do livro (criativo, máx 80 chars)",
  "subtitulo": "subtítulo persuasivo (máx 100 chars)",
  "descricao_geral": "descrição do livro (2-3 frases, máx 300 chars)",
  "publico_alvo": "para quem é este livro (1 frase)",
  "capitulos": [
    {
      "numero": 1,
      "titulo": "título criativo do capítulo",
      "objetivo": "o que o leitor vai aprender/descobrir neste capítulo (1-2 frases)",
      "subtopicos": ["subtópico 1", "subtópico 2", "subtópico 3", "subtópico 4", "subtópico 5"]
    }
  ]
}

REGRAS:
- Exatamente 10 capítulos em sequência lógica de aprendizado
- Títulos criativos, nunca "Introdução" ou "Conclusão"
- Subtópicos específicos e práticos
- Todo em português do Brasil`,
  })

  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(clean)

  return Response.json({
    titulo: String(parsed.titulo).slice(0, 100),
    subtitulo: String(parsed.subtitulo ?? '').slice(0, 150),
    descricao_geral: String(parsed.descricao_geral ?? ''),
    publico_alvo: String(parsed.publico_alvo ?? ''),
    capitulos: (parsed.capitulos as Array<{ numero: number; titulo: string; objetivo: string; subtopicos: string[] }>)
      .slice(0, 10)
      .map((c, i) => ({
        numero: i + 1,
        titulo: String(c.titulo),
        objetivo: String(c.objetivo ?? ''),
        subtopicos: Array.isArray(c.subtopicos) ? c.subtopicos.map(String) : [],
      })),
  })
}
