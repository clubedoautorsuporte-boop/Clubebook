import { z } from 'zod'
import { auth } from '@/auth'
import { rateLimitSendPreview } from '@/lib/rate-limit'
import { sanitizeField, validateEmail } from '@/lib/sanitize'
import { generateEbookPdf, type BriefingPlan } from '@/lib/generate-pdf'
import { createDelivery } from '@/lib/delivery-store'
import { createGoogleDoc } from '@/lib/create-google-doc'

export const maxDuration = 60

const capituloSchema = z.object({
  numero: z.coerce.number().optional().default(0),
  titulo: z.string().optional().default(''),
  descricao: z.string().optional().default(''),
  blocos: z.array(z.string()).optional().default([]),
})

const bodySchema = z.object({
  nome: z.string().max(100).optional().default(''),
  email: z.string().max(254).optional().default(''),
  telefone: z.string().min(8).max(30),
  plan: z.object({
    titulo: z.string().optional().default(''),
    subtitulo: z.string().optional().default(''),
    capitulos: z.array(capituloSchema).optional().default([]),
    promessa: z.string().optional().default(''),
    mensagem_final: z.string().optional().default(''),
  }),
})

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

function getZApiHeaders(): Record<string, string> {
  const clientToken = process.env.ZAPI_CLIENT_TOKEN
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (clientToken) headers['Client-Token'] = clientToken
  return headers
}

function getZApiBaseUrl(): string {
  return `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}`
}

async function sendImageViaZApi(phone: string, imageUrl: string, caption: string): Promise<void> {
  const res = await fetch(`${getZApiBaseUrl()}/send-image`, {
    method: 'POST',
    headers: getZApiHeaders(),
    body: JSON.stringify({ phone, image: imageUrl, caption }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Z-API send-image ${res.status}: ${body}`)
  }
}

async function sendButtonViaZApi(phone: string, message: string, buttonLabel: string): Promise<void> {
  const res = await fetch(`${getZApiBaseUrl()}/send-button-list`, {
    method: 'POST',
    headers: getZApiHeaders(),
    body: JSON.stringify({
      phone,
      message,
      title: 'Clube do Autor IA',
      footer: 'Seu ebook profissional em menos de 1 hora',
      buttonList: {
        buttons: [
          { id: 'confirmar_etapa', label: buttonLabel },
        ],
      },
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Z-API send-button-list ${res.status}: ${body}`)
  }
}

async function sendTextViaZApi(phone: string, message: string): Promise<void> {
  console.log('[send-preview] z-api send-text para:', phone)
  const res = await fetch(`${getZApiBaseUrl()}/send-text`, {
    method: 'POST',
    headers: getZApiHeaders(),
    body: JSON.stringify({ phone, message }),
  })
  const body = await res.text()
  console.log('[send-preview] z-api response:', res.status, body)
  if (!res.ok) {
    throw new Error(`Z-API send-text ${res.status}: ${body}`)
  }
}

export async function POST(req: Request) {
  const session = await auth()
  const loggedUserId = session?.user?.id

  const ip =
    req.headers.get('x-client-ip') ??
    req.headers.get('x-forwarded-for') ??
    'unknown'

  const rl = rateLimitSendPreview(ip)
  if (!rl.success) {
    return Response.json(
      { error: 'Muitas requisições' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Content-Type inválido' }, { status: 415 })
  }

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (rawBody && typeof rawBody === 'object') {
    const b = rawBody as Record<string, unknown>
    if (typeof b.nome === 'string') b.nome = sanitizeField(b.nome, 100)
    if (typeof b.email === 'string') b.email = sanitizeField(b.email, 254)
    if (typeof b.telefone === 'string') b.telefone = sanitizeField(b.telefone, 20)
  }

  const parsed = bodySchema.safeParse(rawBody)
  if (!parsed.success) {
    console.error('[send-preview] zod error:', JSON.stringify(parsed.error.flatten()))
    return Response.json({ error: 'Dados inválidos: ' + JSON.stringify(parsed.error.flatten().fieldErrors) }, { status: 400 })
  }

  const { nome, email, telefone, plan } = parsed.data
  const emailValido = validateEmail(email)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://clubedoautor.online'
  const phoneDigits = normalizePhone(telefone)
  const nomeAutor = nome || 'Autor'

  const briefing: BriefingPlan = {
    titulo: plan.titulo,
    subtitulo: plan.subtitulo,
    autor: nomeAutor,
    capitulos: plan.capitulos,
    promessa: plan.promessa,
    mensagem_final: plan.mensagem_final || '',
  }

  let emailSent = false
  let whatsappSent = false
  let whatsappError: string | undefined
  let deliveryUrl: string | undefined
  let pdfDownloadUrl: string | undefined
  let googleDocUrl: string | undefined

  // ── Gerar PDF + salvar delivery ───────────────────────────────────
  let pdfBuffer: Buffer | null = null
  try {
    pdfBuffer = await generateEbookPdf(briefing)
  } catch (err) {
    console.error('[send-preview] pdf error:', err)
  }

  if (pdfBuffer) {
    try {
      const slug = await createDelivery({
        nomeAutor,
        planJson: briefing,
        pdfBase64: pdfBuffer.toString('base64'),
        ...(emailValido ? { email } : {}),
        ...(loggedUserId ? { userId: loggedUserId } : {}),
      })
      deliveryUrl = `${siteUrl}/receiver/${slug}`
      pdfDownloadUrl = `${siteUrl}/api/pdf/${slug}`
      console.log('[send-preview] delivery criado:', deliveryUrl)
    } catch (err) {
      console.error('[send-preview] delivery store error:', err)
    }
  }

  // ── Criar Google Doc (se credenciais Google configuradas) ─────────
  if (process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      googleDocUrl = await createGoogleDoc(briefing, nomeAutor)
      console.log('[send-preview] google doc:', googleDocUrl)
    } catch (err) {
      console.error('[send-preview] google doc error:', err)
    }
  }

  // Link de download (PDF direto > receiver page > site)
  const downloadLink = pdfDownloadUrl ?? deliveryUrl ?? siteUrl
  // Link do documento (Google Doc > receiver page > site)
  const documentUrl = googleDocUrl ?? deliveryUrl ?? siteUrl

  // ── Email via Resend ───────────────────────────────────────────────
  if (process.env.RESEND_API_KEY && emailValido) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: `Aurora IA <${process.env.RESEND_FROM_EMAIL ?? 'aurora@clubedoautor.online'}>`,
        to: email,
        subject: `Planejamento do seu ebook: ${plan.titulo}`,
        text: `Olá ${nomeAutor}!\n\nSeu planejamento está pronto.\n\nAcesse: ${documentUrl}\n\nFinalize em: ${siteUrl}`,
      })
      emailSent = true
    } catch (err) {
      console.error('[send-preview] email error:', err)
    }
  }

  // ── WhatsApp via Z-API ─────────────────────────────────────────────
  const isProduction = process.env.NODE_ENV === 'production'

  const msgComDownload =
    `*📚 SEU PLANEJAMENTO CHEGOU!*\n\n` +
    `Olá${nome ? ` *${nome}*` : ''}! O briefing do seu livro *"${plan.titulo}"* está pronto.\n\n` +
    `📥 *Baixar o PDF agora:*\n${downloadLink}\n\n` +
    (googleDocUrl ? `📝 *Ver no Google Docs:*\n${googleDocUrl}\n\n` : '') +
    `👉 Para receber o ebook completo, finalize em:\n${siteUrl}`

  // Envia texto primeiro (confiável), depois tenta imagem em produção
  try {
    await sendTextViaZApi(phoneDigits, msgComDownload)
    whatsappSent = true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[send-preview] z-api error:', msg)
    whatsappError = msg
  }

  // Em produção: adicionalmente tenta enviar imagem branded
  if (isProduction && whatsappSent) {
    try {
      const ogImageUrl = `${siteUrl}/api/og`
      await sendImageViaZApi(phoneDigits, ogImageUrl, `✅ Seu planejamento "${plan.titulo}" chegou!`)
    } catch {
      // imagem é extra — não afeta o resultado
    }
  }

  return Response.json({ emailSent, whatsappSent, whatsappError, deliveryUrl, pdfDownloadUrl, googleDocUrl })
}
