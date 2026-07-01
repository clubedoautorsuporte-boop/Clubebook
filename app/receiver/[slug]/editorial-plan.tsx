import type { BriefingPlan } from '@/lib/generate-pdf'

export function EditorialPlan({ plan }: { plan: BriefingPlan }) {
  if (!plan.premissa && !plan.publico_alvo && !plan.tom_estilo && !plan.sinopse) return null

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
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>

        {/* Premissa */}
        {plan.premissa && (
          <div className="px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#4f7fff' }}>Premissa</p>
            <p className="text-[13px] leading-relaxed" style={{ color: '#8a9ab8' }}>{plan.premissa}</p>
          </div>
        )}

        {/* Público-alvo + Tom em grid */}
        {(plan.publico_alvo || plan.tom_estilo) && (
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {plan.publico_alvo && (
              <div className="px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#a855f7' }}>Público-alvo</p>
                <p className="text-[12px] leading-relaxed" style={{ color: '#8a9ab8' }}>{plan.publico_alvo}</p>
              </div>
            )}
            {plan.tom_estilo && (
              <div className="px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#f97316' }}>Tom & Estilo</p>
                <p className="text-[12px] leading-relaxed" style={{ color: '#8a9ab8' }}>{plan.tom_estilo}</p>
              </div>
            )}
          </div>
        )}

        {/* Temas Centrais */}
        {plan.temas_centrais && plan.temas_centrais.length > 0 && (
          <div className="px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: '#00e5c3' }}>Temas Centrais</p>
            <div className="flex flex-wrap gap-2">
              {plan.temas_centrais.map((tema, i) => (
                <span key={i}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(79,127,255,0.1)', color: '#8aa6ff', border: '1px solid rgba(79,127,255,0.2)' }}>
                  {tema}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sinopse */}
        {plan.sinopse && (
          <div className="px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#4f7fff' }}>Sinopse</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#8a9ab8' }}>{plan.sinopse}</p>
          </div>
        )}
      </div>
    </div>
  )
}
