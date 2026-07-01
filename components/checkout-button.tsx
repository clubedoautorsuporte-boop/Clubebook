'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  slug: string
  title: string
  amount?: number
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({ slug, title, amount = 49.99, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, amount }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert('Erro ao iniciar pagamento. Tente novamente.')
      }
    } catch {
      alert('Erro ao iniciar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '12px',
        padding: '14px 28px',
        fontSize: '14px',
        fontWeight: 700,
        color: '#fff',
        background: loading ? 'rgba(79,127,255,0.5)' : 'linear-gradient(135deg,#4f7fff,#a855f7)',
        boxShadow: loading ? 'none' : '0 6px 24px rgba(79,127,255,0.35)',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s, transform 0.15s',
      }}
    >
      {loading ? (
        <><Loader2 className="size-4 animate-spin" /> Aguarde...</>
      ) : (
        <>{children ?? 'Gerar meu livro completo'} <ArrowRight className="size-4" /></>
      )}
    </button>
  )
}
