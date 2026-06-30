'use client'

import { useState, useEffect } from 'react'
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

const INPUT_CLASS =
  'h-[46px] w-full rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#00e5c330] focus:ring-1 focus:ring-[#00e5c315]'

const LABEL_CLASS = 'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]'

export function CardForm({ price, pacoteId, pacoteNome, userEmail, onSuccess, onBack, onClose }: CardFormProps) {
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  useEffect(() => {
    if (!publicKey) return

    function boot() {
      if (!window.MercadoPago) {
        setErrorMsg('Não foi possível carregar o formulário de pagamento.')
        return
      }

      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })

      mp.cardForm({
        amount: String(price),
        iframe: false, // inputs reais — o usuário digita diretamente
        form: {
          id: 'mp-card-form',
          cardNumber: { id: 'mp-card-number', placeholder: '1234 1234 1234 1234' },
          expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/AA' },
          securityCode: { id: 'mp-security-code', placeholder: 'CVC' },
          cardholderName: { id: 'mp-cardholder-name', placeholder: 'Nome como está no cartão' },
          issuer: { id: 'mp-issuer' },
          installments: { id: 'mp-installments' },
          identificationType: { id: 'mp-id-type' },
          identificationNumber: { id: 'mp-id-number', placeholder: '000.000.000-00' },
        },
        callbacks: {
          onFormMounted: (err: unknown) => {
            if (err) { console.warn('[MP] mount error:', err); return }
            setLoaded(true)
          },
          onSubmit: async (event: Event) => {
            event.preventDefault()
            const form = document.getElementById('mp-card-form') as HTMLFormElement | null
            if (!form) return
            // @ts-expect-error — cardFormData is attached by MP SDK
            const data = (form as unknown as { cardFormData: CardFormData }).cardFormData
              ?? getCardFormData(form)
            await processPayment(data)
          },
          onFetching: () => {},
        },
      })
    }

    function getCardFormData(form: HTMLFormElement): CardFormData {
      const get = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? ''
      return {
        token: get('mp-token'),
        paymentMethodId: get('mp-payment-method-id'),
        issuerId: get('mp-issuer'),
        installments: get('mp-installments'),
        identificationType: get('mp-id-type'),
        identificationNumber: get('mp-id-number'),
      }
    }

    if (window.MercadoPago) { boot(); return }

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = boot
    script.onerror = () => setErrorMsg('Erro ao carregar formulário. Verifique sua conexão e recarregue.')
    document.head.appendChild(script)
    return () => { if (document.head.contains(script)) document.head.removeChild(script) }
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
            identification: data.identificationType
              ? { type: data.identificationType, number: data.identificationNumber ?? '' }
              : undefined,
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
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-lg text-[#6b7a99] transition hover:bg-white/10 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 px-5 pb-3 pt-4">
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1c2438] bg-[#111827] py-2.5 text-[13px] font-bold text-white">
          <CreditCard className="size-4" />
          Cartão
        </button>
        <button type="button" disabled className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d1117] py-2.5 text-[13px] font-medium text-[#3a4a66]">
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

      {/* ── Form ── */}
      <form
        id="mp-card-form"
        onSubmit={e => e.preventDefault()}
        className="px-5"
        style={{ display: loaded ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}
      >

        {/* Card number */}
        <div>
          <label htmlFor="mp-card-number" className={LABEL_CLASS}>Número do cartão</label>
          <input id="mp-card-number" type="text" placeholder="1234 1234 1234 1234" className={INPUT_CLASS} />
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="mp-expiration-date" className={LABEL_CLASS}>Data de validade</label>
            <input id="mp-expiration-date" type="text" placeholder="MM/AA" className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="mp-security-code" className={LABEL_CLASS}>Código de segurança</label>
            <div className="relative">
              <input id="mp-security-code" type="text" placeholder="CVC" className={INPUT_CLASS + ' pr-9'} />
              <Lock className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#3a4a66]" />
            </div>
          </div>
        </div>

        {/* Cardholder name */}
        <div>
          <label htmlFor="mp-cardholder-name" className={LABEL_CLASS}>Nome no cartão</label>
          <input
            id="mp-cardholder-name"
            type="text"
            placeholder="Nome como está no cartão"
            className={INPUT_CLASS}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="mp-id-number" className={LABEL_CLASS}>CPF do titular</label>
          <input id="mp-id-number" type="text" placeholder="000.000.000-00" className={INPUT_CLASS} />
        </div>

        {/* País */}
        <div>
          <label className={LABEL_CLASS}>País</label>
          <div className="relative">
            <select className={INPUT_CLASS + ' appearance-none pr-8'} style={{ cursor: 'pointer' }}>
              <option value="BR">Brasil</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a99]">▾</span>
          </div>
        </div>

        {/* Hidden fields MP needs */}
        <select id="mp-issuer" name="issuer" style={{ display: 'none' }} />
        <select id="mp-installments" name="installments" style={{ display: 'none' }} />
        <select id="mp-id-type" name="identificationType" style={{ display: 'none' }} />
        <input id="mp-submit-btn" type="submit" style={{ display: 'none' }} />

        {errorMsg && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </form>

      {/* ── Footer ── */}
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        {loaded && (
          <button
            type="button"
            onClick={handlePay}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-3.5 text-[15px] font-bold text-[#040810] transition hover:bg-[#00cfb0] disabled:opacity-60"
          >
            {submitting
              ? <><Loader2 className="size-4 animate-spin" /> Processando…</>
              : <><ShieldCheck className="size-4" /> Pagar R$ {priceFormatted}</>
            }
          </button>
        )}

        {errorMsg && !loaded && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#3a4a66]">
          <Lock className="size-3" />
          <span>Criptografia SSL</span>
          <span>•</span>
          <span>Processado por Mercado Pago</span>
        </div>

        <button
          type="button"
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
