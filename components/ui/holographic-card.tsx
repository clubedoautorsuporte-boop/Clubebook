'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

interface HolographicCardProps {
  icon: string
  label: string
  desc: string
  color: string
  badge: string
  badgeBg: string
  badgeColor: string
  className?: string
}

const HolographicCard = ({
  icon, label, desc, color, badge, badgeBg, badgeColor, className,
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = (y - cy) / 12
    const rotateY = (cx - x) / 12
    card.style.setProperty('--x', `${x}px`)
    card.style.setProperty('--y', `${y}px`)
    card.style.setProperty('--bg-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--bg-y', `${(y / rect.height) * 100}%`)
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    card.style.setProperty('--x', '50%')
    card.style.setProperty('--y', '50%')
    card.style.setProperty('--bg-x', '50%')
    card.style.setProperty('--bg-y', '50%')
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('holo-service-card', className)}
      style={{
        '--card-color': color,
        '--x': '50%',
        '--y': '50%',
        '--bg-x': '50%',
        '--bg-y': '50%',
        transition: 'transform 0.15s ease',
        willChange: 'transform',
        position: 'relative',
        borderRadius: '16px',
        padding: '18px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: '#0d1220',
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      } as React.CSSProperties}
    >
      {/* Holographic shimmer layer */}
      <div
        className="holo-shimmer"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease',
          background: `
            radial-gradient(circle at var(--bg-x) var(--bg-y),
              ${color}22 0%,
              transparent 60%
            )
          `,
          zIndex: 1,
        }}
      />

      {/* Glow spotlight */}
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          left: 'var(--x)',
          top: 'var(--y)',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'left 0.05s, top 0.05s',
        }}
      />

      {/* Gradient border on hover via pseudo-element simulation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          padding: '1px',
          background: `linear-gradient(135deg, ${color}40, transparent 60%, #a855f740)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '22px', color, lineHeight: 1, filter: `drop-shadow(0 0 6px ${color}80)` }}>
          {icon}
        </span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '2px 8px',
            borderRadius: '999px',
            background: badgeBg,
            color: badgeColor,
          }}
        >
          {badge}
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 3 }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '11px', color: '#5a6a84', lineHeight: 1.45 }}>{desc}</p>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
          zIndex: 3,
        }}
      />
    </div>
  )
}

export default HolographicCard
