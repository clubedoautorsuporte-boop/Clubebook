'use client'

import { useState, useCallback } from 'react'
import { ShieldCheck, Loader2, CreditCard } from 'lucide-react'

type CardFormProps = {
  price: number
  pacoteId: string
  onSuccess: () => void
  onBack: () => void
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

function detectCard(num: string): 'visa' | 'mastercard' | null {
  const d = num.replace(/\s/g, '')
  if (/^4/.test(d)) return 'visa'
  if (/^5[1-5]/.test(d) || /^2(2[2-9]|[3-6]\d|7[01])/.test(d)) return 'mastercard'
  return null
}

const COUNTRIES = [
  'Brasil', 'Argentina', 'Chile', 'Colômbia', 'México',
  'Portugal', 'Espanha', 'Estados Unidos', 'Outro',
]

export function CardForm({ price, onSuccess, onBack }: CardFormProps) {
  const [tab, setTab] = useState<'card' | 'gpay'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [country, setCountry] = useState('Brasil')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardType = detectCard(cardNumber)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length < 16) { setError('Número do cartão inválido'); return }
    if (expiry.length < 5) { setError('Data de validade inválida'); return }
    if (cvc.length < 3) { setError('Código de segurança inválido'); return }

    setLoading(true)
    // Stub: integrar com Stripe Elements aqui quando STRIPE_SECRET_KEY estiver configurada
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    onSuccess()
  }, [cardNumber, expiry, cvc, onSuccess])

  const priceFormatted = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  return (
    <div className="flex flex-col">
      {/* Header PREMIUM */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] bg-[#111827] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#f59e0b]">
            <span className="text-[9px] font-black text-white">P</span>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-white uppercase">Premium</span>
        </div>
        <div className="flex items-center gap-1 text-[#6b7a99]">
          <ShieldCheck className="size-3" />
          <span className="text-[10px] font-semibold">Seguro</span>
        </div>
      </div>

      {/* Tabs: Cartão | Google Pay */}
      <div className="grid grid-cols-2 gap-2 border-b border-[#ffffff10] bg-[#0d1117] px-4 py-3">
        <button
          onClick={() => setTab('card')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'card'
              ? 'bg-[#1c2438] text-white shadow'
              : 'text-[#6b7a99] hover:text-white'
          }`}
        >
          <CreditCard className="size-4" />
          Cartão
        </button>
        <button
          onClick={() => setTab('gpay')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'gpay'
              ? 'bg-[#1c2438] text-white shadow'
              : 'text-[#6b7a99] hover:text-white'
          }`}
        >
          {/* Google Pay logo inline SVG */}
          <svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="11" fontSize="10" fontFamily="Arial" fontWeight="bold">
              <tspan fill="#4285F4">G</tspan>
              <tspan fill="#EA4335">o</tspan>
              <tspan fill="#FBBC04">o</tspan>
              <tspan fill="#4285F4">g</tspan>
              <tspan fill="#34A853">l</tspan>
              <tspan fill="#EA4335">e</tspan>
            </text>
            <text x="21" y="11" fontSize="10" fontFamily="Arial" fontWeight="bold" fill="white"> Pay</text>
          </svg>
        </button>
      </div>

      {tab === 'gpay' ? (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
          <p className="text-sm text-[#6b7a99]">Redirecionar para Google Pay</p>
          <button
            onClick={() => {}}
            className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black transition hover:bg-gray-100"
          >
            Pagar com Google Pay
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          {/* Número do cartão */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">
              Número do Cartão
            </label>
            <div className="relative">
              <input
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 1234 1234 1234"
                inputMode="numeric"
                className="w-full rounded-xl border border-[#ffffff12] bg-[#0d1117] px-4 py-3 pr-20 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff60] focus:ring-1 focus:ring-[#4f7fff30]"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                {/* Visa */}
                <svg width="32" height="20" viewBox="0 0 32 20" className={cardType === 'mastercard' ? 'opacity-30' : 'opacity-100'} xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="20" rx="3" fill="#1A1F71"/>
                  <text x="4" y="14" fontSize="8" fontFamily="Arial" fontWeight="bold" fill="white">VISA</text>
                </svg>
                {/* Mastercard */}
                <svg width="28" height="20" viewBox="0 0 28 20" className={cardType === 'visa' ? 'opacity-30' : 'opacity-100'} xmlns="http://www.w3.org/2000/svg">
                  <rect width="28" height="20" rx="3" fill="#252525"/>
                  <circle cx="11" cy="10" r="6" fill="#EB001B"/>
                  <circle cx="17" cy="10" r="6" fill="#F79E1B"/>
                  <path d="M14 5.5a6 6 0 0 1 0 9 6 6 0 0 1 0-9z" fill="#FF5F00"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Validade + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">
                Data de Validade
              </label>
              <input
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / AA"
                inputMode="numeric"
                className="w-full rounded-xl border border-[#ffffff12] bg-[#0d1117] px-4 py-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff60] focus:ring-1 focus:ring-[#4f7fff30]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">
                Código de Segurança
              </label>
              <div className="relative">
                <input
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="CVC"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-[#ffffff12] bg-[#0d1117] px-4 py-3 pr-10 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff60] focus:ring-1 focus:ring-[#4f7fff30]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="22" height="16" rx="2" stroke="#3a4a66" strokeWidth="1.5"/>
                    <rect x="1" y="5" width="22" height="3" fill="#3a4a66"/>
                    <rect x="14" y="10" width="6" height="3" rx="1" fill="#3a4a66"/>
                    <text x="15" y="13.5" fontSize="4" fill="#8896b0" fontFamily="monospace">123</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* País */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">
              País
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#ffffff12] bg-[#0d1117] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4f7fff60] focus:ring-1 focus:ring-[#4f7fff30]"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a99]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          {/* Botão pagar */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-3.5 text-sm font-bold text-[#040810] transition hover:bg-[#00cfb0] disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="size-4 animate-spin" /> Processando…</>
            ) : (
              <><ShieldCheck className="size-4" /> Pagar R$ {priceFormatted}</>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-[#3a4a66]">
            <ShieldCheck className="size-3" />
            <span>Criptografia SSL</span>
            <span>•</span>
            <span>Processado por Stripe</span>
          </div>
        </form>
      )}

      {/* Alterar forma de pagamento */}
      <button
        onClick={onBack}
        className="pb-4 text-center text-[11px] text-[#6b7a99] underline underline-offset-2 transition hover:text-white"
      >
        Alterar forma de pagamento
      </button>
    </div>
  )
}
