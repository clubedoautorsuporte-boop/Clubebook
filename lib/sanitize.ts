const MAX_LENGTHS = { nome: 100, tema: 500, email: 254, telefone: 20 } as const

function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .trim()
}

export function sanitizeField(str: unknown, maxLen: number): string {
  if (typeof str !== 'string') return ''
  return stripHtml(str).slice(0, maxLen).trim()
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export function validateBrazilianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 11) return false
  const ddd = parseInt(digits.slice(0, 2))
  return ddd >= 11 && ddd <= 99
}

export type SanitizedPayload = {
  nome: string
  tema: string
  email: string
  telefone: string
}

export function sanitizeFormPayload(body: unknown): {
  valid: boolean
  errors: string[]
  data: SanitizedPayload
} {
  const errors: string[] = []
  const raw =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {}

  const nome = sanitizeField(raw.nome, MAX_LENGTHS.nome)
  const tema = sanitizeField(raw.tema, MAX_LENGTHS.tema)
  const email = sanitizeField(raw.email, MAX_LENGTHS.email)
  const telefone = sanitizeField(raw.telefone, MAX_LENGTHS.telefone)

  if (!tema) errors.push('Tema é obrigatório')
  if (!email) errors.push('E-mail é obrigatório')
  else if (!validateEmail(email)) errors.push('E-mail inválido')

  return { valid: errors.length === 0, errors, data: { nome, tema, email, telefone } }
}

export function sanitizeMessages(messages: unknown[]): unknown[] {
  return messages.map((m) => {
    if (!m || typeof m !== 'object') return m
    const msg = m as Record<string, unknown>
    if (!Array.isArray(msg.parts)) return m
    return {
      ...msg,
      parts: msg.parts.map((p: unknown) => {
        if (!p || typeof p !== 'object') return p
        const part = p as Record<string, unknown>
        if (part.type === 'text' && typeof part.text === 'string') {
          return { ...part, text: sanitizeField(part.text, 2000) }
        }
        return p
      }),
    }
  })
}
