'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, Loader2, CheckCircle2, ExternalLink, Download,
  BookOpen, FlaskConical, ChevronRight, Shuffle,
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

type Result = { slug: string; titulo: string; capitulos: number }
type Stage = 'idle' | 'generating' | 'done' | 'error'

const ETAPAS = [
  'Consultando a Aurora IA…',
  'Gerando estrutura do ebook…',
  'Definindo capítulos e blocos…',
  'Escrevendo promessas e mensagens…',
  'Montando o PDF…',
  'Salvando no banco de dados…',
  'Concluindo…',
]

export default function AdminClient() {
  const router = useRouter()
  const [tema, setTema] = useState('')
  const [autor, setAutor] = useState('Clube do Autor IA')
  const [stage, setStage] = useState<Stage>('idle')
  const [etapaIdx, setEtapaIdx] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<Result[]>([])

  function randomTema() {
    const picked = TEMAS_RAPIDOS[Math.floor(Math.random() * TEMAS_RAPIDOS.length)]
    setTema(picked)
  }

  async function generate() {
    if (!tema.trim()) return
    setStage('generating')
    setEtapaIdx(0)
    setError('')
    setResult(null)

    // Avança etapas durante a geração
    const interval = setInterval(() => {
      setEtapaIdx(prev => (prev < ETAPAS.length - 1 ? prev + 1 : prev))
    }, 5000)

    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: tema.trim(), autor: autor.trim() }),
      })
      const data = await res.json()
      clearInterval(interval)

      if (!res.ok) throw new Error(data.error ?? 'Erro desconhecido')

      const newResult: Result = data
      setResult(newResult)
      setHistory(prev => [newResult, ...prev.slice(0, 9)])
      setStage('done')
    } catch (e) {
      clearInterval(interval)
      setError(e instanceof Error ? e.message : 'Erro ao gerar ebook')
      setStage('error')
    }
  }

  return (
    <div className="px-5 pt-6 pb-12 md:px-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20">
          <FlaskConical className="size-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Gerador de Teste</h1>
          <p className="text-sm text-[#6b7a99]">Área restrita · Gere ebooks sem precisar de pagamento</p>
        </div>
        <span className="ml-auto rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400">ADMIN</span>
      </div>

      {/* Form */}
      <div className="mb-6 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Gerar novo ebook teste</h2>

        {/* Tema */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-[#6b7a99]">Tema do ebook *</label>
            <button
              onClick={randomTema}
              className="flex items-center gap-1 text-[10px] text-[#4f7fff] hover:text-[#7fa0ff]"
            >
              <Shuffle className="size-3" /> Aleatório
            </button>
          </div>
          <input
            type="text"
            value={tema}
            onChange={e => setTema(e.target.value)}
            placeholder="Ex: Finanças Pessoais para Iniciantes"
            disabled={stage === 'generating'}
            className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none disabled:opacity-40"
          />
          {/* Quick picks */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TEMAS_RAPIDOS.slice(0, 5).map(t => (
              <button
                key={t}
                onClick={() => setTema(t)}
                disabled={stage === 'generating'}
                className="rounded-lg bg-[#0f1523] px-2.5 py-1 text-[10px] text-[#6b7a99] transition hover:bg-[#1c2438] hover:text-white disabled:opacity-40"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Autor */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold text-[#6b7a99]">Nome do autor</label>
          <input
            type="text"
            value={autor}
            onChange={e => setAutor(e.target.value)}
            disabled={stage === 'generating'}
            className="w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#4f7fff50] focus:outline-none disabled:opacity-40"
          />
        </div>

        {/* Botão gerar */}
        <button
          onClick={generate}
          disabled={!tema.trim() || stage === 'generating'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition hover:shadow-[0_0_32px_rgba(245,158,11,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stage === 'generating'
            ? <><Loader2 className="size-4 animate-spin" /> {ETAPAS[etapaIdx]}</>
            : <><Zap className="size-4" /> Gerar ebook teste agora</>
          }
        </button>

        {/* Progresso */}
        {stage === 'generating' && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[10px] text-[#3a4a66]">
              <span>Etapa {etapaIdx + 1} de {ETAPAS.length}</span>
              <span>{Math.round(((etapaIdx + 1) / ETAPAS.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0f1a2e]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.round(((etapaIdx + 1) / ETAPAS.length) * 100)}%`,
                  background: 'linear-gradient(90deg,#f59e0b,#f97316)',
                  boxShadow: '0 0 8px rgba(245,158,11,0.6)',
                }}
              />
            </div>
          </div>
        )}

        {/* Erro */}
        {stage === 'error' && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Resultado */}
      {stage === 'done' && result && (
        <div className="mb-6 rounded-2xl border border-[#00e5c330] bg-[#00e5c308] p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#00e5c3]" />
            <h2 className="text-sm font-bold text-[#00e5c3]">Ebook gerado com sucesso!</h2>
          </div>

          <div className="mb-4 rounded-xl border border-[#1c2438] bg-[#080b14] p-4">
            <p className="font-bold text-white">{result.titulo}</p>
            <p className="mt-0.5 text-xs text-[#6b7a99]">{result.capitulos} capítulos · Autor: {autor}</p>
            <p className="mt-1 font-mono text-[10px] text-[#3a4a66]">slug: {result.slug}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <a
              href={`/receiver/${result.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-2.5 text-xs font-semibold text-white transition hover:border-[#00e5c330]"
            >
              <ExternalLink className="size-3.5" /> Ver briefing
            </a>
            <a
              href={`/api/pdf/${result.slug}`}
              download
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#080b14] py-2.5 text-xs font-semibold text-[#4f7fff] transition hover:border-[#4f7fff40]"
            >
              <Download className="size-3.5" /> Baixar PDF
            </a>
            <button
              onClick={() => { router.push('/dashboard'); router.refresh() }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4f7fff15] py-2.5 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
            >
              <BookOpen className="size-3.5" /> Ver no dashboard
            </button>
          </div>
        </div>
      )}

      {/* Histórico da sessão */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c]">
          <div className="border-b border-[#1c2438] px-5 py-3">
            <p className="text-xs font-bold text-[#6b7a99] uppercase tracking-wider">Gerados nesta sessão ({history.length})</p>
          </div>
          <div className="divide-y divide-[#1c2438]">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{h.titulo}</p>
                  <p className="font-mono text-[10px] text-[#3a4a66]">{h.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <a
                    href={`/receiver/${h.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-7 w-7 place-items-center rounded-lg bg-[#0f1523] text-[#6b7a99] transition hover:text-white"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href={`/api/pdf/${h.slug}`}
                    download
                    className="grid h-7 w-7 place-items-center rounded-lg bg-[#0f1523] text-[#4f7fff] transition hover:bg-[#4f7fff15]"
                  >
                    <Download className="size-3.5" />
                  </a>
                  <a
                    href={`/api/pdf/${h.slug}`}
                    download
                    className="flex items-center gap-1 rounded-lg bg-[#0f1523] px-2 text-[10px] text-[#6b7a99] transition hover:text-white"
                  >
                    <ChevronRight className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
