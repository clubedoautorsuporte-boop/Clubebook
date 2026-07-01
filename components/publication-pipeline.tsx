'use client'

import Link from 'next/link'
import {
  FileText, Palette, ImageIcon, Globe, BookMarked, FileCheck,
  Megaphone, Rocket, Headphones, ShoppingCart, Languages,
  CheckCircle2, Sparkles,
} from 'lucide-react'

const PIPELINE = [
  { icon: FileText,     label: 'Livro Escrito',       status: 'aqui',    href: null },
  { icon: Palette,      label: 'Capa do Livro',        status: 'a-fazer', href: 'capa' },
  { icon: ImageIcon,    label: 'Ilustrar Livro',       status: 'a-fazer', href: null },
  { icon: Globe,        label: 'Preparar Publicação',  status: 'a-fazer', href: null },
  { icon: BookMarked,   label: 'Registro de ISBN',     status: 'a-fazer', href: null },
  { icon: FileCheck,    label: 'Ficha Catalográfica',  status: 'a-fazer', href: null },
  { icon: Megaphone,    label: 'Kit de Marketing',     status: 'a-fazer', href: null },
  { icon: Rocket,       label: 'Plano de Lançamento',  status: 'a-fazer', href: null },
  { icon: Headphones,   label: 'Audiobook',            status: 'a-fazer', href: null },
  { icon: ShoppingCart, label: 'Vender',               status: 'a-fazer', href: null },
  { icon: Languages,    label: 'Tradução',             status: 'a-fazer', href: null },
]

const total = PIPELINE.length
const done = PIPELINE.filter(p => p.status === 'feito').length

export function PublicationPipeline({ slug }: { slug: string }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(done / total) * 100}%`,
              background: 'linear-gradient(90deg,#4f7fff,#a855f7)',
              borderRadius: '999px',
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
          const linkHref = step.href ? `/dashboard/biblioteca/${slug}/${step.href}` : undefined

          const content = (
            <>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFeito ? 'rgba(0,229,195,0.1)' : isAqui ? 'rgba(79,127,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: isAqui ? '1px solid rgba(79,127,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}>
                <Icon style={{
                  width: '13px', height: '13px',
                  color: isFeito ? '#00e5c3' : isAqui ? '#4f7fff' : '#3a4a60',
                }} strokeWidth={2} />
              </div>

              <span style={{
                flex: 1, fontSize: '12px',
                fontWeight: isAqui ? 700 : linkHref ? 600 : 500,
                color: isFeito ? '#00e5c3' : isAqui ? '#fff' : linkHref ? '#a0b0c8' : '#5a6a84',
              }}>
                {step.label}
              </span>

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
                  letterSpacing: '0.06em', color: linkHref ? '#5a6a84' : '#3a4a60', flexShrink: 0,
                }}>
                  A FAZER
                </span>
              )}
            </>
          )

          const rowStyle: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 16px', textDecoration: 'none',
            background: isAqui ? 'rgba(79,127,255,0.07)' : 'transparent',
            borderLeft: isAqui ? '2px solid #4f7fff' : '2px solid transparent',
            transition: 'background 0.15s',
            cursor: linkHref ? 'pointer' : 'default',
          }

          if (linkHref) {
            return (
              <Link key={i} href={linkHref} style={rowStyle}
                className="hover:bg-white/5">
                {content}
              </Link>
            )
          }

          return (
            <div key={i} style={rowStyle}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
