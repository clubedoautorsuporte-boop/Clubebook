'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Headphones, Mic, Play, Pause, Download,
  Loader2, ChevronDown, ChevronUp, Volume2, AlertCircle,
} from 'lucide-react'

const VOICES = [
  { id: 'rachel', label: 'Rachel', tipo: 'Feminina',  qualidade: 'Multilingual', cor: '#a855f7' },
  { id: 'bella',  label: 'Bella',  tipo: 'Feminina',  qualidade: 'Multilingual', cor: '#ec4899' },
  { id: 'domi',   label: 'Domi',   tipo: 'Feminina',  qualidade: 'Multilingual', cor: '#10b981' },
  { id: 'adam',   label: 'Adam',   tipo: 'Masculina', qualidade: 'Multilingual', cor: '#4f7fff' },
  { id: 'josh',   label: 'Josh',   tipo: 'Masculina', qualidade: 'Multilingual', cor: '#f59e0b' },
  { id: 'arnold', label: 'Arnold', tipo: 'Masculina', qualidade: 'Multilingual', cor: '#6a7a96' },
]

type ChapterState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  audioUrl: string | null
  error: string | null
}

type Capitulo = { numero: number; titulo: string; descricao: string; blocos: string[] }

interface Props {
  slug: string
  titulo: string
  nomeAutor: string
  capitulos: Capitulo[]
}

export function AudiobookClient({ slug, titulo, nomeAutor, capitulos }: Props) {
  const [voice, setVoice] = useState('rachel')
  const [chapters, setChapters] = useState<Record<number, ChapterState>>({})
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [expandedVoices, setExpandedVoices] = useState(false)
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({})

  const selectedVoice = VOICES.find(v => v.id === voice)!

  async function generateChapter(index: number) {
    const cap = capitulos[index]
    const text = `Capítulo ${cap.numero}: ${cap.titulo}. ${cap.blocos.join(' ')}`

    setChapters(prev => ({ ...prev, [index]: { status: 'loading', audioUrl: null, error: null } }))

    try {
      const res = await fetch('/api/audiobook/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      })

      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error ?? 'Erro ao gerar áudio')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setChapters(prev => ({ ...prev, [index]: { status: 'ready', audioUrl: url, error: null } }))
    } catch (err) {
      setChapters(prev => ({ ...prev, [index]: { status: 'error', audioUrl: null, error: String(err) } }))
    }
  }

  function togglePlay(index: number) {
    const audio = audioRefs.current[index]
    if (!audio) return

    if (playingIndex === index) {
      audio.pause()
      setPlayingIndex(null)
    } else {
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex]!.pause()
      }
      audio.play()
      setPlayingIndex(index)
    }
  }

  function downloadChapter(index: number) {
    const state = chapters[index]
    if (!state?.audioUrl) return
    const a = document.createElement('a')
    a.href = state.audioUrl
    a.download = `cap-${capitulos[index].numero}-${titulo.slice(0, 30).replace(/\s/g, '-')}.mp3`
    a.click()
  }

  const readyCount = Object.values(chapters).filter(c => c.status === 'ready').length

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {readyCount > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, padding: '3px 10px' }}>
                {readyCount} cap. gerado{readyCount > 1 ? 's' : ''}
              </span>
            )}
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#10b981' }}>
              Audiobook
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, flexShrink: 0,
            background: 'linear-gradient(135deg,#065f46,#10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
          }}>
            <Headphones style={{ width: 32, height: 32, color: '#fff' }} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#10b981', margin: '0 0 4px' }}>
              Audiobook
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>
              {titulo}
            </h1>
            <p style={{ fontSize: 13, color: '#5a6a84', margin: 0 }}>por {nomeAutor} · {capitulos.length} capítulos</p>
          </div>
        </div>

        {/* Seletor de voz */}
        <div style={{ borderRadius: 16, padding: '20px', marginBottom: 28, background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expandedVoices ? 16 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Volume2 style={{ width: 15, height: 15, color: selectedVoice.cor }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 1px' }}>
                  {selectedVoice.label}
                  <span style={{ fontSize: 10, color: selectedVoice.cor, marginLeft: 8, fontWeight: 700, background: `${selectedVoice.cor}18`, borderRadius: 999, padding: '1px 7px', border: `1px solid ${selectedVoice.cor}30` }}>
                    {selectedVoice.qualidade}
                  </span>
                </p>
                <p style={{ fontSize: 11, color: '#5a6a84', margin: 0 }}>{selectedVoice.tipo} · Português Brasileiro</p>
              </div>
            </div>
            <button
              onClick={() => setExpandedVoices(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#4f7fff', background: 'rgba(79,127,255,0.08)', border: '1px solid rgba(79,127,255,0.2)', borderRadius: 999, padding: '5px 12px', cursor: 'pointer' }}>
              Trocar {expandedVoices ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
            </button>
          </div>

          {expandedVoices && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {VOICES.map(v => {
                const sel = voice === v.id
                return (
                  <button
                    key={v.id}
                    onClick={() => { setVoice(v.id); setExpandedVoices(false) }}
                    style={{
                      borderRadius: 10, padding: '10px 12px', textAlign: 'left' as const, cursor: 'pointer',
                      background: sel ? `${v.cor}12` : 'rgba(255,255,255,0.03)',
                      border: sel ? `1.5px solid ${v.cor}50` : '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.12s',
                    }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: sel ? '#fff' : '#8a9ab8', margin: '0 0 2px' }}>{v.label}</p>
                    <p style={{ fontSize: 10, color: sel ? v.cor : '#4a5a70', margin: '0 0 4px' }}>{v.tipo}</p>
                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: v.cor, background: `${v.cor}15`, borderRadius: 999, padding: '1px 6px' }}>
                      {v.qualidade}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Mic style={{ width: 13, height: 13, color: '#5a6a84' }} />
          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5a6a84', margin: 0 }}>
            Capítulos — clique em gerar para ouvir
          </p>
        </div>

        {/* Lista de capítulos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {capitulos.map((cap, i) => {
            const state = chapters[i]
            const isLoading = state?.status === 'loading'
            const isReady = state?.status === 'ready'
            const isError = state?.status === 'error'
            const isPlaying = playingIndex === i

            return (
              <div key={i} style={{
                borderRadius: 14, border: isReady ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                background: isReady ? 'rgba(16,185,129,0.04)' : '#0a101e',
                padding: '16px 18px',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Número */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isReady ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    border: isReady ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    fontSize: 12, fontWeight: 900, color: isReady ? '#10b981' : '#5a6a84',
                  }}>
                    {cap.numero}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isReady ? '#e0e8f0' : '#8a9ab8', margin: '0 0 3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {cap.titulo}
                    </p>
                    <p style={{ fontSize: 11, color: '#3a4a60', margin: 0 }}>
                      ~{Math.ceil(cap.blocos.join(' ').length / 800)} min de áudio
                    </p>
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {isReady && (
                      <button
                        onClick={() => downloadChapter(i)}
                        title="Baixar MP3"
                        style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                        <Download style={{ width: 13, height: 13, color: '#5a6a84' }} />
                      </button>
                    )}

                    {isReady ? (
                      <button
                        onClick={() => togglePlay(i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#fff',
                          background: isPlaying ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg,#065f46,#10b981)',
                          border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
                        }}>
                        {isPlaying ? <Pause style={{ width: 13, height: 13 }} /> : <Play style={{ width: 13, height: 13 }} />}
                        {isPlaying ? 'Pausar' : 'Ouvir'}
                      </button>
                    ) : (
                      <button
                        onClick={() => !isLoading && generateChapter(i)}
                        disabled={isLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#fff',
                          background: isLoading ? 'rgba(255,255,255,0.06)' : 'rgba(79,127,255,0.15)',
                          border: isLoading ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(79,127,255,0.3)',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.8 : 1,
                        }}>
                        {isLoading
                          ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Gerando...</>
                          : <><Mic style={{ width: 13, height: 13 }} /> Gerar</>
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Erro */}
                {isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle style={{ width: 13, height: 13, color: '#ef4444', flexShrink: 0 }} />
                    <p style={{ fontSize: 11, color: '#ef4444', margin: 0 }}>{state.error}</p>
                  </div>
                )}

                {/* Player de áudio oculto */}
                {isReady && state.audioUrl && (
                  <audio
                    ref={el => { audioRefs.current[i] = el }}
                    src={state.audioUrl}
                    onEnded={() => setPlayingIndex(null)}
                    style={{ display: 'none' }}
                  />
                )}

                {/* Progresso do áudio quando tocando */}
                {isPlaying && (
                  <div style={{ marginTop: 12 }}>
                    <audio
                      controls
                      src={state.audioUrl!}
                      autoPlay
                      style={{ width: '100%', height: 36, outline: 'none' }}
                      onEnded={() => setPlayingIndex(null)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 28, padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
          {[
            { label: 'Powered by', value: 'ElevenLabs AI' },
            { label: 'Qualidade', value: '24kHz · MP3' },
            { label: 'Idioma', value: 'Português Brasileiro' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 10, color: '#3a4a60', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6a7a96', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
