'use client'

import { useParams } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Send, Loader2, User, Copy, Check,
  BookOpen, Image, Palette, Headphones, Rocket, Megaphone,
  Globe, Brush, PenTool, RefreshCw, Scissors, AlignLeft,
  BarChart2, Type, Layers, Database, Search, Sparkles,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

type Meta = {
  titulo: string
  subtitulo: string
  icon: React.ElementType
  cor: string
  preco?: string
  creditos?: string
  tipo: 'pago' | 'credito'
  starter: string
  sugestoes: string[]
}

const METAS: Record<string, Meta> = {
  'escrita-livro': {
    titulo: 'Escrita do Livro',
    subtitulo: 'Geração completa com IA',
    icon: BookOpen, cor: '#4f7fff', preco: 'R$ 49,99', tipo: 'pago',
    starter: 'Olá! Sou a Aurora IA, sua especialista em escrita. Vou ajudar você a criar, expandir ou ajustar qualquer parte do seu livro. O que você gostaria de fazer?',
    sugestoes: ['Criar um novo capítulo introdutório', 'Expandir uma cena específica', 'Reescrever em tom mais formal', 'Criar diálogos mais naturais'],
  },
  'capa-profissional': {
    titulo: 'Capa Profissional',
    subtitulo: '4 variações de conceito visual',
    icon: Image, cor: '#8b5cf6', preco: 'R$ 99,99', tipo: 'pago',
    starter: 'Olá! Vou criar 4 conceitos visuais únicos para a capa do seu livro. Para começar, me conte: qual é o título, o gênero e o tom do seu livro?',
    sugestoes: ['Gênero: Romance', 'Gênero: Negócios e Autoajuda', 'Estilo minimalista moderno', 'Estilo clássico literário'],
  },
  'ajuste-capa': {
    titulo: 'Ajuste de Capa',
    subtitulo: 'Refinamentos precisos na capa atual',
    icon: Palette, cor: '#ec4899', preco: 'R$ 19,99', tipo: 'pago',
    starter: 'Olá! Vou ajudar a refinar sua capa. Me descreva o que você tem agora e o que gostaria de mudar: cor, tipografia, layout ou elementos visuais?',
    sugestoes: ['Mudar a paleta de cores', 'Ajustar a tipografia do título', 'Reposicionar elementos', 'Adicionar efeito de textura'],
  },
  'audiobook': {
    titulo: 'Audiobook Premium',
    subtitulo: 'Roteiro narrado profissional',
    icon: Headphones, cor: '#f97316', preco: 'R$ 409,99', tipo: 'pago',
    starter: 'Olá! Vou adaptar seu livro para audiobook com marcações profissionais de narração. Cole aqui o trecho que deseja converter.',
    sugestoes: ['Adaptar capítulo 1', 'Criar introdução narrada', 'Adicionar marcações de pausa', 'Tom mais dramático'],
  },
  'preparacao-publicacao': {
    titulo: 'Preparação para Publicação',
    subtitulo: 'Textos prontos para plataformas',
    icon: Rocket, cor: '#00e5c3', preco: 'R$ 39,99', tipo: 'pago',
    starter: 'Olá! Vou preparar seu livro para publicação. Me diga: título do livro, gênero, público-alvo e em qual plataforma você pretende publicar.',
    sugestoes: ['Publicar na Amazon KDP', 'Publicar na Hotmart', 'Gerar descrição completa', 'Checklist de publicação'],
  },
  'material-marketing': {
    titulo: 'Material de Marketing',
    subtitulo: 'Copies e peças prontas',
    icon: Megaphone, cor: '#facc15', preco: 'R$ 7,99–19,99', tipo: 'pago',
    starter: 'Olá! Vou criar materiais de marketing poderosos para o seu livro. Qual tipo de peça você precisa primeiro?',
    sugestoes: ['Post para Instagram', 'Email de lançamento', 'Copy para anúncio Facebook', 'Página de vendas completa'],
  },
  'traducao': {
    titulo: 'Tradução',
    subtitulo: 'Tradução literária fiel ao estilo',
    icon: Globe, cor: '#06b6d4', preco: 'R$ 29,99 / idioma', tipo: 'pago',
    starter: 'Olá! Vou traduzir seu livro mantendo o estilo e a voz do autor. Para qual idioma deseja traduzir? Cole aqui o trecho.',
    sugestoes: ['Traduzir para inglês', 'Traduzir para espanhol', 'Traduzir para francês', 'Traduzir para alemão'],
  },
  'ilustracoes': {
    titulo: 'Ilustrações',
    subtitulo: 'Prompts para IA generativa',
    icon: Brush, cor: '#a78bfa', preco: 'R$ 9,99–14,99 / imagem', tipo: 'pago',
    starter: 'Olá! Vou criar briefings detalhados para suas ilustrações. Me conte: qual cena ou personagem você quer ilustrar?',
    sugestoes: ['Ilustrar cena de abertura', 'Criar personagem principal', 'Mapa do mundo fictício', 'Cenas de ação dinâmicas'],
  },
  'novo-capitulo': {
    titulo: 'Criar novo capítulo',
    subtitulo: 'Capítulo completo com gancho',
    icon: PenTool, cor: '#4f7fff', creditos: '488 créditos', tipo: 'credito',
    starter: 'Olá! Vou escrever um novo capítulo para você. Me diga: qual é o título do capítulo, o que aconteceu antes e qual é o objetivo desta parte da história?',
    sugestoes: ['Capítulo de abertura', 'Cena de conflito', 'Momento revelação', 'Capítulo de conclusão'],
  },
  'reescrever-capitulo': {
    titulo: 'Reescrever capítulo inteiro',
    subtitulo: 'Versão melhorada completa',
    icon: RefreshCw, cor: '#8b5cf6', creditos: '735 créditos', tipo: 'credito',
    starter: 'Olá! Vou reescrever seu capítulo com melhorias substanciais. Cole o texto aqui e me diga o que não está funcionando.',
    sugestoes: ['Melhorar o ritmo narrativo', 'Tornar os diálogos mais naturais', 'Adicionar mais profundidade', 'Mudar o ponto de vista'],
  },
  'reescrever-secao': {
    titulo: 'Reescrever seção',
    subtitulo: 'Melhoria de trecho específico',
    icon: Scissors, cor: '#ec4899', creditos: '499 créditos', tipo: 'credito',
    starter: 'Olá! Cole aqui a seção que deseja melhorar e me diga o objetivo: mais fluidez, mais impacto, mais clareza?',
    sugestoes: ['Mais fluidez na leitura', 'Mais impacto emocional', 'Linguagem mais clara', 'Adicionar detalhes sensoriais'],
  },
  'reescrever-paragrafo': {
    titulo: 'Reescrever parágrafo',
    subtitulo: '3 variações criativas',
    icon: AlignLeft, cor: '#f97316', creditos: '348 créditos', tipo: 'credito',
    starter: 'Olá! Cole aqui o parágrafo e receba 3 versões diferentes: uma com mais impacto, uma mais clara e uma mais emocional.',
    sugestoes: ['Parágrafo de abertura', 'Descrição de personagem', 'Cena de clímax', 'Parágrafo de encerramento'],
  },
  'corrigir-capitulo': {
    titulo: 'Corrigir texto do capítulo',
    subtitulo: 'Revisão ortográfica e gramatical',
    icon: Wrench, cor: '#00e5c3', creditos: '116 créditos', tipo: 'credito',
    starter: 'Olá! Cole aqui o texto do capítulo para revisão completa. Vou corrigir ortografia, gramática, pontuação e coesão.',
    sugestoes: ['Corrigir capítulo 1', 'Revisar diálogos', 'Corrigir pontuação', 'Melhorar coesão textual'],
  },
  'analise-editorial': {
    titulo: 'Análise editorial',
    subtitulo: 'Relatório editorial profissional',
    icon: BarChart2, cor: '#facc15', creditos: '65 créditos', tipo: 'credito',
    starter: 'Olá! Cole o capítulo aqui e receba uma análise editorial completa: estrutura, ritmo, coerência e sugestões de melhoria.',
    sugestoes: ['Analisar capítulo 1', 'Avaliar ritmo narrativo', 'Checar consistência', 'Analisar arco do personagem'],
  },
  'editar-texto-capa': {
    titulo: 'Editar texto da capa',
    subtitulo: 'Copywriting de impacto',
    icon: Type, cor: '#06b6d4', creditos: '498 créditos', tipo: 'credito',
    starter: 'Olá! Vou criar textos poderosos para sua capa. Me diga o tema do livro, o público e o estilo que deseja para o título, subtítulo e contracapa.',
    sugestoes: ['Criar título impactante', 'Escrever subtítulo', 'Texto da contracapa', 'Tagline memorável'],
  },
  'editar-estilo-capa': {
    titulo: 'Editar estilo da capa',
    subtitulo: 'Novas direções visuais',
    icon: Layers, cor: '#a78bfa', creditos: '720 créditos', tipo: 'credito',
    starter: 'Olá! Vou redefinir o estilo visual da sua capa com um concept board textual completo. Me conte o gênero e o público do livro.',
    sugestoes: ['Estilo moderno e clean', 'Estilo dramático e sombrio', 'Estilo colorido e vibrante', 'Estilo vintage literário'],
  },
  'metadados': {
    titulo: 'Gerar metadados',
    subtitulo: 'SEO completo para publicação',
    icon: Database, cor: '#34d399', creditos: '260 créditos', tipo: 'credito',
    starter: 'Olá! Vou gerar metadados completos para o seu livro. Me diga o título, gênero, tema principal e público-alvo.',
    sugestoes: ['Livro de finanças pessoais', 'Romance contemporâneo', 'Ficção científica', 'Autoajuda e desenvolvimento'],
  },
  'buscar-substituir': {
    titulo: 'Buscar e substituir',
    subtitulo: 'Consistência em todo o manuscrito',
    icon: Search, cor: '#fb7185', creditos: '30 créditos', tipo: 'credito',
    starter: 'Olá! Vou corrigir inconsistências em todo o livro. Me informe: o que deseja substituir e pelo quê?',
    sugestoes: ['Corrigir nome de personagem', 'Padronizar termos técnicos', 'Substituir expressões repetidas', 'Padronizar formatação'],
  },
}

type Msg = { role: 'user' | 'assistant'; content: string; id: string }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="mt-1.5 flex items-center gap-1 text-[10px] text-[#3a4a66] transition hover:text-[#6b7a99]"
    >
      {copied ? <><Check className="size-3 text-[#00e5c3]" /> Copiado</> : <><Copy className="size-3" /> Copiar</>}
    </button>
  )
}

export default function FerramentaPage() {
  const params = useParams()
  const slug = params.ferramenta as string
  const meta = METAS[slug]
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, streamingText])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Msg = { role: 'user', content: text, id: Date.now().toString() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/kit-ferramentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ferramenta: slug,
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok || !res.body) throw new Error('Erro na API')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        // Parse SSE lines
        full += chunk
        setStreamingText(full)
      }

      if (full) {
        setMessages(prev => [...prev, { role: 'assistant', content: full, id: Date.now().toString() }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops, ocorreu um erro. Tente novamente.', id: Date.now().toString() }])
    } finally {
      setIsLoading(false)
      setStreamingText('')
    }
  }, [messages, isLoading, slug])

  if (!meta) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-[#6b7a99]">Ferramenta não encontrada.</p>
        <Link href="/dashboard/kit-ferramentas" className="text-sm text-[#4f7fff] hover:underline">← Voltar ao Kit</Link>
      </div>
    )
  }

  const Icon = meta.icon
  const showStarter = messages.length === 0 && !isLoading

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col">

      {/* Header */}
      <div className="shrink-0 border-b border-[#1c2438] bg-[#080b14] px-5 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/kit-ferramentas"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#1c2438] text-[#6b7a99] transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: `${meta.cor}20` }}
          >
            <Icon className="size-5" style={{ color: meta.cor }} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-white">{meta.titulo}</h1>
            <p className="text-xs text-[#6b7a99]">{meta.subtitulo}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {meta.tipo === 'pago' ? (
              <span className="rounded-lg bg-[#4f7fff15] px-3 py-1 text-xs font-bold text-[#4f7fff]">{meta.preco}</span>
            ) : (
              <span className="rounded-lg px-3 py-1 text-xs font-bold" style={{ background: `${meta.cor}18`, color: meta.cor }}>−{meta.creditos}</span>
            )}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#00e5c318] bg-[#00e5c308] px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[10px] font-medium text-[#00e5c3]">DeepSeek online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Mensagem inicial da IA */}
          {showStarter && (
            <div className="flex gap-3">
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl mt-1"
                style={{ background: `${meta.cor}20` }}
              >
                <Sparkles className="size-4" style={{ color: meta.cor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[10px] font-bold text-[#3a4a66]">Aurora IA · {meta.titulo}</p>
                <div className="rounded-2xl rounded-tl-sm border border-[#1c2438] bg-[#0b0f1c] px-4 py-3">
                  <p className="text-sm leading-relaxed text-[#c8d3f5]">{meta.starter}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.sugestoes.map(s => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); inputRef.current?.focus() }}
                      className="rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs text-[#6b7a99] transition hover:border-[#2a3553] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mensagens do chat */}
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl mt-1"
                style={m.role === 'assistant' ? { background: `${meta.cor}20` } : { background: '#4f7fff20' }}
              >
                {m.role === 'user'
                  ? <User className="size-4 text-[#4f7fff]" />
                  : <Sparkles className="size-4" style={{ color: meta.cor }} />
                }
              </div>
              <div className={`min-w-0 max-w-[80%] flex flex-col ${m.role === 'user' ? 'items-end' : ''}`}>
                <p className={`mb-1 text-[10px] font-bold text-[#3a4a66] ${m.role === 'user' ? 'text-right' : ''}`}>
                  {m.role === 'user' ? 'Você' : `Aurora IA · ${meta.titulo}`}
                </p>
                <div className={`rounded-2xl border px-4 py-3 ${
                  m.role === 'user'
                    ? 'rounded-tr-sm border-[#4f7fff30] bg-[#4f7fff12]'
                    : 'rounded-tl-sm border-[#1c2438] bg-[#0b0f1c]'
                }`}>
                  <p className="text-sm leading-relaxed text-[#c8d3f5] whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === 'assistant' && <CopyButton text={m.content} />}
              </div>
            </div>
          ))}

          {/* Streaming */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl mt-1" style={{ background: `${meta.cor}20` }}>
                {streamingText ? (
                  <Sparkles className="size-4" style={{ color: meta.cor }} />
                ) : (
                  <Loader2 className="size-4 animate-spin" style={{ color: meta.cor }} />
                )}
              </div>
              <div className="min-w-0 max-w-[80%] flex flex-col">
                <p className="mb-1 text-[10px] font-bold text-[#3a4a66]">Aurora IA · {meta.titulo}</p>
                <div className="rounded-2xl rounded-tl-sm border border-[#1c2438] bg-[#0b0f1c] px-4 py-3">
                  {streamingText ? (
                    <p className="text-sm leading-relaxed text-[#c8d3f5] whitespace-pre-wrap">
                      {streamingText}
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#4f7fff] align-middle" />
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#3a4a66] [animation-delay:0ms]" />
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#3a4a66] [animation-delay:150ms]" />
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#3a4a66] [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[#1c2438] bg-[#080b14] px-4 py-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Digite sua solicitação para ${meta.titulo.toLowerCase()}...`}
                rows={1}
                className="w-full resize-none rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-3 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#2a3553] focus:outline-none min-h-[48px] max-h-40 overflow-auto"
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement
                  t.style.height = 'auto'
                  t.style.height = Math.min(t.scrollHeight, 160) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${meta.cor}, ${meta.cor}bb)` }}
            >
              {isLoading ? <Loader2 className="size-4 animate-spin text-white" /> : <Send className="size-4 text-white" />}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[#2a3553]">Enter para enviar · Shift+Enter para nova linha</p>
        </div>
      </div>
    </div>
  )
}
