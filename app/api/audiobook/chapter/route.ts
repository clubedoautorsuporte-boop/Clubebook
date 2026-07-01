import { NextRequest, NextResponse } from 'next/server'

const MAX_CHARS = 2500

const VOICES: Record<string, string> = {
  'rachel':  '21m00Tcm4TlvDq8ikWAM',
  'bella':   'EXAVITQu4vr4xnSDxMaL',
  'domi':    'AZnzlk1XvdvUeBnXmlld',
  'adam':    'pNInz6obpgDQGcFmaJgB',
  'josh':    'TxGEqnHWrfWFTfGW9XjX',
  'arnold':  'VR6AewLTigWG4xSOukaG',
}

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
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ELEVENLABS_API_KEY não configurada' }, { status: 500 })
  }

  const { text, voice } = await req.json() as { text: string; voice: string }
  if (!text?.trim()) return NextResponse.json({ error: 'Texto vazio' }, { status: 400 })

  const voiceId = VOICES[voice] ?? VOICES['rachel']
  const chunks = splitIntoChunks(text.trim())
  const audioParts: Buffer[] = []

  for (const chunk of chunks) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: chunk,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 502 })
    }

    const buf = Buffer.from(await res.arrayBuffer())
    audioParts.push(buf)
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
