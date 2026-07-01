'use client'

import { useEffect, useState } from 'react'
import type { BriefingPlan } from '@/lib/generate-pdf'

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color }}>{label}</p>
      {children}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="px-6 py-5 space-y-2 animate-pulse">
      <div className="h-2 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="h-3 w-4/5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="h-3 w-3/5 rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
    </div>
  )
}

export function EditorialPlan({ plan, slug }: { plan: BriefingPlan; slug: string }) {
  const needsEnrich = !plan.premissa || !plan.publico_alvo || !plan.tom_estilo || !plan.sinopse
  const [enriched, setEnriched] = useState<BriefingPlan>(plan)
  const [loading, setLoading] = useState(needsEnrich)

  useEffect(() => {
    if (!needsEnrich) return
    fetch('/api/enrich-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.plan) setEnriched(data.plan) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug, needsEnrich])

  const p = enriched

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(79,127,255,0.04)' }}>
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#00e5c3' }} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#00e5c3' }}>
          Seu planejamento editorial · pronto
        </p>
        {loading && (
          <div className="ml-auto flex items-center gap-1.5 text-[10px]" style={{ color: '#5a6a84' }}>
            <div className="size-2.5 animate-spin rounded-full border border-[#5a6a84] border-t-transparent" />
            Gerando...
          </div>
        )}
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>

        {/* Premissa */}
        {loading && !p.premissa
          ? <Skeleton />
          : p.premissa && (
            <Section label="Premissa" color="#4f7fff">
              <p className="text-[13px] leading-relaxed" style={{ color: '#8a9ab8' }}>{p.premissa}</p>
            </Section>
          )}

        {/* Público-alvo + Tom em grid */}
        {(p.publico_alvo || p.tom_estilo || loading) && (
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {loading && !p.publico_alvo
              ? <Skeleton />
              : p.publico_alvo && (
                <Section label="Público-alvo" color="#a855f7">
                  <p className="text-[12px] leading-relaxed" style={{ color: '#8a9ab8' }}>{p.publico_alvo}</p>
                </Section>
              )}
            {loading && !p.tom_estilo
              ? <Skeleton />
              : p.tom_estilo && (
                <Section label="Tom & Estilo" color="#f97316">
                  <p className="text-[12px] leading-relaxed" style={{ color: '#8a9ab8' }}>{p.tom_estilo}</p>
                </Section>
              )}
          </div>
        )}

        {/* Temas Centrais */}
        {loading && !p.temas_centrais?.length
          ? <Skeleton />
          : p.temas_centrais && p.temas_centrais.length > 0 && (
            <Section label="Temas Centrais" color="#00e5c3">
              <div className="flex flex-wrap gap-2">
                {p.temas_centrais.map((tema, i) => (
                  <span key={i}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(79,127,255,0.1)', color: '#8aa6ff', border: '1px solid rgba(79,127,255,0.2)' }}>
                    {tema}
                  </span>
                ))}
              </div>
            </Section>
          )}

        {/* Sinopse */}
        {loading && !p.sinopse
          ? <Skeleton />
          : p.sinopse && (
            <Section label="Sinopse" color="#4f7fff">
              <p className="text-[12px] leading-relaxed whitespace-pre-line" style={{ color: '#8a9ab8' }}>{p.sinopse}</p>
            </Section>
          )}
      </div>
    </div>
  )
}
