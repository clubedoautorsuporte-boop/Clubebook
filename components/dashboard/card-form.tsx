'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, X, CreditCard, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react'

type CardFormProps = {
  price: number
  pacoteId: string
  pacoteNome: string
  userEmail: string
  onSuccess: () => void
  onBack: () => void
  onClose: () => void
}

type CardFormData = {
  token: string
  paymentMethodId: string
  issuerId: string
  installments: string
  identificationType?: string
  identificationNumber?: string
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MercadoPago?: new (publicKey: string, options?: object) => any
  }
}

export function CardForm({ price, pacoteId, pacoteNome, userEmail, onSuccess, onBack, onClose }: CardFormProps) {
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardFormRef = useRef<any>(null)

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  useEffect(() => {
    if (!publicKey) return

    function initCardForm() {
      if (!window.MercadoPago) {
        setErrorMsg('Não foi possível carregar o formulário de pagamento.')
        return
      }
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })

      const cardForm = mp.cardForm({
        amount: String(price),
        iframe: true,
        form: {
          id: 'mp-card-form',
          cardNumber: {
            id: 'mp-card-number',
            placeholder: '1234 1234 1234 1234',
          },
          expirationDate: {
            id: 'mp-expiration-date',
            placeholder: 'MM / AA',
          },
          securityCode: {
            id: 'mp-security-code',
            placeholder: 'CVC',
          },
          cardholderName: {
            id: 'mp-cardholder-name',
            placeholder: 'Nome no cartão',
          },
          issuer: { id: 'mp-issuer', label: 'Emissor' },
          installments: { id: 'mp-installments', label: 'Parcelas' },
          identificationType: { id: 'mp-id-type', label: 'Tipo de documento' },
          identificationNumber: { id: 'mp-id-number', placeholder: '000.000.000-00' },
        },
        callbacks: {
          onFormMounted: (err: unknown) => {
            if (err) console.warn('[MP cardForm] mount error:', err)
            else setLoaded(true)
          },
          onSubmit: async (event: Event) => {
            event.preventDefault()
            const data = cardForm.getCardFormData() as CardFormData
            await processPayment(data)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onFetching: (resource: any) => {
            console.log('[MP cardForm] fetching:', resource)
          },
        },
      })

      cardFormRef.current = cardForm
    }

    if (window.MercadoPago) {
      initCardForm()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = initCardForm
    script.onerror = () => setErrorMsg('Erro ao carregar o formulário de pagamento. Verifique sua conexão.')
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
      cardFormRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, price])

  async function processPayment(data: CardFormData) {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/mercadopago/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          payment_method_id: data.paymentMethodId,
          issuer_id: data.issuerId,
          installments: Number(data.installments) || 1,
          payer: {
            email: userEmail,
            identification: data.identificationType ? {
              type: data.identificationType,
              number: data.identificationNumber ?? '',
            } : undefined,
          },
          pacoteId,
          email: userEmail,
        }),
      })
      const result = await res.json() as { status: string; error?: string; detail?: string }
      if (result.status === 'approved') {
        onSuccess()
      } else if (result.status === 'pending') {
        setErrorMsg('Pagamento em análise. Você receberá confirmação por e-mail.')
      } else {
        const d = result.detail ?? ''
        setErrorMsg(
          d === 'cc_rejected_insufficient_amount' ? 'Cartão sem limite suficiente.' :
          d === 'cc_rejected_bad_filled_security_code' ? 'Código de segurança incorreto.' :
          result.error ?? 'Pagamento recusado. Verifique os dados e tente novamente.'
        )
      }
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function handlePay() {
    // Trigger the hidden submit button inside the mp-card-form
    const btn = document.getElementById('mp-submit-btn')
    btn?.click()
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] px-5 py-4">
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
      <div className="flex gap-2 px-5 pb-3 pt-4">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1c2438] bg-[#111827] py-2.5 text-[13px] font-bold text-white">
          <CreditCard className="size-4" />
          Cartão
        </button>
        <button
          disabled
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d1117] py-2.5 text-[13px] font-medium text-[#3a4a66]"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white text-[9px] font-black leading-none text-[#333]">G</span>
          Google Pay
        </button>
      </div>

      {/* ── Loading ── */}
      {!loaded && !errorMsg && (
        <div className="flex items-center justify-center gap-2 py-10 text-[#6b7a99]">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Carregando formulário…</span>
        </div>
      )}

      {/* ── MP Card Form (hidden — only used for iframes) ── */}
      <form id="mp-card-form" style={{ display: loaded ? 'none' : 'none' }}>
        <input type="submit" id="mp-submit-btn" style={{ display: 'none' }} />
        <select id="mp-issuer" style={{ display: 'none' }} />
        <select id="mp-installments" style={{ display: 'none' }} />
        <select id="mp-id-type" style={{ display: 'none' }} />
      </form>

      {/* ── Custom styled fields (MP mounts iframes into these divs) ── */}
      <div className="px-5" style={{ display: loaded ? 'block' : 'none' }}>
        <div className="flex flex-col gap-4">

          {/* Card Number */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
              Número do cartão
            </label>
            <div
              id="mp-card-number"
              className="flex h-[46px] w-full items-center overflow-hidden rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-white"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
                Data de validade
              </label>
              <div
                id="mp-expiration-date"
                className="flex h-[46px] w-full items-center overflow-hidden rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
                Código de segurança
              </label>
              <div className="relative">
                <div
                  id="mp-security-code"
                  className="flex h-[46px] w-full items-center overflow-hidden rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-white"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-[#3a4a66]" />
              </div>
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
              Nome no cartão
            </label>
            <input
              id="mp-cardholder-name"
              name="cardholderName"
              placeholder="NOME COMO ESTÁ NO CARTÃO"
              className="h-[46px] w-full rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-sm uppercase text-white placeholder-[#3a4a66] outline-none transition focus:border-[#00e5c330]"
            />
          </div>

          {/* ID number (CPF) — MP needs this in Brazil */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
              CPF do titular
            </label>
            <input
              id="mp-id-number"
              name="identificationNumber"
              placeholder="000.000.000-00"
              className="h-[46px] w-full rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#00e5c330]"
            />
          </div>

          {/* País */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">
              País
            </label>
            <div className="relative">
              <select className="h-[46px] w-full appearance-none rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-sm text-white outline-none">
                <option value="BR">Brasil</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a99]">▾</span>
            </div>
          </div>

        </div>

        {errorMsg && (
          <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        {loaded && (
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
