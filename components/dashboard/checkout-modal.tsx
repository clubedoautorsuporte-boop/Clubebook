'use client'

import { useState, useEffect, useRef } from 'react'
import {
  X, Sparkles, QrCode, Copy, Check, Loader2,
  ShieldCheck, Zap, ChevronRight, RefreshCw,
} from 'lucide-react'
import Image from 'next/image'

type Pacote = {
  id: '20k' | '50k' | '100k'
  credits: number
  price: number
  popular: boolean
}

type Step = 'form' | 'pix' | 'success'

type Props = {
  pacote: Pacote
  userEmail: string
  userName: string
  onClose: () => void
}

function formatCPF(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function CheckoutModal({ pacote, userEmail, userName, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [nome, setNome] = useState(userName ?? '')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // PIX state
  const [qrCode, setQrCode] = useState('')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 min
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown timer
  useEffect(() => {
    if (step !== 'pix') return
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [step])

  // Poll status
  useEffect(() => {
    if (step !== 'pix' || !txHash) return
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/pepper/status?hash=${txHash}`)
      const data = await res.json() as { status: string }
      if (data.status === 'paid') {
        clearInterval(pollRef.current!)
        setStep('success')
      }
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, txHash])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (cpf.replace(/\D/g, '').length < 11) { setError('CPF inválido'); return }
    if (telefone.replace(/\D/g, '').length < 10) { setError('Telefone inválido'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/pepper/criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacote: pacote.id, nome, email: userEmail, cpf, telefone }),
      })
      const data = await res.json() as { qr_code?: string; hash?: string; error?: string }
      if (!res.ok || !data.qr_code) throw new Error(data.error ?? 'Erro ao gerar PIX')
      setQrCode(data.qr_code)
      setTxHash(data.hash ?? '')
      setStep('pix')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#1c2438] bg-[#080b14] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

        {/* Glow top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff60] to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-[#4f7fff08] blur-3xl" />

        {/* Header */}
        <div className="relative flex items-start justify-between border-b border-[#1c2438] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#4f7fff] to-[#00e5c3]">
                <Sparkles className="size-5 text-white" />
              </div>
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-[#080b14] bg-[#00e5c3]" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#4f7fff]">Clube do Autor IA</p>
              <p className="text-base font-extrabold text-white">
                {pacote.credits.toLocaleString('pt-BR')} Créditos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-xl text-[#6b7a99] transition hover:bg-[#0f1523] hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        {/* Preço em destaque */}
        {step !== 'success' && (
          <div className="flex flex-col items-center gap-1 border-b border-[#1c2438] bg-[#4f7fff06] py-5">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-[#6b7a99]">R$</span>
              <span className="text-4xl font-black tracking-tight text-white">
                {Math.floor(pacote.price).toLocaleString('pt-BR')}
              </span>
              <span className="text-xl font-bold text-[#6b7a99]">
                ,{String(Math.round((pacote.price % 1) * 100)).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#00e5c318] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00e5c3]">
                Pagamento único · Sem renovação
              </span>
            </div>
          </div>
        )}

        {/* ── STEP: Formulário ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Nome completo</label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Seu nome"
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff50] focus:ring-1 focus:ring-[#4f7fff30]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Email</label>
              <input
                value={userEmail}
                disabled
                className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-3 text-sm text-[#3a4a66] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">CPF</label>
                <input
                  value={cpf}
                  onChange={e => setCpf(formatCPF(e.target.value))}
                  required
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff50] focus:ring-1 focus:ring-[#4f7fff30]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Telefone</label>
                <input
                  value={telefone}
                  onChange={e => setTelefone(formatPhone(e.target.value))}
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder-[#3a4a66] outline-none transition focus:border-[#4f7fff50] focus:ring-1 focus:ring-[#4f7fff30]"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            {/* Método PIX */}
            <div className="rounded-2xl border border-[#4f7fff30] bg-[#4f7fff08] px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#4f7fff18]">
                    <QrCode className="size-5 text-[#4f7fff]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">PIX</p>
                    <p className="text-[11px] text-[#6b7a99]">Aprovação imediata · QR Code</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#00e5c320] px-2.5 py-0.5 text-[10px] font-bold text-[#00e5c3]">Instantâneo</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.35)] transition hover:shadow-[0_0_32px_rgba(79,127,255,0.5)] disabled:opacity-60"
            >
              {loading
                ? <><Loader2 className="size-4 animate-spin" /> Gerando PIX…</>
                : <><Zap className="size-4" /> Gerar QR Code PIX <ChevronRight className="size-4" /></>}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#3a4a66]">
              <ShieldCheck className="size-3" />
              Pagamento processado com segurança pela Pepper
            </div>
          </form>
        )}

        {/* ── STEP: PIX QR Code ── */}
        {step === 'pix' && (
          <div className="px-6 py-5">
            {/* Timer */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#00e5c3]" />
                <span className="text-xs font-semibold text-[#6b7a99]">Aguardando pagamento</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-[#1c2438] px-2.5 py-1">
                <span className="font-mono text-sm font-bold text-white">{mins}:{secs}</span>
              </div>
            </div>

            {/* QR Code gerado via API de QR image */}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative mb-3 rounded-2xl border-2 border-[#4f7fff30] bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(qrCode)}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="block rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://quickchart.io/qr?text=${encodeURIComponent(qrCode)}&size=200` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-lg">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg" />
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-[#6b7a99]">
                Abra seu banco → PIX → Ler QR Code
              </p>
            </div>

            {/* Copia e cola */}
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#3a4a66]">Ou use o código Copia e Cola</p>
              <div className="flex gap-2">
                <div className="flex-1 overflow-hidden rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-3 py-2.5">
                  <p className="truncate font-mono text-[11px] text-[#6b7a99]">{qrCode.slice(0, 60)}…</p>
                </div>
                <button
                  onClick={copy}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#4f7fff] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3a6be0]"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Status polling indicator */}
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] py-3">
              <RefreshCw className="size-3.5 animate-spin text-[#4f7fff]" />
              <span className="text-xs text-[#6b7a99]">Verificando pagamento automaticamente…</span>
            </div>
          </div>
        )}

        {/* ── STEP: Sucesso ── */}
        {step === 'success' && (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            {/* Animação de sucesso */}
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#00e5c3] opacity-20" />
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#00e5c3] to-[#4f7fff]">
                <Sparkles className="size-9 text-white" />
              </div>
            </div>

            <p className="mb-1 text-2xl font-extrabold text-white">Créditos adicionados!</p>
            <p className="mb-1 text-4xl font-black text-[#00e5c3]">
              +{pacote.credits.toLocaleString('pt-BR')}
            </p>
            <p className="mb-6 text-sm text-[#6b7a99]">créditos na sua conta</p>

            <p className="mb-6 text-xs leading-relaxed text-[#3a4a66]">
              Seus créditos já estão disponíveis. Use para criar capítulos, reescrever seções, gerar metadados e muito mais com a Aurora IA.
            </p>

            <button
              onClick={() => { onClose(); window.location.reload() }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.4)]"
            >
              <Zap className="size-4" /> Usar créditos agora
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
