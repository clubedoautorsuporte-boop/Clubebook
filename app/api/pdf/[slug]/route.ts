import { getDelivery } from '@/lib/delivery-store'
import { rateLimitPdfDownload } from '@/lib/rate-limit'

const SLUG_RE = /^[a-f0-9]{32}$/

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const ip =
    req.headers.get('x-forwarded-for') ??
    req.headers.get('x-client-ip') ??
    'unknown'

  const rl = rateLimitPdfDownload(ip)
  if (!rl.success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  const { slug } = await params

  if (!SLUG_RE.test(slug)) {
    return new Response('Not Found', { status: 404 })
  }

  const delivery = await getDelivery(slug)
  if (!delivery) {
    return new Response('Not Found', { status: 404 })
  }

  const pdfBuffer = Buffer.from(delivery.pdfBase64, 'base64')
  const safeName = delivery.planJson.titulo
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .slice(0, 50)
    .replace(/\s+/g, '_')

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Planejamento_${safeName}.pdf"`,
      'Cache-Control': 'private, no-store',
      'Content-Length': String(pdfBuffer.length),
    },
  })
}
