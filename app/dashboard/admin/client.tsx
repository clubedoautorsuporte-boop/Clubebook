'use client'

import { useState } from 'react'
import {
  Zap, Loader2, CheckCircle2, ExternalLink, Download,
  BookOpen, Shuffle, Circle, Clock, FileText,
} from 'lucide-react'

const TEMAS_RAPIDOS = [
  'Finanças Pessoais para Iniciantes',
  'Emagrecimento Saudável sem Dietas',
  'Marketing Digital com IA em 2025',
  'Mindfulness e Produtividade',
  'Criar Negócio Online do Zero',
  'Relacionamentos e Comunicação',
  'Investimentos para Iniciantes',
  'Culinária Saudável Rápida',
  'Desenvolvimento Pessoal',
  'Empreendedorismo Digital',
]

type ChapterPlan = { numero: number; titulo: string; objetivo: string; subtopicos: string[] }
type ChapterFull = { numero: number; titulo: string; content: string }
type BookPlan = { titulo: string; subtitulo: string; capitulos: ChapterPlan[] }
type Result = { slug: string; titulo: string; capitulos: number; pdfSize: number }

type StepStatus = 'pending' | 'running' | 'done' | 'error'
type Step = { label: string; status: StepStatus }

export default function AdminClient() {
  const [tema, setTema] = useState('')
  const [autor, setAutor] = useState('Clube do Autor IA')
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  function randomTema() {
    setTema(TEMAS_RAPIDOS[Math.floor(Math.random() * TEMAS_RAPIDOS.length)])
  }

  function updateStep(idx: number, status: StepStatus, label?: string) {
    setSteps(prev => prev.map((s, i) =>
      i === idx ? { label: label ?? s.label, status } : s
    ))
  }

  async function generate() {
    if (!tema.trim() || running) return
    setRunning(true)
    setResult(null)
    setError('')

    // Inicializa steps placeholders
    const initialSteps: Step[] = [
      { label: 'Criando estrutura do livro com Aurora IA…', status: 'pending' },
      ...Array.from({ length: 10 }, (_, i) => ({ label: `Capítulo ${i + 1} aguardando…`, status: 'pending' as StepStatus })),
      { label: 'Montando PDF do livro completo…', status: 'pending' },
      { label: 'Salvando no banco de dados…', status: 'pending' },
    ]
    setSteps(initialSteps)

    try {
      // ── Etapa 1: Plano do livro ──────────────────────────────
      updateStep(0, 'running')
      const planRes = await fetch('/api/admin/full-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: tema.trim(), autor: autor.trim() }),
      })
      if (!planRes.ok) throw new Error((await planRes.json()).error ?? 'Erro no plano')
      const plan: BookPlan = await planRes.json()
      updateStep(0, 'done', `✓ Estrutura: "${plan.titulo}"`)

      // Atualiza os steps dos capítulos com os títulos reais
      setSteps(prev => prev.map((s, i) => {
        if (i >= 1 && i <= 10 && plan.capitulos[i - 1]) {
          return { ...s, label: `Capítulo ${i}: ${plan.capitulos[i - 1].titulo}` }
        }
        return s
      }))

      // ── Etapas 2-11: Gerar cada capítulo ─────────────────────
      const fullChapters: ChapterFull[] = []

      for (let i = 0; i < plan.capitulos.length; i++) {
        const cap = plan.capitulos[i]
        updateStep(i + 1, 'running', `Escrevendo capítulo ${i + 1}: ${cap.titulo}…`)

        const chRes = await fetch('/api/admin/full-chapter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            livroTitulo: plan.titulo,
            tema: tema.trim(),
            capitulo: cap,
          }),
        })
        if (!chRes.ok) throw new Error(`Erro no capítulo ${i + 1}`)
        const ch: ChapterFull = await chRes.json()
        fullChapters.push(ch)

        const words = ch.content.split(/\s+/).length
        updateStep(i + 1, 'done', `✓ Cap. ${i + 1}: ${cap.titulo} (${words.toLocaleString('pt-BR')} palavras)`)
      }

      // ── Etapa 12: Gerar PDF ────────────────────────────────────
      updateStep(11, 'running')
      const assembleRes = await fetch('/api/admin/full-assemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: plan.titulo,
          subtitulo: plan.subtitulo,
          autor: autor.trim(),
          capitulos: fullChapters,
        }),
      })
      if (!assembleRes.ok) throw new Error((await assembleRes.json()).error ?? 'Erro no PDF')
      updateStep(11, 'done', '✓ PDF gerado com sucesso')

      // ── Etapa 13: Salvo no banco ──────────────────────────────
      updateStep(12, 'running', 'Salvando no banco de dados…')
      const data: Result = await assembleRes.json()
      updateStep(12, 'done', `✓ Salvo · slug: ${data.slug}`)

      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
      setSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error' } : s))
    } finally {
      setRunning(false)
    }
  }

  const totalWords = steps
    .filter(s => s.status === 'done' && s.label.includes('palavras'))
    .reduce((acc, s) => {
      const m = s.label.match(/([\d.,]+) palavras/)
      if (!m) return acc
      return acc + parseInt(m[1].replace(/\D/g, ''), 10)
    }, 0)

  const doneChapters = steps.filter((s, i) => i >= 1 && i <= 10 && s.status === 'done').length
  const progress = steps.length > 0
    ? Math.round((steps.filter(s => s.status === 'done').length / steps.length) * 100)
    : 0

  return (
    <div className="px-5 pt-6 pb-12 md:px-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20">
          <BookOpen className="size-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Gerador de Livro Completo</h1>
          <p className="text-sm text-[#a0b0c8]">Gera o livro escrito de verdade — 10 capítulos com conteúdo real</p>
        </div>
        <span className="ml-auto rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400">ADMIN</span>
      </div>

      {/* Form */}
      <div className="mb-6 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Configurar livro</h2>

        {/* Tema */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-[#a0b0c8]">Tema do livro *</label>
            <button onClick={randomTema} disabled={running} className="flex items-center gap-1 text-[10px] text-[#4f7fff] hover:text-[#7fa0ff] disabled:opacity-40">
              <Shuffle className="size-3" /> Aleatório
            </button>
          </div>
          <input
            type="text"
            value={tema}
            onChange={e => setTema(e.target.value)}
            placeholder="Ex: Finanças Pessoais para Iniciantes"
            disabled={running}
            className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#8896b0] focus:border-[#4f7fff50] focus:outline-none disabled:opacity-40"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TEMAS_RAPIDOS.slice(0, 5).map(t => (
              <button key={t} onClick={() => setTema(t)} disabled={running}
                className="rounded-lg bg-[#0f1523] px-2.5 py-1 text-[10px] text-[#a0b0c8] transition hover:bg-[#1c2438] hover:text-white disabled:opacity-40">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Autor */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Nome do autor</label>
          <input
            type="text"
            value={autor}
            onChange={e => setAutor(e.target.value)}
            disabled={running}
            className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#8896b0] focus:border-[#4f7fff50] focus:outline-none disabled:opacity-40"
          />
        </div>

        {/* Info sobre o que será gerado */}
        <div className="mb-5 grid grid-cols-3 gap-3 text-center">
          {[
            { v: '10', l: 'capítulos' },
            { v: '~30k', l: 'palavras' },
            { v: '~100+', l: 'páginas PDF' },
          ].map(({ v, l }) => (
            <div key={l} className="rounded-xl border border-[#1c2438] bg-[#080b14] py-3">
              <p className="text-lg font-extrabold text-amber-400">{v}</p>
              <p className="text-[10px] text-[#a0b0c8]">{l}</p>
            </div>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={!tema.trim() || running}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.35)] transition hover:shadow-[0_0_36px_rgba(245,158,11,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running
            ? <><Loader2 className="size-4 animate-spin" /> Gerando livro… {doneChapters > 0 ? `(${doneChapters}/10 caps)` : ''}</>
            : <><Zap className="size-4" /> Gerar livro completo agora</>
          }
        </button>
      </div>

      {/* Progresso em tempo real */}
      {steps.length > 0 && (
        <div className="mb-6 rounded-2xl border border-[#1c2438] bg-[#0b0f1c]">
          <div className="border-b border-[#1c2438] px-5 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white">Progresso da geração</p>
              <div className="flex items-center gap-3">
                {totalWords > 0 && (
                  <span className="text-[10px] text-[#00e5c3]">{totalWords.toLocaleString('pt-BR')} palavras</span>
                )}
                <span className="text-[10px] font-bold text-amber-400">{progress}%</span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#0f1a2e]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#f59e0b,#f97316)',
                  boxShadow: progress > 0 ? '0 0 8px rgba(245,158,11,0.5)' : 'none',
                }}
              />
            </div>
          </div>

          <div className="divide-y divide-[#0f1523] px-5 py-2 max-h-96 overflow-y-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5">
                {/* Ícone de status */}
                {step.status === 'pending' && <Circle className="mt-0.5 size-3.5 shrink-0 text-[#2a3553]" />}
                {step.status === 'running' && <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-amber-400" />}
                {step.status === 'done' && <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#00e5c3]" />}
                {step.status === 'error' && <Circle className="mt-0.5 size-3.5 shrink-0 text-red-400" />}

                <span className={`text-[11px] leading-relaxed ${
                  step.status === 'done' ? 'text-[#6b8fa8]' :
                  step.status === 'running' ? 'text-amber-400 font-semibold' :
                  step.status === 'error' ? 'text-red-400' :
                  'text-[#2a3553]'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Resultado final */}
      {result && (
        <div className="rounded-2xl border border-[#00e5c330] bg-[#00e5c306] p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#00e5c3]" />
            <h2 className="text-sm font-bold text-[#00e5c3]">Livro completo gerado!</h2>
          </div>

          <div className="mb-4 rounded-xl border border-[#1c2438] bg-[#080b14] p-4">
            <p className="text-base font-bold text-white">{result.titulo}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#a0b0c8]">
              <span className="flex items-center gap-1"><BookOpen className="size-3" /> {result.capitulos} capítulos escritos</span>
              <span className="flex items-center gap-1"><FileText className="size-3" /> {totalWords.toLocaleString('pt-BR')} palavras totais</span>
              <span className="flex items-center gap-1"><Clock className="size-3" /> {Math.round(result.pdfSize / 1024)} KB PDF</span>
            </div>
            <p className="mt-2 font-mono text-[10px] text-[#2a3553]">slug: {result.slug}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <a
              href={`/receiver/${result.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-3 text-xs font-semibold text-white transition hover:border-[#00e5c330]"
            >
              <ExternalLink className="size-3.5" /> Ver entregável
            </a>
            <a
              href={`/api/pdf/${result.slug}`}
              download
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4f7fff] py-3 text-xs font-bold text-white transition hover:bg-[#3a6be0]"
            >
              <Download className="size-3.5" /> Baixar PDF completo
            </a>
            <a
              href="/dashboard"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-3 text-xs font-semibold text-[#4f7fff] transition hover:border-[#4f7fff40]"
            >
              <BookOpen className="size-3.5" /> Ver no dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
