'use client'

import {
  FileText, Palette, ImageIcon, Globe, BookMarked, FileCheck,
  Megaphone, Rocket, Headphones, ShoppingCart, Languages,
  CheckCircle2, Circle, Sparkles, ChevronRight,
} from 'lucide-react'

const PIPELINE = [
  { icon: FileText,   label: 'Livro Escrito',        status: 'aqui'    },
  { icon: Palette,    label: 'Capa do Livro',         status: 'a-fazer' },
  { icon: ImageIcon,  label: 'Ilustrar Livro',        status: 'a-fazer' },
  { icon: Globe,      label: 'Preparar Publicação',   status: 'a-fazer' },
  { icon: BookMarked, label: 'Registro de ISBN',      status: 'a-fazer' },
  { icon: FileCheck,  label: 'Ficha Catalográfica',   status: 'a-fazer' },
  { icon: Megaphone,  label: 'Kit de Marketing',      status: 'a-fazer' },
  { icon: Rocket,     label: 'Plano de Lançamento',   status: 'a-fazer' },
  { icon: Headphones, label: 'Audiobook',             status: 'a-fazer' },
  { icon: ShoppingCart, label: 'Vender',              status: 'a-fazer' },
  { icon: Languages,  label: 'Tradução',              status: 'a-fazer' },
]

const total = PIPELINE.length
const done = PIPELINE.filter(p => p.status === 'feito').length

export function PublicationPipeline() {
  return (
    <div style={{
      background: '#0d1220',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(79,127,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles style={{ width: '13px', height: '13px', color: '#4f7fff' }} />
          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4f7fff' }}>
            Pipeline de Publicação
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(done / total) * 100}%`,
              background: 'linear-gradient(90deg,#4f7fff,#a855f7)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ fontSize: '10px', color: '#5a6a84', whiteSpace: 'nowrap' }}>
            {done} de {total} concluídos
          </span>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: '8px 0' }}>
        {PIPELINE.map((step, i) => {
          const Icon = step.icon
          const isAqui = step.status === 'aqui'
          const isFeito = step.status === 'feito'

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                background: isAqui ? 'rgba(79,127,255,0.07)' : 'transparent',
                borderLeft: isAqui ? '2px solid #4f7fff' : '2px solid transparent',
                transition: 'background 0.15s',
                cursor: 'default',
              }}
            >
              {/* Icon */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFeito
                  ? 'rgba(0,229,195,0.1)'
                  : isAqui
                    ? 'rgba(79,127,255,0.15)'
                    : 'rgba(255,255,255,0.04)',
                border: isAqui ? '1px solid rgba(79,127,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}>
                <Icon style={{
                  width: '13px', height: '13px',
                  color: isFeito ? '#00e5c3' : isAqui ? '#4f7fff' : '#3a4a60',
                }} strokeWidth={2} />
              </div>

              {/* Label */}
              <span style={{
                flex: 1,
                fontSize: '12px',
                fontWeight: isAqui ? 700 : 500,
                color: isFeito ? '#00e5c3' : isAqui ? '#fff' : '#5a6a84',
              }}>
                {step.label}
              </span>

              {/* Badge */}
              {isFeito && <CheckCircle2 style={{ width: '13px', height: '13px', color: '#00e5c3', flexShrink: 0 }} />}
              {isAqui && (
                <span style={{
                  fontSize: '8px', fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.08em', padding: '2px 7px', borderRadius: '999px',
                  background: 'rgba(79,127,255,0.2)', color: '#4f7fff', flexShrink: 0,
                }}>
                  AQUI
                </span>
              )}
              {!isFeito && !isAqui && (
                <span style={{
                  fontSize: '8px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: '#3a4a60', flexShrink: 0,
                }}>
                  A FAZER
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
