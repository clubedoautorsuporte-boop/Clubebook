'use client'

import Link from 'next/link'
import {
  Wrench, BookOpen, Image, Palette, Headphones, Rocket, Megaphone,
  Globe, Brush, PenTool, RefreshCw, Scissors, AlignLeft, SpellCheck,
  BarChart2, Type, Layers, Database, Search, ChevronRight, Zap, Crown,
} from 'lucide-react'

type Ferramenta = {
  slug: string
  icon: React.ElementType
  titulo: string
  descricao: string
  preco?: string
  creditos?: string
  cor: string
  tipo: 'pago' | 'credito'
  badge?: string
}

const SERVICOS_PAGOS: Ferramenta[] = [
  {
    slug: 'escrita-livro',
    icon: BookOpen,
    titulo: 'Escrita do Livro',
    descricao: 'Geração completa do seu livro com IA. Do esboço ao manuscrito finalizado.',
    preco: 'R$ 49,99',
    cor: '#4f7fff',
    tipo: 'pago',
    badge: 'Mais Popular',
  },
  {
    slug: 'capa-profissional',
    icon: Image,
    titulo: 'Capa Profissional',
    descricao: '4 variações de capa com conceito visual completo para seu livro.',
    preco: 'R$ 99,99',
    cor: '#8b5cf6',
    tipo: 'pago',
  },
  {
    slug: 'ajuste-capa',
    icon: Palette,
    titulo: 'Ajuste de Capa',
    descricao: 'Refinamentos precisos na capa existente: cor, texto, layout e composição.',
    preco: 'R$ 19,99',
    cor: '#ec4899',
    tipo: 'pago',
  },
  {
    slug: 'audiobook',
    icon: Headphones,
    titulo: 'Audiobook Premium',
    descricao: 'Roteiro narrado com indicações profissionais de tom, pausas e ritmo.',
    preco: 'R$ 409,99',
    cor: '#f97316',
    tipo: 'pago',
    badge: 'Premium',
  },
  {
    slug: 'preparacao-publicacao',
    icon: Rocket,
    titulo: 'Preparação para Publicação',
    descricao: 'Checklist e textos prontos para Amazon KDP, Hotmart e outras plataformas.',
    preco: 'R$ 39,99',
    cor: '#00e5c3',
    tipo: 'pago',
  },
  {
    slug: 'material-marketing',
    icon: Megaphone,
    titulo: 'Material de Marketing',
    descricao: 'Copies para redes sociais, email marketing, anúncios e página de vendas.',
    preco: 'R$ 7,99–19,99',
    cor: '#facc15',
    tipo: 'pago',
  },
  {
    slug: 'traducao',
    icon: Globe,
    titulo: 'Tradução',
    descricao: 'Tradução literária fiel ao estilo original para qualquer idioma.',
    preco: 'R$ 29,99 / idioma',
    cor: '#06b6d4',
    tipo: 'pago',
  },
  {
    slug: 'ilustracoes',
    icon: Brush,
    titulo: 'Ilustrações',
    descricao: 'Briefings e prompts detalhados para criar ilustrações com IA generativa.',
    preco: 'R$ 9,99–14,99 / imagem',
    cor: '#a78bfa',
    tipo: 'pago',
  },
]

const EDICOES_CREDITOS: Ferramenta[] = [
  {
    slug: 'novo-capitulo',
    icon: PenTool,
    titulo: 'Criar novo capítulo',
    descricao: 'Escreva um capítulo inédito com introdução, desenvolvimento e gancho.',
    creditos: '488 créditos',
    cor: '#4f7fff',
    tipo: 'credito',
  },
  {
    slug: 'reescrever-capitulo',
    icon: RefreshCw,
    titulo: 'Reescrever capítulo inteiro',
    descricao: 'Reescreva um capítulo completo mantendo a essência com melhorias substanciais.',
    creditos: '735 créditos',
    cor: '#8b5cf6',
    tipo: 'credito',
  },
  {
    slug: 'reescrever-secao',
    icon: Scissors,
    titulo: 'Reescrever seção',
    descricao: 'Melhore uma seção específica: tom, fluidez, conteúdo ou estrutura.',
    creditos: '499 créditos',
    cor: '#ec4899',
    tipo: 'credito',
  },
  {
    slug: 'reescrever-paragrafo',
    icon: AlignLeft,
    titulo: 'Reescrever parágrafo',
    descricao: 'Receba 3 variações do parágrafo: mais impacto, mais clareza ou mais emoção.',
    creditos: '348 créditos',
    cor: '#f97316',
    tipo: 'credito',
  },
  {
    slug: 'corrigir-capitulo',
    icon: SpellCheck,
    titulo: 'Corrigir texto do capítulo',
    descricao: 'Revisão ortográfica, gramatical e de coesão com relatório das correções.',
    creditos: '116 créditos',
    cor: '#00e5c3',
    tipo: 'credito',
    badge: 'Mais Rápido',
  },
  {
    slug: 'analise-editorial',
    icon: BarChart2,
    titulo: 'Análise editorial do capítulo',
    descricao: 'Relatório editorial profissional: ritmo, coerência e sugestões concretas.',
    creditos: '65 créditos',
    cor: '#facc15',
    tipo: 'credito',
  },
  {
    slug: 'editar-texto-capa',
    icon: Type,
    titulo: 'Editar texto da capa',
    descricao: 'Título, subtítulo, tagline e contracapa com copywriting de impacto.',
    creditos: '498 créditos',
    cor: '#06b6d4',
    tipo: 'credito',
  },
  {
    slug: 'editar-estilo-capa',
    icon: Layers,
    titulo: 'Editar estilo da capa',
    descricao: 'Novas direções visuais: concept board, paleta atualizada e referências de arte.',
    creditos: '720 créditos',
    cor: '#a78bfa',
    tipo: 'credito',
  },
  {
    slug: 'metadados',
    icon: Database,
    titulo: 'Gerar metadados de publicação',
    descricao: 'SEO completo: descrição, palavras-chave, categorias BISAC e tags.',
    creditos: '260 créditos',
    cor: '#34d399',
    tipo: 'credito',
  },
  {
    slug: 'buscar-substituir',
    icon: Search,
    titulo: 'Buscar e substituir (todo livro)',
    descricao: 'Corrija inconsistências globais: nomes, termos e formatações em todo o manuscrito.',
    creditos: '30 créditos',
    cor: '#fb7185',
    tipo: 'credito',
    badge: 'Econômico',
  },
]

function CardFerramenta({ f }: { f: Ferramenta }) {
  const Icon = f.icon
  return (
    <Link
      href={`/dashboard/kit-ferramentas/${f.slug}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5 transition-all hover:border-[#2a3553] hover:bg-[#0f1523] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {f.badge && (
        <span
          className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: `${f.cor}22`, color: f.cor }}
        >
          {f.badge}
        </span>
      )}

      <div className="flex items-start gap-3">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{ background: `${f.cor}18` }}
        >
          <Icon className="size-5" style={{ color: f.cor }} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-sm font-semibold text-white leading-tight">{f.titulo}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#6b7a99]">{f.descricao}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {f.tipo === 'pago' ? (
          <span className="rounded-lg bg-[#4f7fff15] px-2.5 py-1 text-xs font-bold text-[#4f7fff]">
            {f.preco}
          </span>
        ) : (
          <span className="rounded-lg px-2.5 py-1 text-xs font-bold" style={{ background: `${f.cor}18`, color: f.cor }}>
            −{f.creditos}
          </span>
        )}
        <span className="flex items-center gap-1 text-[11px] text-[#3a4a66] transition group-hover:text-[#6b7a99]">
          Acessar <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  )
}

export default function KitFerramentasPage() {
  return (
    <div className="px-5 pt-6 pb-16 md:px-8 max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#4f7fff18]">
            <Wrench className="size-5 text-[#4f7fff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kit Ferramentas de Edição</h1>
            <p className="text-sm text-[#6b7a99]">IA especializada para cada etapa do seu livro</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#4f7fff30] bg-[#4f7fff0a] px-4 py-2.5">
            <Zap className="size-4 text-[#4f7fff]" />
            <span className="text-sm text-[#6b7a99]"><span className="font-semibold text-white">18 ferramentas</span> especializadas</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#00e5c330] bg-[#00e5c30a] px-4 py-2.5">
            <Crown className="size-4 text-[#00e5c3]" />
            <span className="text-sm text-[#6b7a99]">DeepSeek <span className="font-semibold text-[#00e5c3]">especialista</span> em cada área</span>
          </div>
        </div>
      </div>

      {/* Serviços pagos */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[#4f7fff30] to-transparent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4f7fff]">Serviços Premium · Pagamento direto em R$</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#4f7fff30] to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICOS_PAGOS.map(f => <CardFerramenta key={f.slug} f={f} />)}
        </div>
      </section>

      {/* Edições com créditos */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[#00e5c330] to-transparent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00e5c3]">Edições com Créditos · Aurora Builder</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#00e5c330] to-transparent" />
        </div>
        <p className="mb-4 text-xs text-[#3a4a66]">Use seus créditos para editar o livro com IA após a geração.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {EDICOES_CREDITOS.map(f => <CardFerramenta key={f.slug} f={f} />)}
        </div>
      </section>
    </div>
  )
}
