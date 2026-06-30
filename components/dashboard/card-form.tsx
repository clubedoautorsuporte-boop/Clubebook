'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react'

type CardFormProps = {
  price: number
  pacoteId: string
  userEmail: string
  onSuccess: () => void
  onBack: () => void
}

type MPCardData = {
  token: string
  installments: number
  paymentMethodId: string
  issuerId: string
  identificationType: string
  identificationNumber: string
}

export function CardForm({ price, pacoteId, userEmail, onSuccess, onBack }: CardFormProps) {
  const brickRef = useRef<{ unmount: () => void } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

  useEffect(() => {
    if (!publicKey) {
      setStatus('error')
      setErrorMsg('Chave pública do Mercado Pago não configurada (NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY).')
      return
    }

    let destroyed = false

    async function init() {
      const { default: MercadoPago } = await import('@mercadopago/sdk-react/pure')
      if (destroyed) return

      MercadoPago.init({ publicKey, locale: 'pt-BR' })

      const bricks = MercadoPago.bricks()
      const controller = await bricks.create('cardPayment', 'mp-card-brick', {
        initialization: {
          amount: price,
          payer: { email: userEmail },
        },
        customization: {
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                baseColor: '#00e5c3',
                borderRadiusFull: '12px',
                borderRadiusLarge: '12px',
                borderRadiusMedium: '10px',
                formBackgroundColor: '#0d1117',
                inputBackgroundColor: '#0d1117',
                inputBorderColor: '#ffffff12',
                inputFontColor: '#ffffff',
                inputPlaceholderColor: '#3a4a66',
                labelFontColor: '#8896b0',
              },
            },
            texts: { formTitle: '' },
            hideFormTitle: true,
            hidePaymentButton: true,
          },
          paymentMethods: { maxInstallments: 12 },
        },
        callbacks: {
          onReady: () => setStatus('ready'),
          onError: (err: unknown) => {
            console.error('[MP Brick]', err)
            setStatus('error')
            setErrorMsg('Erro ao carregar formulário. Tente novamente.')
          },
          onSubmit: async (data: MPCardData) => {
            setStatus('submitting')
            setErrorMsg('')
            try {
              const res = await fetch('/api/mercadopago/criar-pagamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, pacoteId, email: userEmail }),
              })
              const result = await res.json() as { status: string; error?: string; detail?: string }
              if (result.status === 'approved') {
                onSuccess()
              } else if (result.status === 'pending') {
                setErrorMsg('Pagamento em análise. Você receberá uma confirmação por e-mail.')
                setStatus('ready')
              } else {
                setErrorMsg(result.detail === 'cc_rejected_insufficient_amount'
                  ? 'Cartão sem limite suficiente.'
                  : result.detail === 'cc_rejected_bad_filled_security_code'
                  ? 'Código de segurança incorreto.'
                  : result.error ?? 'Pagamento recusado. Verifique os dados e tente novamente.')
                setStatus('ready')
              }
            } catch {
              setErrorMsg('Erro de conexão. Tente novamente.')
              setStatus('ready')
            }
          },
        },
      })

      brickRef.current = controller
    }

    init()

    return () => {
      destroyed = true
      brickRef.current?.unmount()
    }
  }, [publicKey, price, userEmail, pacoteId, onSuccess])

  const handlePagar = () => {
    if (brickRef.current && 'submit' in brickRef.current) {
      (brickRef.current as { submit: () => void }).submit()
    }
  }

  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] bg-[#0d1117] px-5 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] text-[#6b7a99] transition hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Voltar
        </button>
        <div className="flex items-center gap-1 text-[#6b7a99]">
          <ShieldCheck className="size-3" />
          <span className="text-[10px] font-semibold">Pagamento seguro</span>
        </div>
      </div>

      {/* Brick container */}
      <div className="px-5 py-4">
        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-10 text-[#6b7a99]">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Carregando formulário…</span>
          </div>
        )}

        {status === 'error' && !errorMsg.includes('configurada') && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-xs text-red-400 text-center">
            {errorMsg}
          </p>
        )}

        {status === 'error' && errorMsg.includes('configurada') && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/08 px-4 py-4 text-center">
            <p className="text-sm font-semibold text-yellow-400 mb-1">Mercado Pago não configurado</p>
            <p className="text-xs text-[#6b7a99]">Adicione <code className="text-yellow-400">NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY</code> e <code className="text-yellow-400">MERCADOPAGO_ACCESS_TOKEN</code> nas variáveis de ambiente do Vercel.</p>
          </div>
        )}

        <div
          ref={containerRef}
          id="mp-card-brick"
          className={status === 'loading' ? 'hidden' : ''}
        />

        {errorMsg && status === 'ready' && (
          <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Botão pagar */}
      {(status === 'ready' || status === 'submitting') && (
        <div className="px-5 pb-5 flex flex-col gap-3">
          <button
            onClick={handlePagar}
            disabled={status === 'submitting'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-3.5 text-sm font-bold text-[#040810] transition hover:bg-[#00cfb0] disabled:opacity-60"
          >
            {status === 'submitting'
              ? <><Loader2 className="size-4 animate-spin" /> Processando…</>
              : <><ShieldCheck className="size-4" /> Pagar R$ {priceFormatted}</>
            }
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#3a4a66]">
            <ShieldCheck className="size-3" />
            <span>Criptografia SSL</span>
            <span>•</span>
            <span>Processado por Mercado Pago</span>
          </div>
        </div>
      )}
    </div>
  )
}
