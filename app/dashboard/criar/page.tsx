'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, Loader2, Sparkles, X, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3
type InspPanel = 'list' | 'detalhe' | null

const PASSOS = [
  { n: 1, label: 'O EBOOK' },
  { n: 2, label: 'ENTREGA' },
  { n: 3, label: 'GERAR' },
]

const OBJETIVOS = [
  { icone: '💰', label: 'Ganhar dinheiro com meu ebook' },
  { icone: '💬', label: 'Contar uma história pessoal' },
  { icone: '📚', label: 'Escrever um romance ou ficção' },
  { icone: '🎓', label: 'Ensinar algo que eu sei' },
  { icone: '👨‍👩‍👧', label: 'Deixar um legado para minha família' },
  { icone: '✨', label: 'Outro objetivo' },
]

export default function CriarPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Inspiration panel state machine: null → 'list' → 'detalhe'
  const [inspPanel, setInspPanel] = useState<InspPanel>(null)
  const [objetivoSelecionado, setObjetivoSelecionado] = useState('')
  const [detalheObjetivo, setDetalheObjetivo] = useState('')
  const [loadingTema, setLoadingTema] = useState(false)
  const [errorTema, setErrorTema] = useState('')

  const [form, setForm] = useState({
    tema: '',
    tituloProvisorio: '',
    nome: '',
    telefone: '',
    email: '',
  })

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const selecionarObjetivo = (label: string) => {
    setObjetivoSelecionado(label)
    setDetalheObjetivo('')
    setErrorTema('')
    setInspPanel('detalhe')
  }

  const investigar = async () => {
    setLoadingTema(true)
    setErrorTema('')
    try {
      const res = await fetch('/api/sugerir-tema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objetivo: objetivoSelecionado, detalhes: detalheObjetivo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao sugerir tema')
      set('tema', data.tema)
      setInspPanel(null)
    } catch (e: unknown) {
      setErrorTema(e instanceof Error ? e.message : 'Erro inesperado')
    } finally {
      setLoadingTema(false)
    }
  }

  const canNext1 = form.tema.trim().length >= 3 && form.nome.trim().length >= 2
  const canNext2 = form.telefone.replace(/\D/g, '').length >= 10

  async function gerar() {
    setLoading(true)
    setError('')
    try {
      const planRes = await fetch('/api/ebook-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: form.tema, nome: form.nome }),
      })
      if (!planRes.ok) throw new Error('Falha ao gerar planejamento')
      const { plan } = await planRes.json()

      const sendRes = await fetch('/api/send-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, telefone: form.telefone, plan }),
      })
      if (!sendRes.ok) throw new Error('Falha ao enviar ebook')
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#00e5c320] ring-4 ring-[#00e5c310]">
          <CheckCircle2 className="size-10 text-[#00e5c3]" />
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white">Ebook em produção!</h1>
        <p className="mt-3 max-w-sm text-[#6b7a99]">
          Seu planejamento foi gerado. O ebook completo chegará no WhatsApp em ~47 minutos.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => {
              setSuccess(false)
              setStep(1)
              setForm({ tema: '', tituloProvisorio: '', nome: '', telefone: '', email: '' })
            }}
            className="rounded-xl border border-[#1c2438] bg-[#0f1523] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#4f7fff40]"
          >
            Criar outro ebook
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)]"
          >
            Ver meus ebooks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8 md:py-12">
      {/* Progress steps */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {PASSOS.map((p, i) => (
          <div key={p.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition-all',
                step === p.n
                  ? 'bg-[#00e5c3] text-[#040810] shadow-[0_0_16px_rgba(0,229,195,0.5)]'
                  : step > p.n
                  ? 'bg-[#00e5c330] text-[#00e5c3]'
                  : 'border border-[#2a3553] bg-[#0f1523] text-[#3a4a66]',
              )}>
                {step > p.n ? '✓' : p.n}
              </div>
              <span className={cn(
                'mt-1.5 text-[9px] font-bold tracking-widest',
                step === p.n ? 'text-[#00e5c3]' : 'text-[#2a3553]',
              )}>
                {p.label}
              </span>
            </div>
            {i < PASSOS.length - 1 && (
              <div className={cn('mx-3 h-px w-16 mb-4', step > p.n ? 'bg-[#00e5c330]' : 'bg-[#1c2438]')} />
            )}
          </div>
        ))}
      </div>

      {/* ─── STEP 1 ─── */}
      {step === 1 && (
        <div>
          <h1 className="mb-2 text-center font-heading text-3xl font-extrabold text-white">
            Sobre o que vamos escrever?
          </h1>
          <p className="mb-8 text-center text-sm text-[#6b7a99]">
            Conte o básico para a Aurora começar a criar com você.
          </p>

          {/* Panel: lista de objetivos */}
          {inspPanel === 'list' && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0b0f1c]">
              <div className="flex flex-col items-center py-6 px-5">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#00e5c315]">
                  <Lightbulb className="size-5 text-[#00e5c3]" />
                </div>
                <h2 className="text-lg font-bold text-white">Qual o seu objetivo?</h2>
                <p className="mt-1 text-sm text-[#6b7a99]">Escolha o que mais combina com você</p>
              </div>

              <div className="px-3 pb-3 space-y-1.5">
                {OBJETIVOS.map((obj) => (
                  <button
                    key={obj.label}
                    onClick={() => selecionarObjetivo(obj.label)}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#1c2438] bg-[#0f1523] px-4 py-3.5 text-left transition hover:border-[#4f7fff40] hover:bg-[#111827]"
                  >
                    <span className="text-lg">{obj.icone}</span>
                    <span className="flex-1 text-sm font-medium text-white">{obj.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-[#3a4a66]" />
                  </button>
                ))}
              </div>

              <div className="flex justify-center py-4">
                <button
                  onClick={() => setInspPanel(null)}
                  className="flex items-center gap-1.5 text-sm text-[#3a4a66] transition hover:text-white"
                >
                  <X className="size-3.5" />
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Panel: "Quase lá!" — detalhe do objetivo selecionado */}
          {inspPanel === 'detalhe' && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0b0f1c]">
              <div className="flex flex-col items-center py-6 px-5">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#00e5c315]">
                  <Wand2 className="size-5 text-[#00e5c3]" />
                </div>
                <h2 className="text-lg font-bold text-white">Quase lá!</h2>
                <p className="mt-1 text-sm text-[#6b7a99]">
                  Objetivo:{' '}
                  <span className="font-semibold text-[#00e5c3]">{objetivoSelecionado}</span>
                </p>
              </div>

              <div className="px-5 pb-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                    Quer adicionar algum detalhe?{' '}
                    <span className="text-[#3a4a66]">(opcional)</span>
                  </label>
                  <textarea
                    value={detalheObjetivo}
                    onChange={e => setDetalheObjetivo(e.target.value)}
                    rows={3}
                    placeholder={`Escreva aqui qualquer coisa que quiser para o objetivo "${objetivoSelecionado}", ou deixe em branco e clique no botão abaixo...`}
                    className="w-full resize-none rounded-xl border border-[#1c2438] bg-[#0f1523] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#00e5c330] focus:outline-none"
                  />
                </div>

                {errorTema && (
                  <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {errorTema}
                  </p>
                )}

                <button
                  onClick={investigar}
                  disabled={loadingTema}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-4 text-sm font-bold text-[#040810] shadow-[0_0_24px_rgba(0,229,195,0.35)] transition hover:bg-[#00cfb0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingTema ? (
                    <><Loader2 className="size-4 animate-spin" /> Investigando seu tema...</>
                  ) : (
                    <><Wand2 className="size-4" /> INVESTIGAR E PLANEJAR MEU EBOOK</>
                  )}
                </button>

                <div className="flex justify-center">
                  <button
                    onClick={() => setInspPanel('list')}
                    disabled={loadingTema}
                    className="flex items-center gap-1.5 text-sm text-[#3a4a66] transition hover:text-white disabled:opacity-40"
                  >
                    <ArrowLeft className="size-3.5" />
                    Voltar para objetivos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed: botão de inspiração */}
          {inspPanel === null && (
            <button
              onClick={() => setInspPanel('list')}
              className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#00e5c340] bg-[#00e5c306] p-4 text-left transition hover:border-[#00e5c360] hover:bg-[#00e5c30a]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#00e5c320]">
                <Lightbulb className="size-5 text-[#00e5c3]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-wide text-[#00e5c3]">
                  PRECISO DE INSPIRAÇÃO, NÃO TENHO IDEIA
                </p>
                <p className="text-xs text-[#6b7a99]">
                  Clique para ver sugestões de temas lucrativos
                </p>
              </div>
              <Sparkles className="size-4 shrink-0 text-[#00e5c350]" />
            </button>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                Tema do ebook <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.tema}
                onChange={e => set('tema', e.target.value)}
                placeholder="Ex: Finanças pessoais para iniciantes, Emagrecimento..."
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                Título provisório <span className="text-[#3a4a66]">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.tituloProvisorio}
                onChange={e => set('tituloProvisorio', e.target.value)}
                placeholder="Ex: Minhas Finanças, O Guia do Futuro..."
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                Nome do Autor (você) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                placeholder="Como quer ser chamado?"
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canNext1}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-4 text-sm font-bold text-[#040810] shadow-[0_0_24px_rgba(0,229,195,0.35)] transition hover:bg-[#00cfb0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próximo Passo
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 2 && (
        <div>
          <h1 className="mb-2 text-center font-heading text-3xl font-extrabold text-white">
            Onde você quer receber?
          </h1>
          <p className="mb-8 text-center text-sm text-[#6b7a99]">
            Enviaremos o planejamento e o ebook completo pelo WhatsApp.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                WhatsApp com DDD <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.telefone}
                onChange={e => set('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">
                E-mail <span className="text-[#3a4a66]">(opcional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-[#00e5c318] bg-[#00e5c306] p-4">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-sm">⚡</span>
                <p className="text-xs leading-relaxed text-[#6b7a99]">
                  <span className="font-semibold text-[#00e5c3]">Entrega em ~47 minutos:</span>{' '}
                  planejamento completo em ~5 min + ebook PDF, DOCX e EPUB com direitos comerciais 100% seus.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0f1523] px-5 py-4 text-sm font-semibold text-[#6b7a99] transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canNext2}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00e5c3] py-4 text-sm font-bold text-[#040810] shadow-[0_0_24px_rgba(0,229,195,0.35)] transition hover:bg-[#00cfb0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próximo Passo
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3 ─── */}
      {step === 3 && (
        <div>
          <h1 className="mb-2 text-center font-heading text-3xl font-extrabold text-white">
            Tudo pronto para criar!
          </h1>
          <p className="mb-8 text-center text-sm text-[#6b7a99]">
            Confirme os dados e a Aurora começa a escrever agora.
          </p>

          <div className="mb-6 overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0f1523]">
            <div className="border-b border-[#1c2438] px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#3a4a66]">Resumo</p>
            </div>
            {([
              { label: 'Tema', value: form.tema },
              { label: 'Autor', value: form.nome },
              { label: 'WhatsApp', value: form.telefone },
              form.email ? { label: 'E-mail', value: form.email } : null,
            ] as Array<{ label: string; value: string } | null>)
              .filter(Boolean)
              .map(item => (
                <div key={item!.label} className="flex items-start gap-3 border-b border-[#1c2438] px-5 py-3 last:border-0">
                  <span className="w-20 shrink-0 text-xs text-[#3a4a66]">{item!.label}</span>
                  <span className="text-sm font-medium text-white">{item!.value}</span>
                </div>
              ))}
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0f1523] px-5 py-4 text-sm font-semibold text-[#6b7a99] transition hover:text-white disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </button>
            <button
              onClick={gerar}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-4 text-sm font-bold text-white shadow-[0_0_24px_rgba(79,127,255,0.4)] transition hover:shadow-[0_0_36px_rgba(79,127,255,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="size-4 animate-spin" /> Gerando seu ebook...</>
              ) : (
                <><Sparkles className="size-4" /> Gerar meu ebook agora</>
              )}
            </button>
          </div>

          {loading && (
            <p className="mt-4 text-center text-xs text-[#3a4a66]">
              A Aurora está planejando seu ebook... isso leva até 60 segundos.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
