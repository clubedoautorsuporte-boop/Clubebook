'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText, Palette, ImageIcon, Globe, BookMarked, FileCheck,
  Megaphone, Rocket, Headphones, ShoppingCart, Languages,
  CheckCircle2, Sparkles, Lock,
} from 'lucide-react'

// href: ''    → página base do livro  (/dashboard/biblioteca/[slug])
// href: 'xyz' → sub-página pronta     (/dashboard/biblioteca/[slug]/xyz)
// href: null  → ainda não tem página (desabilitado)
const PIPELINE = [
  { icon: FileText,     label: 'Livro Escrito',      status: 'feito',   href: ''     },
  { icon: Palette,      label: 'Capa do Livro',       status: 'a-fazer', href: 'capa' },
  { icon: ImageIcon,    label: 'Ilustrar Livro',      status: 'a-fazer', href: 'ilustrar' },
  { icon: Globe,        label: 'Preparar Publicação', status: 'a-fazer', href: 'publicacao' },
  { icon: BookMarked,   label: 'Registro de ISBN',    status: 'a-fazer', href: 'isbn' },
  { icon: FileCheck,    label: 'Ficha Catalográfica', status: 'a-fazer', href: null   },
  { icon: Megaphone,    label: 'Kit de Marketing',    status: 'a-fazer', href: 'marketing' },
  { icon: Rocket,       label: 'Plano de Lançamento', status: 'a-fazer', href: null   },
  { icon: Headphones,   label: 'Audiobook',           status: 'a-fazer', href: null   },
  { icon: ShoppingCart, label: 'Vender',              status: 'a-fazer', href: null   },
  { icon: Languages,    label: 'Tradução',            status: 'a-fazer', href: null   },
]

const total = PIPELINE.length
const done = PIPELINE.filter(p => p.status === 'feito').length

export function PublicationPipeline({ slug }: { slug: string }) {
  const pathname = usePathname()
  const base = `/dashboard/biblioteca/${slug}`

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
          const isFeito = step.status === 'feito'

          // Calcula a URL destino
          const fullHref = step.href === null
            ? null
            : step.href === ''
              ? base
              : `${base}/${step.href}`

          // Ativo = URL atual bate exatamente com a URL desta etapa
          const isActive = fullHref !== null && pathname === fullHref

          const hasPage = fullHref !== null

          const content = (
            <>
              {/* Ícone */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFeito
                  ? 'rgba(0,229,195,0.12)'
                  : isActive
                    ? 'rgba(79,127,255,0.18)'
                    : hasPage
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.02)',
                border: isActive
                  ? '1px solid rgba(79,127,255,0.35)'
                  : isFeito
                    ? '1px solid rgba(0,229,195,0.2)'
                    : '1px solid rgba(255,255,255,0.06)',
              }}>
                {!hasPage && !isFeito
                  ? <Lock style={{ width: '11px', height: '11px', color: '#2a3a50' }} strokeWidth={2} />
                  : <Icon style={{
                      width: '13px', height: '13px',
                      color: isFeito ? '#00e5c3' : isActive ? '#4f7fff' : hasPage ? '#6a7a96' : '#2a3a50',
                    }} strokeWidth={2} />
                }
              </div>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: '12px',
                fontWeight: isActive ? 700 : isFeito ? 600 : 500,
                color: isFeito
                  ? '#00e5c3'
                  : isActive
                    ? '#fff'
                    : hasPage
                      ? '#8a9ab8'
                      : '#3a4a60',
              }}>
                {step.label}
              </span>

              {/* Badge direita */}
              {isFeito && (
                <CheckCircle2 style={{ width: '13px', height: '13px', color: '#00e5c3', flexShrink: 0 }} />
              )}
              {!isFeito && isActive && (
                <span style={{
                  fontSize: '8px', fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.08em', padding: '2px 7px', borderRadius: '999px',
                  background: 'rgba(79,127,255,0.2)', color: '#4f7fff', flexShrink: 0,
                }}>
                  AQUI
                </span>
              )}
              {!isFeito && !isActive && hasPage && (
                <span style={{
                  fontSize: '8px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: '#4a5a70', flexShrink: 0,
                }}>
                  A FAZER
                </span>
              )}
              {!hasPage && (
                <span style={{
                  fontSize: '8px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: '#2a3a50', flexShrink: 0,
                }}>
                  EM BREVE
                </span>
              )}
            </>
          )

          const rowStyle: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 16px', textDecoration: 'none',
            background: isActive ? 'rgba(79,127,255,0.07)' : 'transparent',
            borderLeft: isActive ? '2px solid #4f7fff' : '2px solid transparent',
            transition: 'background 0.15s',
            cursor: hasPage && !isActive ? 'pointer' : isActive ? 'default' : 'not-allowed',
          }

          if (hasPage && !isActive) {
            return (
              <Link key={i} href={fullHref!} style={rowStyle} className="hover:bg-white/[0.03]">
                {content}
              </Link>
            )
          }

          return <div key={i} style={rowStyle}>{content}</div>
        })}
      </div>
    </div>
  )
}
