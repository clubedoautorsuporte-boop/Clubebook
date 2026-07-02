import { NextRequest, NextResponse } from 'next/server'

const MAX_CHARS = 4000

function splitIntoChunks(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text]
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let current = ''
  for (const s of sentences) {
    if ((current + ' ' + s).length > MAX_CHARS) {
      if (current) chunks.push(current.trim())
      current = s
    } else {
      current = current ? current + ' ' + s : s
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY não configurada' }, { status: 500 })
  }

  const { text, voice, hd } = await req.json() as { text: string; voice: string; hd?: boolean }
  if (!text?.trim()) return NextResponse.json({ error: 'Texto vazio' }, { status: 400 })

  const model = hd ? 'tts-1-hd' : 'tts-1'
  const chunks = splitIntoChunks(text.trim())
  const audioParts: Buffer[] = []

  for (const chunk of chunks) {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, input: chunk, voice, response_format: 'mp3' }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `OpenAI TTS error: ${err}` }, { status: 502 })
    }

    audioParts.push(Buffer.from(await res.arrayBuffer()))
  }

  const audio = Buffer.concat(audioParts)
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(audio.length),
      'Cache-Control': 'no-store',
    },
  })
}
