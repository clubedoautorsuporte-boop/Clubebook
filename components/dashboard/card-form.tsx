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

const INPUT =
  'h-[46px] w-full rounded-xl border border-[#ffffff10] bg-[#111827] px-3 text-sm text-white placeholder-[#8896b0] outline-none transition focus:border-[#00e5c340] focus:ring-1 focus:ring-[#00e5c315]'

const LABEL = 'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#a0b0c8]'

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtCard(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}
function fmtExpiry(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}
function fmtCvv(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 4)
}
function fmtCpf(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function addFormatter(id: string, fn: (v: string) => string) {
  const el = document.getElementById(id) as HTMLInputElement | null
  if (!el) return () => {}
  const handler = (e: Event) => {
    const t = e.target as HTMLInputElement
    const start = t.selectionStart ?? t.value.length
    const prev = t.value
    const next = fn(t.value)
    if (prev !== next) {
      t.value = next
      // Adjust caret: keep it at same relative digit position
      const diff = next.length - prev.length
      t.setSelectionRange(Math.max(0, start + diff), Math.max(0, start + diff))
    }
  }
  el.addEventListener('input', handler)
  return () => el.removeEventListener('input', handler)
}

// ─────────────────────────────────────────────────────────────────────────────

export function CardForm({ price, pacoteId, pacoteNome, userEmail, onSuccess, onBack, onClose }: CardFormProps) {
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  // ── MP SDK init ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!publicKey) return

    function boot() {
      if (!window.MercadoPago) { setErrorMsg('Não foi possível carregar o formulário.'); return }

      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
      mp.cardForm({
        amount: String(price),
        iframe: false,
        form: {
          id: 'mp-card-form',
          cardNumber:         { id: 'mp-card-number',      placeholder: '1234 1234 1234 1234' },
          expirationDate:     { id: 'mp-expiration-date',  placeholder: 'MM/AA' },
          securityCode:       { id: 'mp-security-code',    placeholder: 'CVC' },
          cardholderName:     { id: 'mp-cardholder-name',  placeholder: 'Nome como está no cartão' },
          issuer:             { id: 'mp-issuer' },
          installments:       { id: 'mp-installments' },
          identificationType: { id: 'mp-id-type' },
          identificationNumber: { id: 'mp-id-number',     placeholder: '000.000.000-00' },
        },
        callbacks: {
          onFormMounted: (err: unknown) => {
            if (err) { console.warn('[MP] mount:', err); return }
            setLoaded(true)
          },
          onSubmit: async (e: Event) => {
            e.preventDefault()
            // MP attaches getCardFormData on the form element
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const form = document.getElementById('mp-card-form') as any
            const data: CardFormData = form?.cardFormData ?? {
              token: '', paymentMethodId: '', issuerId: '', installments: '1',
            }
            await processPayment(data)
          },
          onFetching: () => {},
        },
      })
    }

    if (window.MercadoPago) { boot(); return }
    const s = document.createElement('script')
    s.src = 'https://sdk.mercadopago.com/js/v2'
    s.async = true
    s.onload = boot
    s.onerror = () => setErrorMsg('Erro ao carregar formulário. Verifique sua conexão.')
    document.head.appendChild(s)
    return () => { if (document.head.contains(s)) document.head.removeChild(s) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, price])

  // ── Input masks — adicionadas após MP montar ───────────────────────────────
  useEffect(() => {
    if (!loaded) return
    const cleanups = [
      addFormatter('mp-card-number',     fmtCard),
      addFormatter('mp-expiration-date', fmtExpiry),
      addFormatter('mp-security-code',   fmtCvv),
      addFormatter('mp-id-number',       fmtCpf),
    ]
    return () => cleanups.forEach(fn => fn())
  }, [loaded])

  // ── Payment ────────────────────────────────────────────────────────────────
  async function processPayment(data: CardFormData) {
    if (!data.token) {
      setErrorMsg('Preencha todos os campos do cartão antes de continuar.')
      return
    }
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
              ? { type: data.identificationType, number: (data.identificationNumber ?? '').replace(/\D/g, '') }
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
          d === 'cc_rejected_insufficient_amount'        ? 'Cartão sem limite suficiente.' :
          d === 'cc_rejected_bad_filled_security_code'   ? 'Código de segurança incorreto.' :
          d === 'cc_rejected_bad_filled_date'            ? 'Data de validade incorreta.' :
          d === 'cc_rejected_bad_filled_card_number'     ? 'Número de cartão inválido.' :
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
    document.getElementById('mp-submit-btn')?.click()
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <CreditCard className="size-4 text-white" />
          </div>
          <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white">{pacoteNome}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#a0b0c8]">
            <Lock className="size-3" /> SEGURO
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-lg text-[#a0b0c8] transition hover:bg-white/10 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 pb-3 pt-4">
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1c2438] bg-[#111827] py-2.5 text-[13px] font-bold text-white">
          <CreditCard className="size-4" /> Cartão
        </button>
        <button type="button" disabled className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d1117] py-2.5 text-[13px] font-medium text-[#8896b0]">
          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white text-[9px] font-black leading-none text-[#333]">G</span>
          Google Pay
        </button>
      </div>

      {/* Loading */}
      {!loaded && !errorMsg && (
        <div className="flex items-center justify-center gap-2 py-10 text-[#a0b0c8]">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Carregando formulário…</span>
        </div>
      )}

      {/* Form */}
      <form
        id="mp-card-form"
        onSubmit={e => e.preventDefault()}
        style={{ display: loaded ? 'flex' : 'none', flexDirection: 'column', gap: '1rem', padding: '0 1.25rem' }}
      >
        {/* Card number */}
        <div>
          <label htmlFor="mp-card-number" className={LABEL}>Número do cartão</label>
          <input
            id="mp-card-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            maxLength={19}
            className={INPUT}
          />
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="mp-expiration-date" className={LABEL}>Data de validade</label>
            <input
              id="mp-expiration-date"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              maxLength={5}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="mp-security-code" className={LABEL}>Código de segurança</label>
            <div className="relative">
              <input
                id="mp-security-code"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                maxLength={4}
                className={INPUT + ' pr-9'}
              />
              <Lock className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#8896b0]" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="mp-cardholder-name" className={LABEL}>Nome no cartão</label>
          <input
            id="mp-cardholder-name"
            type="text"
            autoComplete="cc-name"
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            className={INPUT}
            style={{ textTransform: 'uppercase' }}
            onInput={e => { (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase() }}
          />
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="mp-id-number" className={LABEL}>CPF do titular</label>
          <input
            id="mp-id-number"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            maxLength={14}
            className={INPUT}
          />
        </div>

        {/* Hidden MP fields */}
        <select id="mp-issuer"      name="issuer"              style={{ display: 'none' }} />
        <select id="mp-installments" name="installments"       style={{ display: 'none' }} />
        <select id="mp-id-type"     name="identificationType"  style={{ display: 'none' }} />
        <input  id="mp-submit-btn"  type="submit"              style={{ display: 'none' }} />

        {errorMsg && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </form>

      {/* Footer */}
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
              : <><ShieldCheck className="size-4" /> Pagar R$ {priceFormatted}</>}
          </button>
        )}

        {errorMsg && !loaded && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">{errorMsg}</p>
        )}

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#8896b0]">
          <Lock className="size-3" />
          <span>Criptografia SSL</span>
          <span>•</span>
          <span>Processado por Mercado Pago</span>
        </div>

        <button type="button" onClick={onBack} className="flex items-center justify-center gap-1.5 text-[11px] text-[#a0b0c8] transition hover:text-white">
          <ChevronLeft className="size-3.5" />
          Alterar forma de pagamento
        </button>
      </div>

    </div>
  )
}
