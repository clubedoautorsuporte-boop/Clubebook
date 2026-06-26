'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

type Props = { popular: boolean; credits: number; price: number }

export function ComprarButton({ popular, credits, price }: Props) {
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    setClicked(true)
    const text = encodeURIComponent(
      `Olá! Tenho interesse em comprar o pacote de ${credits.toLocaleString('pt-BR')} créditos por R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Como prosseguir?`
    )
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank')
    setTimeout(() => setClicked(false), 3000)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition',
        popular
          ? 'bg-[#00e5c3] text-[#040810] hover:bg-[#00cfb0]'
          : 'border border-[#1c2438] text-white hover:bg-[#0f1523]',
      )}
    >
      {clicked ? (
        <><MessageCircle className="size-4" /> Abrindo WhatsApp…</>
      ) : (
        'Comprar'
      )}
    </button>
  )
}
