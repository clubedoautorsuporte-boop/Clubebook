'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, Loader2,
  Sparkles, X, Wand2, ChevronDown, Search, Plus, Tag,
  PlayCircle, Globe, Upload, Mic, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3
type InspPanel = 'list' | 'detalhe' | null
type FonteTipo = 'texto' | 'youtube' | 'website' | 'arquivo' | 'audio'

interface Fonte { tipo: FonteTipo; conteudo: string }

const PASSOS = [
  { n: 1, label: 'O Ebook' },
  { n: 2, label: 'Materiais' },
  { n: 3, label: 'Gerar' },
]

const OBJETIVOS = [
  { icone: '💰', label: 'Ganhar dinheiro com meu ebook' },
  { icone: '💬', label: 'Contar uma história pessoal' },
  { icone: '📚', label: 'Escrever um romance ou ficção' },
  { icone: '🎓', label: 'Ensinar algo que eu sei' },
  { icone: '👨‍👩‍👧', label: 'Deixar um legado para minha família' },
  { icone: '✨', label: 'Outro objetivo' },
]

const GENEROS = [
  'Autoajuda', 'Aventura', 'Biografia', 'Ciência & Tecnologia',
  'Culinária', 'Desenvolvimento Pessoal', 'Drama', 'Educação',
  'Esportes', 'Fantasia', 'Ficção', 'Ficção Científica',
  'Ficção Histórica', 'Filosofia', 'Finanças', 'História',
  'Humor', 'Infantil', 'Juvenil', 'Mistério', 'Negócios',
  'Poesia', 'Psicologia', 'Religião & Espiritualidade', 'Romance',
  'Saúde & Bem-Estar', 'Suspense', 'Técnico & Acadêmico', 'Terror', 'Thriller',
]

const PUBLICOS = [
  'Iniciantes no assunto', 'Empreendedores', 'Pessoas buscando renda extra',
  'Estudantes', 'Donas de casa', 'Profissionais liberais',
  'Jovens adultos', 'Todos os públicos',
]

const TONS = [
  { emoji: '🔥', label: 'Motivacional' },
  { emoji: '📊', label: 'Técnico' },
  { emoji: '😊', label: 'Casual' },
  { emoji: '💼', label: 'Profissional' },
  { emoji: '🎯', label: 'Direto' },
  { emoji: '💡', label: 'Inspirador' },
]

const FONTE_TABS: { id: FonteTipo; label: string; Icon: React.ElementType; placeholder: string }[] = [
  { id: 'texto',   label: 'Texto',   Icon: FileText,   placeholder: 'Cole ou digite o texto aqui...' },
  { id: 'youtube', label: 'YouTube', Icon: PlayCircle, placeholder: 'Cole o link do vídeo do YouTube...' },
  { id: 'website', label: 'Website', Icon: Globe,      placeholder: 'Cole o link do site ou artigo...' },
  { id: 'arquivo', label: 'Arquivo', Icon: Upload,     placeholder: 'Upload disponível em breve...' },
  { id: 'audio',   label: 'Áudio',   Icon: Mic,        placeholder: 'Gravação de áudio disponível em breve...' },
]

function fonteLabel(f: Fonte): string {
  if (f.tipo === 'texto') return f.conteudo.slice(0, 60) + (f.conteudo.length > 60 ? '...' : '')
  return f.conteudo
}

// dark input class
const INPUT = 'w-full rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#8896b0] focus:border-[#4f7fff] focus:outline-none transition'

function GeneroSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [busca, setBusca] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const filtrados = GENEROS.filter(g => g.toLowerCase().includes(busca.toLowerCase()))
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setBusca('') }}
        className="flex w-full items-center justify-between rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white transition focus:border-[#4f7fff] focus:outline-none"
      >
        <span className={value ? 'text-white' : 'text-[#8896b0]'}>{value || 'Selecione o gênero...'}</span>
        <ChevronDown className={cn('size-4 text-[#8896b0] transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#1c2438] shadow-[0_8px_32px_rgba(0,0,0,0.5)]" style={{ background: '#0d1220' }}>
          <div className="flex items-center gap-2 border-b border-[#1c2438] px-3 py-2.5">
            <Search className="size-3.5 shrink-0 text-[#8896b0]" />
            <input autoFocus type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar gênero..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#8896b0] focus:outline-none" />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtrados.map(g => (
              <button key={g} type="button" onClick={() => { onChange(g); setOpen(false) }}
                className={cn('flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-white/5', value === g ? 'font-semibold text-[#4f7fff]' : 'text-[#c4d0e8]')}>
                {g}
              </button>
            ))}
            {filtrados.length === 0 && <p className="px-4 py-3 text-sm text-[#8896b0]">Nenhum gênero encontrado</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CriarPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-[#4f7fff]" /></div>}>
      <CriarPageContent />
    </Suspense>
  )
}

function CriarPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [draftId, setDraftId] = useState<string | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)

  const [inspPanel, setInspPanel] = useState<InspPanel>(null)
  const [objetivoSelecionado, setObjetivoSelecionado] = useState('')
  const [detalheObjetivo, setDetalheObjetivo] = useState('')
  const [loadingTema, setLoadingTema] = useState(false)
  const [errorTema, setErrorTema] = useState('')

  const [form, setForm] = useState({ tituloProvisorio: '', subtitulo: '', genero: '', nome: '' })
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const [publico, setPublico] = useState('')
  const [tom, setTom] = useState('')
  const [fontes, setFontes] = useState<Fonte[]>([])
  const [showAddFonte, setShowAddFonte] = useState(false)
  const [fonteTab, setFonteTab] = useState<FonteTipo>('texto')
  const [fonteInput, setFonteInput] = useState('')
  const [topicos, setTopicos] = useState<string[]>([])
  const [topicoInput, setTopicoInput] = useState('')
  const [estrategia, setEstrategia] = useState<'completa' | 'fiel' | ''>('')
  const [fonteFileLoading, setFonteFileLoading] = useState(false)
  const [audioRecording, setAudioRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [geracaoEtapa, setGeracaoEtapa] = useState<string | null>(null)

  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const id = searchParams.get('draft')
    if (!id) return
    setDraftId(id)
    fetch(`/api/draft/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setForm({ tituloProvisorio: data.titulo ?? '', subtitulo: data.subtitulo ?? '', genero: data.genero ?? '', nome: data.nomeAutor ?? '' })
        setPublico(data.publico ?? '')
        setTom(data.tom ?? '')
        setTopicos(data.topicos ?? [])
        setEstrategia(data.estrategia ?? '')
        setStep(Math.min(data.step, 2) as Step)
      })
      .catch(() => {})
  }, [searchParams])

  const saveDraft = useCallback(async (currentStep: number) => {
    if (!form.tituloProvisorio.trim() || !form.nome.trim()) return
    setSavingDraft(true)
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draftId ?? undefined,
          step: currentStep,
          titulo: form.tituloProvisorio,
          subtitulo: form.subtitulo,
          genero: form.genero,
          nomeAutor: form.nome,
          publico, tom, topicos, estrategia,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (!draftId) setDraftId(data.draftId)
      }
    } catch { /* silencioso */ } finally {
      setSavingDraft(false)
    }
  }, [draftId, form, publico, tom, topicos, estrategia])

  const selecionarObjetivo = (label: string) => {
    setObjetivoSelecionado(label); setDetalheObjetivo(''); setErrorTema(''); setInspPanel('detalhe')
  }

  const investigar = async () => {
    setLoadingTema(true); setErrorTema('')
    try {
      const res = await fetch('/api/sugerir-tema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objetivo: objetivoSelecionado, detalhes: detalheObjetivo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao sugerir tema')
      set('tituloProvisorio', data.tema); setInspPanel(null)
    } catch (e: unknown) {
      setErrorTema(e instanceof Error ? e.message : 'Erro inesperado')
    } finally { setLoadingTema(false) }
  }

  const addFonte = () => {
    const c = fonteInput.trim()
    if (!c) return
    setFontes(fs => [...fs, { tipo: fonteTab, conteudo: c }])
    setFonteInput(''); setShowAddFonte(false)
  }

  const addTopico = () => {
    const t = topicoInput.trim()
    if (t && !topicos.includes(t)) setTopicos(ts => [...ts, t])
    setTopicoInput('')
  }

  const canNext1 = form.tituloProvisorio.trim().length >= 3 && form.nome.trim().length >= 2
  const canNext3 = telefone.replace(/\D/g, '').length >= 10

  const goToStep2 = async () => { await saveDraft(2); setStep(2) }
  const goToStep3 = async () => { await saveDraft(3); setStep(3) }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    if (fonteTab === 'arquivo' && file.size > 10 * 1024 * 1024) { alert('Arquivo muito grande. Máximo 10MB.'); return }
    setFonteFileLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = () => { setFonteInput(reader.result as string); setFonteFileLoading(false) }
      reader.readAsDataURL(file)
    } catch { alert('Erro ao ler arquivo'); setFonteFileLoading(false) }
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      rec.ondataavailable = e => chunks.push(e.data)
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' })
        const reader = new FileReader()
        reader.onload = () => { setFonteInput(reader.result as string); setAudioRecording(false) }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      rec.start(); setMediaRecorder(rec); setAudioRecording(true)
    } catch { alert('Permissão de microfone negada') }
  }

  const stopAudioRecording = () => {
    if (mediaRecorder) { mediaRecorder.stop(); setMediaRecorder(null) }
  }

  async function gerar() {
    setLoading(true); setError(''); setGeracaoEtapa('Criando título...')
    try {
      const contexto = [
        publico ? `Público-alvo: ${publico}` : '',
        tom ? `Tom de voz: ${tom}` : '',
        topicos.length ? `Tópicos obrigatórios: ${topicos.join(', ')}` : '',
        fontes.length ? `Fontes de referência: ${fontes.map(f => `[${f.tipo}] ${f.conteudo.slice(0, 100)}`).join(' | ')}` : '',
      ].filter(Boolean).join(' | ')

      const tema = [form.tituloProvisorio, form.genero, objetivoSelecionado, contexto].filter(Boolean).join(' — ')

      setGeracaoEtapa('Gerando planejamento...')
      const planRes = await fetch('/api/ebook-plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, nome: form.nome }),
      })
      if (!planRes.ok) { const d = await planRes.json(); throw new Error(d.error || 'Falha ao gerar planejamento') }
      const plan = await planRes.json()

      setGeracaoEtapa('Criando sumário...')
      await new Promise(r => setTimeout(r, 500))
      setGeracaoEtapa('Gerando introdução...')
      await new Promise(r => setTimeout(r, 500))
      setGeracaoEtapa('Criando capítulos...')
      await new Promise(r => setTimeout(r, 500))
      setGeracaoEtapa('Formatando ebook...')

      const sendRes = await fetch('/api/send-preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email, telefone, plan }),
      })
      if (!sendRes.ok) { const d = await sendRes.json(); throw new Error(d.error || 'Falha ao enviar ebook') }
      const sendData = await sendRes.json()

      setGeracaoEtapa('Enviando via WhatsApp...')
      if (draftId) fetch(`/api/draft?id=${draftId}`, { method: 'DELETE' }).catch(() => {})

      // Pré-gera roteiro em background e salva no localStorage
      if (sendData?.deliveryUrl) {
        const slugMatch = String(sendData.deliveryUrl).match(/\/([a-f0-9]{32})/)
        if (slugMatch) {
          const slug = slugMatch[1]
          fetch('/api/roteiro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              titulo: plan.titulo, autor: form.nome || 'Autor',
              premissa: plan.premissa, publico_alvo: plan.publico_alvo, sinopse: plan.sinopse,
              capitulos: plan.capitulos, tipo: 'preview',
            }),
          }).then(r => r.json()).then(data => {
            if (data.capitulos) {
              try { localStorage.setItem(`roteiro_v2_${slug}`, JSON.stringify(data.capitulos)) } catch {}
            }
          }).catch(() => {})
        }
      }
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally { setLoading(false); setGeracaoEtapa(null) }
  }

  /* ── SUCCESS ── */
  if (success) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full ring-4 ring-[#00e5c320]" style={{ background: '#00e5c315' }}>
          <CheckCircle2 className="size-10 text-[#00e5c3]" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Ebook em produção!</h1>
        <p className="mt-3 max-w-sm text-[#a0b0c8]">O ebook completo chegará no WhatsApp em aproximadamente 47 minutos.</p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => {
              setSuccess(false); setStep(1)
              setForm({ tituloProvisorio: '', subtitulo: '', genero: '', nome: '' })
              setObjetivoSelecionado(''); setInspPanel(null)
              setPublico(''); setTom(''); setFontes([]); setTopicos([])
              setTelefone(''); setEmail('')
            }}
            className="rounded-xl border border-[#1c2438] px-5 py-2.5 text-sm font-semibold text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white"
            style={{ background: '#0d1220' }}
          >
            Criar outro ebook
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 12px rgba(79,127,255,0.3)' }}
          >
            Ver meus ebooks
          </button>
        </div>
      </div>
    )
  }

  /* ── MAIN ── */
  return (
    <div className="mx-auto max-w-xl px-5 py-8 md:py-12">

      {/* Progress */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {PASSOS.map((p, i) => (
          <div key={p.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-all border-2',
                step === p.n
                  ? 'border-[#4f7fff] bg-[#4f7fff] text-white shadow-[0_0_0_4px_rgba(79,127,255,0.2)]'
                  : step > p.n
                  ? 'border-[#00e5c3] bg-[#00e5c3] text-[#060a12]'
                  : 'border-[#1c2438] text-[#8896b0]'
              )} style={step === p.n || step > p.n ? {} : { background: '#0b0f1c' }}>
                {step > p.n ? '✓' : p.n}
              </div>
              <span className={cn('mt-1.5 text-[9px] font-bold tracking-widest uppercase',
                step === p.n ? 'text-[#4f7fff]' : step > p.n ? 'text-[#00e5c3]' : 'text-[#8896b0]'
              )}>{p.label}</span>
            </div>
            {i < PASSOS.length - 1 && (
              <div className={cn('mx-3 h-0.5 w-16 mb-4 rounded-full', step > p.n ? 'bg-[#00e5c3]' : 'bg-[#1c2438]')} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div>
          <h1 className="mb-1.5 text-center text-2xl font-extrabold text-white">Sobre o que vamos escrever?</h1>
          <p className="mb-8 text-center text-sm text-[#a0b0c8]">Conte o básico para a Aurora começar a criar com você.</p>

          {/* Inspiração — list */}
          {inspPanel === 'list' && (
            <div className="mb-6 overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
              <div className="flex flex-col items-center border-b border-[#1c2438] py-5 px-5">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#FFA726,#FB8C00)' }}>
                  <Lightbulb className="size-5 text-white" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Qual o seu objetivo?</h2>
                <p className="mt-1 text-[12px] text-[#a0b0c8]">Escolha o que mais combina com você</p>
              </div>
              <div className="p-3 space-y-1.5">
                {OBJETIVOS.map(obj => (
                  <button key={obj.label} onClick={() => selecionarObjetivo(obj.label)}
                    className="flex w-full items-center gap-3 rounded-lg border border-[#1c2438] px-4 py-3 text-left transition hover:border-[#4f7fff30] hover:bg-white/5"
                    style={{ background: '#0b0f1c' }}>
                    <span className="text-lg">{obj.icone}</span>
                    <span className="flex-1 text-sm font-medium text-[#c4d0e8]">{obj.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-[#8896b0]" />
                  </button>
                ))}
              </div>
              <div className="flex justify-center py-3 border-t border-[#1c2438]">
                <button onClick={() => setInspPanel(null)} className="flex items-center gap-1.5 text-sm text-[#8896b0] transition hover:text-[#a0b0c8]">
                  <X className="size-3.5" /> Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Inspiração — detalhe */}
          {inspPanel === 'detalhe' && (
            <div className="mb-6 overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
              <div className="flex flex-col items-center border-b border-[#1c2438] py-5 px-5">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                  <Wand2 className="size-5 text-white" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Quase lá!</h2>
                <p className="mt-1 text-[12px] text-[#a0b0c8]">
                  Objetivo: <span className="font-semibold text-[#4f7fff]">{objetivoSelecionado}</span>
                </p>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">
                    Quer adicionar algum detalhe? <span className="font-normal text-[#8896b0]">(opcional)</span>
                  </label>
                  <textarea value={detalheObjetivo} onChange={e => setDetalheObjetivo(e.target.value)} rows={3}
                    placeholder="Escreva aqui qualquer detalhe sobre seu objetivo..."
                    className={INPUT + ' resize-none'} />
                </div>
                {errorTema && (
                  <p className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.08)' }}>{errorTema}</p>
                )}
                <button onClick={investigar} disabled={loadingTema}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}>
                  {loadingTema
                    ? <><Loader2 className="size-4 animate-spin" /> Investigando...</>
                    : <><Wand2 className="size-4" /> Investigar e Planejar Meu Ebook</>
                  }
                </button>
                <div className="flex justify-center">
                  <button onClick={() => setInspPanel('list')} disabled={loadingTema}
                    className="flex items-center gap-1.5 text-sm text-[#8896b0] transition hover:text-[#a0b0c8] disabled:opacity-40">
                    <ArrowLeft className="size-3.5" /> Voltar para objetivos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Inspiração — botão entry */}
          {inspPanel === null && (
            <button onClick={() => setInspPanel('list')}
              className="mb-6 flex w-full items-center gap-3 rounded-xl border border-dashed border-[#4f7fff30] p-4 text-left transition hover:border-[#4f7fff60] hover:bg-white/5"
              style={{ background: 'rgba(79,127,255,0.04)' }}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                <Lightbulb className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#4f7fff]">Preciso de inspiração, não tenho ideia</p>
                <p className="text-[11px] text-[#a0b0c8]">Clique para ver sugestões de temas lucrativos</p>
              </div>
              <Sparkles className="size-4 shrink-0 text-[#4f7fff50]" />
            </button>
          )}

          {/* Campos */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Título provisório</label>
              <input type="text" value={form.tituloProvisorio} onChange={e => set('tituloProvisorio', e.target.value)}
                placeholder="Ex: Minhas Memórias, O Guia do Futuro..."
                className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Subtítulo <span className="font-normal text-[#8896b0]">(opcional)</span></label>
              <input type="text" value={form.subtitulo} onChange={e => set('subtitulo', e.target.value)}
                placeholder="Ex: Um guia completo para iniciantes..."
                className={INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Gênero Literário</label>
                <GeneroSelect value={form.genero} onChange={v => set('genero', v)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">
                  Nome do Autor (Você) <span className="text-red-400">*</span>
                </label>
                <input type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                  placeholder="Como quer ser chamado?"
                  className={INPUT} />
              </div>
            </div>
          </div>

          <button onClick={goToStep2} disabled={!canNext1 || savingDraft}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}>
            {savingDraft
              ? <><Loader2 className="size-4 animate-spin" /> Salvando...</>
              : <>Próximo Passo <ArrowRight className="size-4" /></>
            }
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div>
          <h1 className="mb-1.5 text-center text-2xl font-extrabold text-white">Base de Conteúdo</h1>
          <p className="mb-8 text-center text-sm text-[#a0b0c8]">
            Adicione materiais que a Aurora usará como referência.<br />
            Textos, links, vídeos do YouTube, PDFs...
          </p>

          <div className="overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>

            {/* Público-alvo */}
            <div className="border-b border-[#1c2438] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a0b0c8]">Para quem é este ebook?</p>
              <div className="flex flex-wrap gap-2">
                {PUBLICOS.map(p => (
                  <button key={p} type="button" onClick={() => setPublico(prev => prev === p ? '' : p)}
                    className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition',
                      publico === p
                        ? 'border-[#4f7fff] text-[#4f7fff]'
                        : 'border-[#1c2438] text-[#a0b0c8] hover:border-[#4f7fff30] hover:text-white'
                    )}
                    style={publico === p ? { background: 'rgba(79,127,255,0.12)' } : { background: '#0b0f1c' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tom de voz */}
            <div className="border-b border-[#1c2438] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a0b0c8]">Tom de voz</p>
              <div className="flex flex-wrap gap-2">
                {TONS.map(t => (
                  <button key={t.label} type="button" onClick={() => setTom(prev => prev === t.label ? '' : t.label)}
                    className={cn('flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                      tom === t.label
                        ? 'border-[#4f7fff] text-[#4f7fff]'
                        : 'border-[#1c2438] text-[#a0b0c8] hover:border-[#4f7fff30] hover:text-white'
                    )}
                    style={tom === t.label ? { background: 'rgba(79,127,255,0.12)' } : { background: '#0b0f1c' }}>
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fontes */}
            <div className="border-b border-[#1c2438] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a0b0c8]">
                Fontes de referência <span className="normal-case font-normal text-[#8896b0]">(opcional)</span>
              </p>

              {showAddFonte ? (
                <div className="rounded-xl border border-[#1c2438] overflow-hidden">
                  <div className="flex items-center border-b border-[#1c2438] px-4 py-3" style={{ background: '#0b0f1c' }}>
                    <button onClick={() => { setShowAddFonte(false); setFonteInput('') }}
                      className="flex items-center gap-1.5 text-xs text-[#a0b0c8] transition hover:text-white">
                      <ArrowLeft className="size-3.5" /> Voltar
                    </button>
                  </div>
                  <div className="flex border-b border-[#1c2438]" style={{ background: '#0b0f1c' }}>
                    {FONTE_TABS.map(tab => {
                      const Icon = tab.Icon
                      return (
                        <button key={tab.id} type="button" onClick={() => { setFonteTab(tab.id); setFonteInput('') }}
                          className={cn('flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition',
                            fonteTab === tab.id ? 'border-b-2 border-[#4f7fff] text-[#4f7fff]' : 'text-[#8896b0] hover:text-[#a0b0c8]')}>
                          <Icon className="size-4" /> {tab.label}
                        </button>
                      )
                    })}
                  </div>
                  <div className="p-4" style={{ background: '#0d1220' }}>
                    {fonteTab === 'texto' && (
                      <textarea autoFocus value={fonteInput} onChange={e => setFonteInput(e.target.value)} rows={5}
                        placeholder="Cole ou digite o texto aqui..."
                        className={INPUT + ' resize-none'} />
                    )}
                    {(fonteTab === 'youtube' || fonteTab === 'website') && (
                      <input autoFocus type="url" value={fonteInput} onChange={e => setFonteInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addFonte()}
                        placeholder={FONTE_TABS.find(t => t.id === fonteTab)?.placeholder}
                        className={INPUT} />
                    )}
                    {fonteTab === 'arquivo' && (
                      <div className="space-y-3">
                        <label className="flex flex-col items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-[#1c2438] p-6 text-center transition hover:border-[#4f7fff30]">
                          <Upload className="size-6 text-[#4f7fff]" />
                          <div>
                            <p className="text-sm font-semibold text-white">Clique ou arraste um PDF/DOCX</p>
                            <p className="text-xs text-[#8896b0]">Máximo 10MB</p>
                          </div>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={fonteFileLoading} className="hidden" />
                        </label>
                        {fonteFileLoading && <p className="text-xs text-[#a0b0c8] text-center">Carregando arquivo...</p>}
                        {fonteInput && <p className="text-xs text-[#00e5c3] text-center">✓ Arquivo carregado</p>}
                      </div>
                    )}
                    {fonteTab === 'audio' && (
                      <div className="space-y-3">
                        {!audioRecording ? (
                          <button onClick={startAudioRecording}
                            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                            <Mic className="size-4" /> Gravar Áudio
                          </button>
                        ) : (
                          <button onClick={stopAudioRecording}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600">
                            ⏹ Parar Gravação
                          </button>
                        )}
                        <label className="flex flex-col items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-[#1c2438] p-6 text-center transition hover:border-[#4f7fff30]">
                          <Upload className="size-6 text-[#4f7fff]" />
                          <div>
                            <p className="text-sm font-semibold text-white">Ou selecione um arquivo MP3</p>
                            <p className="text-xs text-[#8896b0]">Clique ou arraste um MP3</p>
                          </div>
                          <input type="file" accept="audio/mp3,.mp3" onChange={handleFileUpload} disabled={fonteFileLoading} className="hidden" />
                        </label>
                        {fonteFileLoading && <p className="text-xs text-[#a0b0c8] text-center">Carregando áudio...</p>}
                        {fonteInput && <p className="text-xs text-[#00e5c3] text-center">✓ Áudio carregado</p>}
                      </div>
                    )}
                    <button onClick={addFonte} disabled={!fonteInput.trim() || fonteFileLoading || audioRecording}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                      Adicionar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {fontes.length === 0 ? (
                    <div className="mb-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#1c2438] py-7 text-center">
                      <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: '#0b0f1c' }}>
                        <FileText className="size-5 text-[#8896b0]" />
                      </div>
                      <p className="text-xs text-[#8896b0]">
                        Nenhuma fonte adicionada ainda. Você pode pular esta etapa<br />ou adicionar materiais de referência.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-3">
                      <div className="space-y-2.5">
                        {fontes.map((f, i) => {
                          const tabInfo = FONTE_TABS.find(t => t.id === f.tipo)
                          const Icon = tabInfo?.Icon ?? FileText
                          return (
                            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#1c2438] px-3 py-2.5" style={{ background: '#0b0f1c' }}>
                              <Icon className="size-4 shrink-0 text-[#4f7fff]" />
                              <div className="flex-1 min-w-0">
                                <span className="block truncate text-xs text-white">{fonteLabel(f)}</span>
                                <span className="text-[10px] capitalize text-[#8896b0]">{f.tipo}</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-1 rounded-full text-[#00e5c3]" style={{ background: 'rgba(0,229,195,0.1)' }}>Pronto</span>
                              <button onClick={() => setFontes(fs => fs.filter((_, j) => j !== i))} className="shrink-0 text-[#8896b0] hover:text-red-400 transition">
                                <X className="size-3.5" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                      {fontes.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-bold text-white">Como a Aurora deve usar suas fontes?</p>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'completa' as const, title: 'Aurora completa o conteúdo', desc: 'Usa seu material como base e enriquece com criatividade.', Icon: CheckCircle2 },
                              { id: 'fiel' as const, title: 'Fiel ao conteúdo original', desc: 'Organiza apenas o que você forneceu.', Icon: FileText },
                            ].map(opt => (
                              <button key={opt.id} type="button" onClick={() => setEstrategia(opt.id)}
                                className={cn('rounded-xl border-2 p-3.5 text-left transition',
                                  estrategia === opt.id ? 'border-[#4f7fff]' : 'border-[#1c2438] hover:border-[#4f7fff30]'
                                )}
                                style={{ background: estrategia === opt.id ? 'rgba(79,127,255,0.08)' : '#0b0f1c' }}>
                                <div className="flex gap-2">
                                  <opt.Icon className={cn('size-4 shrink-0 mt-0.5', estrategia === opt.id ? 'text-[#4f7fff]' : 'text-[#8896b0]')} />
                                  <div className="flex-1 min-w-0">
                                    <p className={cn('text-xs font-bold', estrategia === opt.id ? 'text-[#4f7fff]' : 'text-white')}>{opt.title}</p>
                                    <p className="text-xs mt-1 text-[#a0b0c8]">{opt.desc}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={() => { setShowAddFonte(true); setFonteTab('texto'); setFonteInput('') }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#1c2438] py-3 text-sm text-[#a0b0c8] transition hover:border-[#4f7fff30] hover:text-white">
                    <Plus className="size-4" /> Adicionar Fonte
                  </button>
                </>
              )}
            </div>

            {/* Tópicos */}
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="size-3.5 text-[#8896b0]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#a0b0c8]">
                  Tópicos que não podem faltar <span className="normal-case font-normal text-[#8896b0]">(opcional)</span>
                </p>
              </div>
              {topicos.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {topicos.map(t => (
                    <span key={t} className="flex items-center gap-1.5 rounded-full border border-[#4f7fff30] px-3 py-1 text-xs text-[#4f7fff]" style={{ background: 'rgba(79,127,255,0.1)' }}>
                      {t}
                      <button onClick={() => setTopicos(ts => ts.filter(x => x !== t))} className="hover:text-red-400 transition">
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={topicoInput} onChange={e => setTopicoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTopico()}
                  placeholder="Ex: exercícios práticos, exemplos reais, cases..."
                  className="flex-1 rounded-xl border border-dashed border-[#1c2438] px-3 py-2.5 text-xs text-white placeholder:text-[#8896b0] focus:border-[#4f7fff] focus:outline-none transition" style={{ background: '#0b0f1c' }} />
                <button onClick={addTopico} disabled={!topicoInput.trim()}
                  className="flex items-center gap-1 rounded-xl border border-[#1c2438] px-3 py-2.5 text-xs font-semibold text-[#a0b0c8] transition hover:text-white disabled:opacity-40" style={{ background: '#0b0f1c' }}>
                  <Plus className="size-3.5" /> Adicionar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setStep(1); setShowAddFonte(false) }}
              className="flex items-center gap-2 rounded-xl border border-[#1c2438] px-5 py-4 text-sm font-semibold text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white"
              style={{ background: '#0d1220' }}>
              <ArrowLeft className="size-4" /> Voltar
            </button>
            <button onClick={goToStep3} disabled={savingDraft}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}>
              {savingDraft ? <><Loader2 className="size-4 animate-spin" /> Salvando...</> : <>Continuar <ArrowRight className="size-4" /></>}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div>
          <h1 className="mb-1.5 text-center text-2xl font-extrabold text-white">Tudo pronto para criar!</h1>
          <p className="mb-8 text-center text-sm text-[#a0b0c8]">Informe onde receber e a Aurora começa a escrever agora.</p>

          {/* Resumo */}
          <div className="mb-6 overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="border-b border-[#1c2438] px-5 py-3" style={{ background: '#0b0f1c' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#a0b0c8]">Resumo do ebook</p>
            </div>
            {([
              { label: 'Título', value: form.tituloProvisorio },
              form.subtitulo ? { label: 'Subtítulo', value: form.subtitulo } : null,
              form.genero ? { label: 'Gênero', value: form.genero } : null,
              { label: 'Autor', value: form.nome },
              publico ? { label: 'Público', value: publico } : null,
              tom ? { label: 'Tom', value: tom } : null,
              topicos.length ? { label: 'Tópicos', value: topicos.join(', ') } : null,
              fontes.length ? { label: 'Fontes', value: `${fontes.length} fonte${fontes.length > 1 ? 's' : ''} adicionada${fontes.length > 1 ? 's' : ''}` } : null,
            ] as Array<{ label: string; value: string } | null>)
              .filter(Boolean)
              .map(item => (
                <div key={item!.label} className="flex items-start gap-3 border-b border-[#1c2438] px-5 py-2.5 last:border-0">
                  <span className="w-20 shrink-0 text-xs text-[#8896b0]">{item!.label}</span>
                  <span className="text-sm font-medium text-white">{item!.value}</span>
                </div>
              ))}
          </div>

          {/* Contatos */}
          <div className="mb-6 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">
                WhatsApp com DDD <span className="text-red-400">*</span>
              </label>
              <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">
                E-mail <span className="font-normal text-[#8896b0]">(opcional)</span>
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={INPUT} />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 p-4 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <p className="font-semibold">❌ {error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[#1c2438] px-5 py-4 text-sm font-semibold text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white disabled:opacity-40"
              style={{ background: '#0d1220' }}>
              <ArrowLeft className="size-4" /> Voltar
            </button>
            <button onClick={gerar} disabled={loading || !canNext3}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.4)' }}>
              {loading
                ? <><Loader2 className="size-4 animate-spin" /> {geracaoEtapa || 'Gerando...'}</>
                : <><Sparkles className="size-4" /> Gerar meu ebook agora</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
