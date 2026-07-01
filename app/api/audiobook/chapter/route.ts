import { NextRequest, NextResponse } from 'next/server'

const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize'
const MAX_CHARS = 4500

function splitIntoChunks(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text]

  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let current = ''

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > MAX_CHARS) {
      if (current) chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_TTS_API_KEY não configurada' }, { status: 500 })
  }

  const { text, voice } = await req.json() as { text: string; voice: string }
  if (!text?.trim()) return NextResponse.json({ error: 'Texto vazio' }, { status: 400 })

  const chunks = splitIntoChunks(text.trim())
  const audioParts: Buffer[] = []

  for (const chunk of chunks) {
    const res = await fetch(`${TTS_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: chunk },
        voice: { languageCode: 'pt-BR', name: voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 0 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Google TTS error: ${err}` }, { status: 502 })
    }

    const data = await res.json() as { audioContent: string }
    audioParts.push(Buffer.from(data.audioContent, 'base64'))
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
