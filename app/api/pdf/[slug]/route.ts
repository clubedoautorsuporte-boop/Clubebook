import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const SLUG_RE = /^[a-f0-9]{32}$/

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  if (!SLUG_RE.test(slug)) return new Response('Not Found', { status: 404 })

  const session = await auth()
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })

  const delivery = await prisma.delivery.findFirst({
    where: { slug, userId: session.user.id },
    select: { pdfBase64: true, planJson: true, expiresAt: true },
  }).catch(() => null)

  if (!delivery) return new Response('Not Found', { status: 404 })
  if (delivery.expiresAt < new Date()) return new Response('Expired', { status: 410 })

  const plan = delivery.planJson as { titulo?: string }
  const titulo = (plan.titulo ?? 'Ebook')
    .replace(/[^\wÀ-ú\s-]/g, '')
    .trim()
    .slice(0, 60)
    .replace(/\s+/g, '_')

  const buf = Buffer.from(delivery.pdfBase64, 'base64')

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(`Planejamento_${titulo}.pdf`)}`,
      'Content-Length': String(buf.length),
      'Cache-Control': 'private, no-store',
    },
  })
}
