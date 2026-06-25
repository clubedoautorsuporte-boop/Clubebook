'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'

type Capitulo = {
  numero: number
  titulo: string
  descricao: string
  blocos?: string[]
}

type Plan = {
  titulo: string
  subtitulo: string
  capitulos: Capitulo[]
  promessa: string
  mensagem_final: string
}

type DeliveryResult = {
  emailSent: boolean
  whatsappSent: boolean
  whatsappError?: string
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

// Step 0 = Formulário | Step 1 = Pagamento | Step 2 = Confirmação
export function CtaModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [aiChooses, setAiChooses] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    tema: '',
    email: '',
    telefone: '',
    _hp: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Plan | null>(null)
  const [delivery, setDelivery] = useState<DeliveryResult | null>(null)
  const formLoadTime = useRef<number>(0)

  useEffect(() => {
    if (open) {
      formLoadTime.current = Date.now()
      setStep(0)
      setAiChooses(false)
      setResult(null)
      setDelivery(null)
      setForm({ nome: '', tema: '', email: '', telefone: '', _hp: '' })
    }
  }, [open])

  if (!open) return null

  const close = () => {
    onClose()
  }

  const canContinue =
    form.email.trim() &&
    form.telefone.trim() &&
    (aiChooses || form.tema.trim())

  const handleContinue = () => {
    if (!canContinue) return
    if (form._hp) return
    if (Date.now() - formLoadTime.current < 3000) return
    setStep(1)
  }

  const submit = async () => {
    if (!form.email || !form.telefone) return
    if (form._hp) return
    setLoading(true)

    const temaFinal =
      aiChooses && !form.tema.trim()
        ? 'Escolha um tema surpreendente, criativo e de grande potencial de vendas para um ebook de sucesso'
        : form.tema

    try {
      const res = await fetch('/api/ebook-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: temaFinal, nome: form.nome }),
      })
      const data = (await res.json()) as Plan
      setResult(data)
      setStep(2)

      fetch('/api/send-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          plan: data,
        }),
      })
        .then((r) => r.json())
        .then((d: DeliveryResult) => setDelivery(d))
        .catch(() => setDelivery({ emailSent: false, whatsappSent: false }))
    } catch {
      const fallback: Plan = {
        titulo: aiChooses ? 'Seu ebook personalizado' : `Ebook sobre ${form.tema}`,
        subtitulo: 'Guia completo',
        capitulos: [
          { numero: 1, titulo: 'Introdução ao tema', descricao: 'Conteúdo profissional desenvolvido pela Aurora IA.' },
          { numero: 2, titulo: 'Desenvolvendo o conteúdo', descricao: 'Estratégias e técnicas avançadas.' },
        ],
        promessa: 'Conteúdo profissional e pronto para vender.',
        mensagem_final: 'Seu ebook está sendo preparado com todo o cuidado pela Aurora IA.',
      }
      setResult(fallback)
      setStep(2)

      fetch('/api/send-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          plan: fallback,
        }),
      })
        .then((r) => r.json())
        .then((d: DeliveryResult) => setDelivery(d))
        .catch(() => setDelivery({ emailSent: false, whatsappSent: false }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-modal-in relative w-full max-w-[540px] overflow-hidden rounded-[28px] border border-line bg-surface p-8 shadow-2xl shadow-black/50 sm:p-10">
        <BorderBeam duration={6} />

        <button
          onClick={close}
          className="absolute right-5 top-5 z-10 flex size-8 items-center justify-center rounded-full bg-ink text-dim transition-colors hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* Step 0: Formulário */}
        {step === 0 && (
          <>
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-[0_0_24px_rgba(79,127,255,0.45)]">
                <BookOpen className="size-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-[22px] font-extrabold text-foreground">
                Criar meu ebook agora
              </h3>
              <p className="mt-2 text-sm text-dim">
                Preencha o briefing. A Aurora cuida do resto.
              </p>
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="_hp"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              value={form._hp}
              onChange={(e) => setForm((p) => ({ ...p, _hp: e.target.value }))}
              className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
            />

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                  Seu nome
                </label>
                <input
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: João Silva"
                  className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-dim focus:border-brand/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                  Tema do ebook{aiChooses ? ' (opcional)' : ' *'}
                </label>
                <input
                  value={form.tema}
                  onChange={(e) => setForm((p) => ({ ...p, tema: e.target.value }))}
                  placeholder={
                    aiChooses
                      ? 'Deixe em branco — a Aurora escolhe para você'
                      : 'Ex: As Aventuras do Gato Listrado, Ebook Infantil'
                  }
                  disabled={aiChooses && !form.tema}
                  className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-dim focus:border-brand/50 disabled:opacity-50"
                />

                {/* Toggle IA escolhe */}
                <button
                  type="button"
                  onClick={() => {
                    setAiChooses((v) => !v)
                    setForm((p) => ({ ...p, tema: '' }))
                  }}
                  className={`mt-2 flex w-full items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                    aiChooses
                      ? 'border-brand/50 bg-brand/10 text-brand-soft'
                      : 'border-line bg-ink text-dim hover:border-brand/30 hover:text-foreground'
                  }`}
                >
                  <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
                  {aiChooses
                    ? '✓ A Aurora vai escolher o tema perfeito para você'
                    : 'Quero que a Aurora IA escolha o tema'}
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                  Seu e-mail *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="joao@email.com"
                  className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-dim focus:border-brand/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, telefone: maskPhone(e.target.value) }))
                  }
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-dim focus:border-brand/50"
                />
              </div>

              <ShimmerButton
                onClick={handleContinue}
                disabled={!canContinue}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.4)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                Continuar
                <ArrowRight className="size-[17px]" aria-hidden="true" />
              </ShimmerButton>
            </div>
          </>
        )}

        {/* Step 1: Pagamento */}
        {step === 1 && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-teal-gradient shadow-[0_0_24px_rgba(0,229,195,0.4)]">
              <Sparkles className="size-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-[22px] font-extrabold text-foreground">
              Finalize sua compra
            </h3>
            <div className="mb-6 mt-2 flex items-baseline justify-center gap-2">
              <span className="text-base text-dim line-through">R$ 497</span>
              <span className="font-heading text-[42px] font-extrabold text-gradient">
                R$ 67
              </span>
            </div>
            <p className="mb-7 text-[13px] text-dim">
              Após o pagamento, a Aurora gera o planejamento completo e envia para o seu WhatsApp em PDF + mensagem.
            </p>
            <ShimmerButton
              onClick={submit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.4)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-[17px] animate-spin" aria-hidden="true" />
                  Gerando planejamento...
                </>
              ) : (
                <>
                  <Sparkles className="size-[17px]" aria-hidden="true" />
                  Pagar e criar meu ebook
                </>
              )}
            </ShimmerButton>
            <button
              onClick={() => setStep(0)}
              className="mt-3 text-center text-[13px] text-dim transition-colors hover:text-foreground"
            >
              ← Voltar
            </button>
            <p className="mt-2 text-xs text-dim">
              Pagamento seguro · Garantia 7 dias
            </p>
          </div>
        )}

        {/* Step 2: Confirmação */}
        {step === 2 && result && (
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-teal-gradient shadow-[0_0_24px_rgba(0,229,195,0.4)]">
                <Check className="size-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-foreground">
                Planejamento gerado!
              </h3>
              <p className="mt-1 text-sm text-dim">
                Aurora IA criou o briefing completo do seu ebook:
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-ink p-5">
              <div className="mb-1 font-heading text-base font-extrabold text-foreground">
                {result.titulo}
              </div>
              <div className="mb-4 text-[13px] text-brand-soft">
                {result.subtitulo}
              </div>

              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-dim">
                {result.capitulos?.length} capítulos
              </div>

              {result.capitulos?.map((c) => (
                <div key={c.numero} className="mb-3 flex gap-2.5">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-brand">
                    {c.numero}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">{c.titulo}</div>
                    {c.descricao && (
                      <div className="mt-0.5 text-[11px] text-dim line-clamp-2">{c.descricao}</div>
                    )}
                  </div>
                </div>
              ))}

              {result.promessa && (
                <div className="mt-3 rounded-[10px] bg-brand/10 px-3.5 py-2.5 text-[13px] font-semibold text-brand-soft">
                  ✨ {result.promessa}
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col items-center gap-1.5">
              {delivery === null ? (
                <div className="flex items-center gap-2 text-[13px] text-dim">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Enviando PDF e mensagem para seu WhatsApp...
                </div>
              ) : (
                <>
                  {delivery.emailSent && (
                    <div className="flex items-center gap-2 text-[13px] text-teal">
                      <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                      E-mail enviado para {form.email}
                    </div>
                  )}
                  {delivery.whatsappSent && (
                    <div className="flex items-center gap-2 text-[13px] text-teal">
                      <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                      PDF + mensagem enviados no WhatsApp!
                    </div>
                  )}
                  {!delivery.whatsappSent && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[13px] text-red-400">
                        <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        Falha no envio do WhatsApp
                      </div>
                      {delivery.whatsappError && (
                        <div className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] text-red-400 break-all">
                          {delivery.whatsappError}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
