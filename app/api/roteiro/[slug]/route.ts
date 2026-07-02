import { NextRequest } from 'next/server'
import { saveRoteiroJson } from '@/lib/delivery-store'

const SLUG_RE = /^[a-f0-9]{32}$/

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) return Response.json({ error: 'Slug inválido' }, { status: 400 })

  try {
    const data = await req.json()
    if (!data?.capitulos) return Response.json({ error: 'Dados inválidos' }, { status: 400 })
    await saveRoteiroJson(slug, data)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Falha ao salvar' }, { status: 500 })
  }
}
