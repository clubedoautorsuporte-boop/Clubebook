import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { rateLimitChat } from '@/lib/rate-limit'
import { sanitizeField } from '@/lib/sanitize'

export const maxDuration = 30

const SYSTEM_PROMPT = `Você é a Aurora IA, assistente especialista em criação de ebooks do "Clube do Autor IA".
Seu papel é ajudar o usuário a definir o briefing perfeito para o ebook dele.
Faça perguntas, uma de cada vez, sobre: tema, público-alvo, objetivo, tom de voz e nível de profundidade.
Seja animada, concisa e profissional. Use emojis com moderação.
Após 3 ou 4 trocas, mostre um resumo do briefing em tópicos e peça a confirmação do usuário.
Responda sempre em português do Brasil.`

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-client-ip') ??
    req.headers.get('x-forwarded-for') ??
    'unknown'

  const rl = rateLimitChat(ip)
  if (!rl.success) {
    return Response.json(
      { error: 'Muitas requisições. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Content-Type inválido' }, { status: 415 })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const sanitized: UIMessage[] = messages.map((m) => ({
    ...m,
    parts: m.parts?.map((p) => {
      if (p.type === 'text' && typeof p.text === 'string') {
        return { ...p, text: sanitizeField(p.text, 2000) }
      }
      return p
    }),
  }))

  const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })
  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(sanitized),
  })

  return result.toUIMessageStreamResponse()
}
