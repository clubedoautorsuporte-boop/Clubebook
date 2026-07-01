import { NextRequest, NextResponse } from 'next/server'

const ESTILO_MAP: Record<string, string> = {
  artistico:   'artistic oil painting style',
  realista:    'photorealistic illustration style',
  minimalista: 'clean minimalist illustration',
  ilustrado:   'detailed digital illustration',
  abstrato:    'abstract artistic illustration',
  classico:    'classic vintage book illustration',
}

export async function POST(req: NextRequest) {
  const { chapterTitle, chapterDesc, estilo, cores, titulo, nomeAutor } = await req.json()

  const estiloDesc = ESTILO_MAP[estilo ?? 'ilustrado'] ?? 'detailed digital illustration'

  const prompt = [
    `Interior book illustration for chapter "${chapterTitle}" from the book "${titulo}" by ${nomeAutor}`,
    chapterDesc ? `Chapter summary: ${String(chapterDesc).slice(0, 200)}` : '',
    estiloDesc,
    cores ? `Color mood: ${cores}` : '',
    'No text no watermarks no logos',
    'Professional book interior illustration high quality dramatic composition',
  ].filter(Boolean).join('. ')

  const params = new URLSearchParams({
    model:   'flux',
    width:   '1024',
    height:  '768',
    nologo:  'true',
    negative:'text letters words watermark logo blurry low quality',
    seed:    String(Math.floor(Math.random() * 999999)),
    enhance: 'true',
  })

  const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`

  const headers: Record<string, string> = { Accept: 'image/*' }
  if (process.env.POLLINATIONS_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.POLLINATIONS_API_KEY}`
  }

  const upstream = await fetch(url, { headers, cache: 'no-store' })
  if (!upstream.ok) {
    return NextResponse.json({ error: 'Pollinations error', status: upstream.status }, { status: 502 })
  }

  const buf = await upstream.arrayBuffer()
  return new NextResponse(buf, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
      'Cache-Control': 'no-store',
    },
  })
}
