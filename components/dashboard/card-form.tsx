'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Loader2, Lock, X, CreditCard, ChevronLeft } from 'lucide-react'

type CardFormProps = {
  price: number
  pacoteId: string
  pacoteNome: string
  userEmail: string
  onSuccess: () => void
  onBack: () => void
  onClose: () => void
}

type MPFormData = {
  token: string
  issuer_id: string
  payment_method_id: string
  transaction_amount: number
  installments: number
  payer: {
    email?: string
    identification?: { type: string; number: string }
  }
}

declare global {
  interface Window {
    cardPaymentBrickController?: {
      submit: () => Promise<void>
      unmount: () => void
    }
  }
}

export function CardForm({ price, pacoteId, pacoteNome, userEmail, onSuccess, onBack, onClose }: CardFormProps) {
  const [brickReady, setBrickReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [MPReady, setMPReady] = useState(false)

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

  useEffect(() => {
    if (!publicKey) return
    import('@mercadopago/sdk-react').then(({ initMercadoPago }) => {
      initMercadoPago(publicKey, { locale: 'pt-BR' })
      setMPReady(true)
    })
  }, [publicKey])

  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  async function handlePay() {
    if (!window.cardPaymentBrickController) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      await window.cardPaymentBrickController.submit()
    } catch {
      setSubmitting(false)
    }
  }

  async function onSubmit(data: MPFormData) {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/mercadopago/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          issuer_id: data.issuer_id,
          payment_method_id: data.payment_method_id,
          transaction_amount: data.transaction_amount,
          installments: data.installments,
          payer: data.payer,
          pacoteId,
          email: userEmail,
        }),
      })
      const result = await res.json() as { status: string; error?: string; detail?: string }
      if (result.status === 'approved') {
        onSuccess()
      } else if (result.status === 'pending') {
        setErrorMsg('Pagamento em análise. Você receberá uma confirmação por e-mail.')
      } else {
        const detail = result.detail ?? ''
        setErrorMsg(
          detail === 'cc_rejected_insufficient_amount' ? 'Cartão sem limite suficiente.' :
          detail === 'cc_rejected_bad_filled_security_code' ? 'Código de segurança incorreto.' :
          result.error ?? 'Pagamento recusado. Verifique os dados e tente novamente.'
        )
      }
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#ffffff10]">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <CreditCard className="size-4 text-white" />
          </div>
          <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white">
            {pacoteNome}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
            <Lock className="size-3" />
            SEGURO
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#6b7a99] transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 px-5 pt-4 pb-3">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1c2438] bg-[#111827] py-2.5 text-[13px] font-bold text-white transition">
          <CreditCard className="size-4" />
          Cartão
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d1117] py-2.5 text-[13px] font-medium text-[#3a4a66] transition hover:text-[#6b7a99]"
          disabled
          title="Em breve"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white text-[9px] font-black text-[#333] leading-none">G</span>
          Google Pay
        </button>
      </div>

      {/* ── Brick MP ── */}
      <div className="px-5">
        {!MPReady && (
          <div className="flex items-center justify-center gap-2 py-10 text-[#6b7a99]">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Carregando formulário…</span>
          </div>
        )}
        {MPReady && (
          <MPCardBrick
            price={price}
            userEmail={userEmail}
            onReady={() => setBrickReady(true)}
            onSubmit={onSubmit}
          />
        )}
        {errorMsg && (
          <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </div>

      {/* ── Pay button + footer ── */}
      <div className="flex flex-col gap-3 px-5 pt-3 pb-5">
        {brickReady && (
          <button
            onClick={handlePay}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-3.5 text-[15px] font-bold text-[#040810] transition hover:bg-[#00cfb0] disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="size-4 animate-spin" /> Processando…</>
            ) : (
              <><ShieldCheck className="size-4" /> Pagar R$ {priceFormatted}</>
            )}
          </button>
        )}

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#3a4a66]">
          <Lock className="size-3" />
          <span>Criptografia SSL</span>
          <span>•</span>
          <span>Processado por Mercado Pago</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-[11px] text-[#6b7a99] transition hover:text-white"
        >
          <ChevronLeft className="size-3.5" />
          Alterar forma de pagamento
        </button>
      </div>
    </div>
  )
}

function MPCardBrick({ price, userEmail, onReady, onSubmit }: {
  price: number
  userEmail: string
  onReady: () => void
  onSubmit: (data: MPFormData) => Promise<void>
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CardPayment, setCardPayment] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    import('@mercadopago/sdk-react').then(mod => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCardPayment(() => mod.CardPayment as React.ComponentType<any>)
    })
  }, [])

  if (!CardPayment) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-[#6b7a99]">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-xs">Inicializando…</span>
      </div>
    )
  }

  return (
    <CardPayment
      initialization={{ amount: price, payer: { email: userEmail } }}
      customization={{
        visual: {
          style: {
            theme: 'dark',
            customVariables: {
              baseColor: '#00e5c3',
              borderRadiusFull: '12px',
              borderRadiusMedium: '10px',
              formBackgroundColor: '#080b14',
              inputBackgroundColor: '#111827',
              inputBorderColor: 'rgba(255,255,255,0.08)',
              inputFontColor: '#ffffff',
              inputPlaceholderColor: '#3a4a66',
              labelFontColor: '#8896b0',
            },
          },
          hideFormTitle: true,
          hidePaymentButton: true,
        },
        paymentMethods: { maxInstallments: 12 },
      }}
      onReady={onReady}
      onSubmit={onSubmit}
      onError={(err: unknown) => console.error('[MP CardPayment]', err)}
    />
  )
}
