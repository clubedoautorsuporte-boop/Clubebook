import { Globe2, ExternalLink } from 'lucide-react'

const PLATAFORMAS = [
  {
    nome: 'Hotmart',
    emoji: '🔥',
    comissao: '70–80%',
    prazo: '24h',
    dificuldade: 'Fácil',
    melhorPara: 'Iniciantes · Alto volume',
    descricao: 'Maior plataforma de infoprodutos do Brasil. Processo simples, saque via PIX.',
    href: 'https://hotmart.com',
    cor: 'from-orange-500/20 to-red-500/10',
    bordaCor: 'border-orange-500/20',
    tagCor: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    nome: 'Amazon KDP',
    emoji: '📦',
    comissao: '35–70%',
    prazo: '24–72h',
    dificuldade: 'Médio',
    melhorPara: 'PDF/EPUB · Alcance global',
    descricao: 'Publique no maior marketplace do mundo. Royalties em dólar.',
    href: 'https://kdp.amazon.com',
    cor: 'from-yellow-500/20 to-amber-500/10',
    bordaCor: 'border-yellow-500/20',
    tagCor: 'bg-amber-500/20 text-amber-400',
  },
  {
    nome: 'Gumroad',
    emoji: '🛒',
    comissao: '91%',
    prazo: 'Imediato',
    dificuldade: 'Fácil',
    melhorPara: 'Internacional · Sem burocracia',
    descricao: 'Plataforma internacional simples. Ideal para vender em dólar e euro.',
    href: 'https://gumroad.com',
    cor: 'from-pink-500/20 to-rose-500/10',
    bordaCor: 'border-pink-500/20',
    tagCor: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    nome: 'Eduzz',
    emoji: '⚡',
    comissao: '70–85%',
    prazo: '48h',
    dificuldade: 'Fácil',
    melhorPara: 'Brasil · Afiliados',
    descricao: 'Plataforma brasileira robusta com sistema de afiliados e checkout otimizado.',
    href: 'https://eduzz.com',
    cor: 'from-blue-500/20 to-cyan-500/10',
    bordaCor: 'border-blue-500/20',
    tagCor: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    nome: 'Kwik',
    emoji: '💎',
    comissao: '75–90%',
    prazo: '24h',
    dificuldade: 'Fácil',
    melhorPara: 'Checkout nativo · Mobile',
    descricao: 'Nova plataforma brasileira com checkout mobile otimizado e taxas baixas.',
    href: 'https://kwik.com.br',
    cor: 'from-purple-500/20 to-violet-500/10',
    bordaCor: 'border-purple-500/20',
    tagCor: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    nome: 'Braip',
    emoji: '🇧🇷',
    comissao: '70–80%',
    prazo: '48h',
    dificuldade: 'Fácil',
    melhorPara: 'Brasil · PIX instantâneo',
    descricao: 'Plataforma brasileira com aprovação rápida e saque via PIX sem carência.',
    href: 'https://braip.com',
    cor: 'from-green-500/20 to-emerald-500/10',
    bordaCor: 'border-green-500/20',
    tagCor: 'bg-[#00e5c320] text-[#00e5c3]',
  },
]

const COR_DIFICULDADE: Record<string, string> = {
  Fácil: 'bg-[#00e5c320] text-[#00e5c3]',
  Médio: 'bg-amber-500/20 text-amber-400',
  Avançado: 'bg-red-500/20 text-red-400',
}

export default function PlataformasPage() {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Globe2 className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Plataformas de Venda</h1>
          <p className="text-sm text-[#6b7a99]">Onde publicar e vender seu ebook para maximizar receita</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATAFORMAS.map(({ nome, emoji, comissao, prazo, dificuldade, melhorPara, descricao, href, cor, bordaCor, tagCor }) => (
          <div
            key={nome}
            className={`relative flex flex-col overflow-hidden rounded-2xl border ${bordaCor} bg-gradient-to-br ${cor} p-5`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-bold text-white">{nome}</p>
                <p className="text-[11px] text-[#6b7a99]">{melhorPara}</p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-[#8899b8]">{descricao}</p>

            <div className="mt-auto space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6b7a99]">Comissão do criador</span>
                <span className="font-bold text-[#00e5c3]">{comissao}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6b7a99]">Aprovação</span>
                <span className="text-white">{prazo}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6b7a99]">Dificuldade</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${COR_DIFICULDADE[dificuldade]}`}>
                  {dificuldade}
                </span>
              </div>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cadastrar nesta plataforma
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
