'use client'

import React, { useRef } from 'react'
import {
  FileText, Palette, ImageIcon, Globe, Megaphone, Rocket,
  Headphones, ShoppingCart, Languages, BookMarked, FileCheck,
  ArrowRight, Clock, CheckCircle2, Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServicoStatus } from '@/lib/servicos-data'

const ICON_MAP: Record<string, LucideIcon> = {
  FileText, Palette, ImageIcon, Globe, Megaphone, Rocket,
  Headphones, ShoppingCart, Languages, BookMarked, FileCheck,
}

export interface HolographicCardProps {
  iconName: string
  label: string
  desc: string
  color: string
  badge: string
  badgeBg: string
  badgeColor: string
  status: ServicoStatus
  statusLabel: string
  btnLabel: string
  btnHref?: string
  className?: string
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'fazendo') return <CheckCircle2 className="size-3" style={{ color: '#00e5c3' }} />
  if (status === 'em-breve') return <Clock className="size-3" style={{ color: '#a855f7' }} />
  return <Sparkles className="size-3" style={{ color: '#4f7fff' }} />
}

const HolographicCard = ({
  iconName, label, desc, color, badge, badgeBg, badgeColor,
  status, statusLabel, btnLabel, btnHref = '#', className,
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = ICON_MAP[iconName] ?? FileText

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    card.style.setProperty('--x', `${x}px`)
    card.style.setProperty('--y', `${y}px`)
    card.style.setProperty('--bg-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--bg-y', `${(y / rect.height) * 100}%`)
    card.style.transform = `perspective(900px) rotateX(${(y - cy) / 14}deg) rotateY(${(cx - x) / 14}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    card.style.setProperty('--x', '50%')
    card.style.setProperty('--y', '50%')
    card.style.setProperty('--bg-x', '50%')
    card.style.setProperty('--bg-y', '50%')
  }

  const isBreve = status === 'em-breve'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(className)}
      style={{
        '--x': '50%', '--y': '50%', '--bg-x': '50%', '--bg-y': '50%',
        transition: 'transform 0.15s ease',
        willChange: 'transform',
        position: 'relative',
        borderRadius: '18px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0d1220',
        border: `1px solid ${color}28`,
        overflow: 'hidden',
      } as React.CSSProperties}
    >
      {/* Spotlight seguindo o cursor */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(circle at var(--bg-x) var(--bg-y), ${color}14 0%, transparent 65%)`,
      }} />

      {/* Borda gradiente superior */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}90, transparent)`,
        zIndex: 2,
      }} />

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 3, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>

        {/* Topo: ícone + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
            background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1px solid ${color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px ${color}20`,
          }}>
            <Icon style={{ color, width: '24px', height: '24px' }} strokeWidth={1.75} />
          </div>

          <span style={{
            fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '999px',
            background: badgeBg, color: badgeColor, flexShrink: 0, marginTop: '2px',
          }}>
            {badge}
          </span>
        </div>

        {/* Título + descrição */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '6px', letterSpacing: '-0.01em' }}>
            {label}
          </p>
          <p style={{ fontSize: '12px', color: '#5a6a84', lineHeight: 1.5 }}>{desc}</p>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusIcon status={status} />
          <span style={{ fontSize: '11px', color: status === 'fazendo' ? '#00e5c3' : status === 'em-breve' ? '#a855f7' : '#5a6a84' }}>
            {statusLabel}
          </span>
        </div>

        {/* Botão */}
        <a
          href={btnHref}
          onClick={isBreve ? (e) => e.preventDefault() : undefined}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            borderRadius: '12px', padding: '10px 14px',
            fontSize: '12px', fontWeight: 700, color: isBreve ? '#3a4a60' : '#fff',
            background: isBreve
              ? 'rgba(255,255,255,0.04)'
              : `linear-gradient(135deg, ${color}dd, ${color})`,
            border: isBreve ? '1px solid rgba(255,255,255,0.07)' : 'none',
            boxShadow: isBreve ? 'none' : `0 4px 16px ${color}35`,
            cursor: isBreve ? 'not-allowed' : 'pointer',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
        >
          {btnLabel}
          {!isBreve && <ArrowRight style={{ width: '14px', height: '14px' }} />}
        </a>
      </div>
    </div>
  )
}

export default HolographicCard
