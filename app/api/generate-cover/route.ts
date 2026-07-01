import { NextRequest, NextResponse } from 'next/server'

const ESTILO_MAP: Record<string, string> = {
  artistico:   'artistic oil painting style with expressive brushstrokes',
  realista:    'photorealistic professional photography style',
  minimalista: 'clean minimalist graphic design with simple shapes and ample negative space',
  ilustrado:   'detailed digital illustration art style',
  abstrato:    'abstract expressionist art with flowing shapes and bold textures',
  classico:    'classic elegant vintage book design with timeless aesthetic',
}

const CORES_MAP: Record<string, string> = {
  quentes:  'warm color palette with reds oranges and rich golden tones',
  frias:    'cool color palette with deep blues purples and teals',
  escuro:   'dark mysterious color scheme with blacks deep purples and crimsons',
  natural:  'natural earthy tones with greens browns and warm beiges',
  vibrante: 'vibrant vivid color palette with bright saturated hues',
  neutro:   'neutral elegant palette with whites grays and silvers',
}

const ELEMENTO_MAP: Record<string, string> = {
  pessoa:     'mysterious lone figure standing in a dark narrow alley wearing a long coat and hat, silhouette partially illuminated by soft foggy street lights, dramatic shadows, noir atmosphere, high contrast lighting, fine art style, shallow depth of field, moody color grading, 35mm cinematic look, space reserved at top for title typography, centered subject',
  paisagem:   'vast mountain valley with golden sunrise breaking through thick clouds, layered mountain ranges fading into mist, atmospheric depth, ultra realistic lighting, dramatic sky, soft volumetric light rays, fine art matte painting style, highly detailed environment, peaceful yet powerful mood, wide composition with negative space for title',
  objeto:     'glowing ornate mystical key floating in dark space, intricate engravings, subtle magical energy particles, deep black and navy background, soft volumetric glow, highly detailed metal textures, fantasy fine art style, centered composition, dramatic lighting, minimalistic but powerful symbolism, space reserved for title text',
  abstrato:   'flowing organic shapes and layered translucent geometric forms, dynamic composition with sense of motion and depth, soft glow effects, modern surreal digital art style, high-end editorial design, balanced negative space for typography, futuristic aesthetic, ultra clean premium art direction',
  tipografia: 'minimalist cover focused only on layout and negative space, elegant composition, black textured background with subtle grain, soft dramatic lighting, premium modern design style, luxury branding aesthetic, space optimized for strong visual impact, art-directed cover composition',
}

export async function POST(req: NextRequest) {
  const { estilo, cores, elemento, descricao, naoQuero, titulo, nomeAutor, sinopse } = await req.json()

  const parts = [
    `Professional premium book cover design for the book titled "${titulo}" by ${nomeAutor}`,
    ESTILO_MAP[estilo] ?? estilo,
    CORES_MAP[cores] ?? cores,
    elemento ? (ELEMENTO_MAP[elemento] ?? '') : '',
    descricao ?? '',
    sinopse ? `The book is about: ${String(sinopse).slice(0, 150)}` : '',
    'No text no letters no title no author name no words visible on the cover',
    'Ultra-high quality professional publishing standard dramatic lighting cinematic composition',
  ].filter(Boolean).join('. ')

  const negative = [
    'text letters words title watermark logo signature ISBN barcode',
    'blurry low quality distorted ugly bad anatomy deformed',
    naoQuero ?? '',
  ].filter(Boolean).join(', ')

  const params = new URLSearchParams({
    model:    'flux',
    width:    '800',
    height:   '1200',
    nologo:   'true',
    negative,
    seed:     String(Math.floor(Math.random() * 999999)),
    enhance:  'true',
  })

  const url = `https://gen.pollinations.ai/image/${encodeURIComponent(parts)}?${params}`

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
