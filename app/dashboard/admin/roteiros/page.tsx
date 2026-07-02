'use client'

import { useState } from 'react'

export default function AdminRoteirosPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<{ processados: number; pendentes: number; resultados: { slug: string; status: string; erro?: string }[] } | null>(null)

  async function checarStatus() {
    const res = await fetch('/api/admin/generate-roteiros')
    const d = await res.json()
    setStatus(`Total: ${d.total} | Com roteiro: ${d.comRoteiro} | Sem roteiro: ${d.semRoteiro}`)
  }

  async function processarLote(batchSize: number) {
    setLoading(true)
    setResultado(null)
    try {
      const res = await fetch('/api/admin/generate-roteiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize }),
      })
      const d = await res.json()
      setResultado(d)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 24px', color: '#fff', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Gerar Roteiros em Lote</h1>
      <p style={{ color: '#aaa', marginBottom: 32, fontSize: 14 }}>
        Gera e salva o roteiro DeepSeek para todos os livros que ainda não têm roteiro no banco.
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={checarStatus} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
          Verificar status
        </button>
        <button onClick={() => processarLote(5)} disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Processando...' : 'Processar 5'}
        </button>
        <button onClick={() => processarLote(20)} disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#8b5cf6', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Processando...' : 'Processar 20'}
        </button>
        <button onClick={() => processarLote(100)} disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#a855f7', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Processando...' : 'Processar 100'}
        </button>
      </div>

      {status && (
        <div style={{ background: '#0d1220', border: '1px solid #1c2438', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#a0b0c8' }}>
          {status}
        </div>
      )}

      {resultado && (
        <div style={{ background: '#0d1220', border: '1px solid #1c2438', borderRadius: 10, padding: '18px', fontSize: 13 }}>
          <p style={{ color: '#10b981', fontWeight: 700, marginBottom: 12 }}>
            Processados: {resultado.processados} | Pendentes restantes: {resultado.pendentes}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {resultado.resultados.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ color: r.status === 'ok' ? '#10b981' : '#ef4444', fontWeight: 700, minWidth: 36 }}>
                  {r.status === 'ok' ? '✓' : '✗'}
                </span>
                <span style={{ color: '#6a7a96', fontFamily: 'monospace', fontSize: 12 }}>{r.slug}</span>
                {r.erro && <span style={{ color: '#ef4444', fontSize: 11 }}>{r.erro}</span>}
              </div>
            ))}
          </div>

          {resultado.pendentes > 0 && (
            <button onClick={() => processarLote(20)} disabled={loading} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              Continuar próximo lote
            </button>
          )}
        </div>
      )}
    </div>
  )
}
