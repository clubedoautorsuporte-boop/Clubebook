'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import { CheckoutModal } from '@/components/dashboard/checkout-modal'

type Props = {
  popular: boolean
  credits: number
  price: number
  userEmail: string
  userName: string
}

export function ComprarButton({ popular, credits, price, userEmail, userName }: Props) {
  const [open, setOpen] = useState(false)

  const id = credits === 20000 ? '20k' : credits === 50000 ? '50k' : '100k'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:-translate-y-0.5',
          popular
            ? 'bg-[#00e5c3] text-[#040810] hover:bg-[#00cfb0] shadow-[0_0_20px_rgba(0,229,195,0.3)]'
            : 'border border-[#1c2438] text-white hover:bg-[#0f1523] hover:border-[#4f7fff40]',
        )}
      >
        <Zap className="size-4" />
        Comprar agora
      </button>

      {open && (
        <CheckoutModal
          pacote={{ id, credits, price, popular }}
          userEmail={userEmail}
          userName={userName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
