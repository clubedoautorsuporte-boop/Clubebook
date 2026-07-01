'use client'

import { usePathname } from 'next/navigation'
import { PublicationPipeline } from './publication-pipeline'

export function PipelineSidebar() {
  const pathname = usePathname()

  // Extrai o slug da URL /dashboard/biblioteca/[slug]/...
  const match = pathname.match(/\/dashboard\/biblioteca\/([a-f0-9]{32})/)
  const slug = match?.[1]

  if (!slug) return null

  return (
    <div style={{
      position: 'fixed',
      top: 64,
      right: 0,
      bottom: 0,
      width: 230,
      overflowY: 'auto',
      padding: '20px 12px 20px 8px',
      zIndex: 20,
      borderLeft: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(8,14,36,0.6)',
      backdropFilter: 'blur(8px)',
    }}>
      <PublicationPipeline slug={slug} />
    </div>
  )
}
