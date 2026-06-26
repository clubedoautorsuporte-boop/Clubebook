import { auth } from '@/auth'
import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

export const maxDuration = 120

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'
const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso restrito' }, { status: 403 })

  const { livroTitulo, tema, capitulo } = await req.json() as {
    livroTitulo: string
    tema: string
    capitulo: { numero: number; titulo: string; objetivo: string; subtopicos: string[] }
  }

  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    system: `Você é um autor especialista em "${tema}" escrevendo um livro profissional em português do Brasil.
Escreva conteúdo rico, detalhado e prático. Use linguagem fluente e envolvente.
Organize com subtítulos (## Título), listas quando relevante, e **negrito** para termos importantes.`,
    prompt: `Escreva o Capítulo ${capitulo.numero} do livro "${livroTitulo}".

TÍTULO DO CAPÍTULO: ${capitulo.titulo}
OBJETIVO: ${capitulo.objetivo}
SUBTÓPICOS A COBRIR: ${capitulo.subtopicos.join(', ')}

INSTRUÇÕES DE ESCRITA:
- Escreva entre 2.500 e 3.500 palavras de conteúdo REAL e ÚTIL
- Comece com uma abertura envolvente (2-3 parágrafos) que conecta o leitor
- Desenvolva cada subtópico com profundidade real: exemplos práticos, dados, histórias
- Use ## para subtítulos principais (um por subtópico)
- Use ### para sub-subtítulos quando necessário
- Inclua listas (- item) quando listar passos ou exemplos
- Use **negrito** para conceitos-chave importantes
- Termine com uma conclusão do capítulo (2-3 parágrafos) resumindo os aprendizados
- Escreva como um livro best-seller, não como um guia genérico
- Todo conteúdo em português do Brasil
- NÃO inclua o número ou título do capítulo no início (será adicionado pelo sistema)

Escreva o conteúdo completo agora:`,
  })

  return Response.json({ numero: capitulo.numero, titulo: capitulo.titulo, content: text.trim() })
}
