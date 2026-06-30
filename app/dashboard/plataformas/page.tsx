import { Globe2, ExternalLink } from 'lucide-react'

const PLATAFORMAS = [
  { nome: 'Hotmart', emoji: '🔥', comissao: '70–80%', prazo: '24h', dificuldade: 'Fácil', melhorPara: 'Iniciantes · Alto volume', descricao: 'Maior plataforma de infoprodutos do Brasil. Processo simples, saque via PIX.', href: 'https://hotmart.com', cor: '#f97316' },
  { nome: 'Amazon KDP', emoji: '📦', comissao: '35–70%', prazo: '24–72h', dificuldade: 'Médio', melhorPara: 'PDF/EPUB · Alcance global', descricao: 'Publique no maior marketplace do mundo. Royalties em dólar.', href: 'https://kdp.amazon.com', cor: '#f97316' },
  { nome: 'Gumroad', emoji: '🛒', comissao: '91%', prazo: 'Imediato', dificuldade: 'Fácil', melhorPara: 'Internacional · Sem burocracia', descricao: 'Plataforma internacional simples. Ideal para vender em dólar e euro.', href: 'https://gumroad.com', cor: '#ec4899' },
  { nome: 'Eduzz', emoji: '⚡', comissao: '70–85%', prazo: '48h', dificuldade: 'Fácil', melhorPara: 'Brasil · Afiliados', descricao: 'Plataforma brasileira robusta com sistema de afiliados e checkout otimizado.', href: 'https://eduzz.com', cor: '#4f7fff' },
  { nome: 'Kwik', emoji: '💎', comissao: '75–90%', prazo: '24h', dificuldade: 'Fácil', melhorPara: 'Checkout nativo · Mobile', descricao: 'Nova plataforma brasileira com checkout mobile otimizado e taxas baixas.', href: 'https://kwik.com.br', cor: '#a855f7' },
  { nome: 'Braip', emoji: '🇧🇷', comissao: '70–80%', prazo: '48h', dificuldade: 'Fácil', melhorPara: 'Brasil · PIX instantâneo', descricao: 'Plataforma brasileira com aprovação rápida e saque via PIX sem carência.', href: 'https://braip.com', cor: '#00e5c3' },
]

const DIFICULDADE: Record<string, { color: string }> = {
  Fácil:  { color: '#00e5c3' },
  Médio:  { color: '#f97316' },
  Avançado: { color: '#e53935' },
}

export default function PlataformasPage() {
  return (
    <div className="px-5 py-6 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#2554e0)', boxShadow: '0 4px 20px rgba(79,127,255,0.4)' }}>
          <Globe2 className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Plataformas de Venda</h1>
          <p className="text-sm text-[#a0b0c8]">Onde publicar e vender seu ebook para maximizar receita</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1c2438] overflow-hidden mb-6" style={{ background: '#0d1220' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c2438]" style={{ background: '#0b0f1c' }}>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#a0b0c8]">Plataforma</th>
              <th className="hidden px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#a0b0c8] sm:table-cell">Comissão</th>
              <th className="hidden px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#a0b0c8] md:table-cell">Aprovação</th>
              <th className="hidden px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#a0b0c8] lg:table-cell">Dificuldade</th>
              <th className="hidden px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#a0b0c8] xl:table-cell">Melhor para</th>
              <th className="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2438]">
            {PLATAFORMAS.map(({ nome, emoji, comissao, prazo, dificuldade, melhorPara, href }) => {
              const d = DIFICULDADE[dificuldade]
              return (
                <tr key={nome} className="transition hover:bg-white/5">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{emoji}</span>
                      <p className="text-[13px] font-bold text-white">{nome}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <span className="text-[13px] font-bold text-[#00e5c3]">{comissao}</span>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <span className="text-[13px] text-[#a0b0c8]">{prazo}</span>
                  </td>
                  <td className="hidden px-4 py-4 lg:table-cell">
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: `${d.color}18`, color: d.color }}>
                      {dificuldade}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 xl:table-cell">
                    <span className="text-[12px] text-[#a0b0c8]">{melhorPara}</span>
                  </td>
                  <td className="px-4 py-4">
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] px-3 py-1.5 text-[11px] font-semibold text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white"
                      style={{ background: '#0b0f1c' }}>
                      Cadastrar <ExternalLink className="size-3" />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATAFORMAS.map(({ nome, emoji, comissao, dificuldade, melhorPara, descricao, href, cor }) => {
          const d = DIFICULDADE[dificuldade]
          return (
            <div key={nome} className="flex flex-col rounded-xl border border-[#1c2438] overflow-hidden transition hover:-translate-y-0.5 hover:border-[#2a3553]" style={{ background: '#0d1220' }}>
              <div className="h-0.5 w-full" style={{ background: cor }} />
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-[13px] font-bold text-white">{nome}</p>
                    <p className="text-[11px] text-[#8896b0]">{melhorPara}</p>
                  </div>
                  <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${d.color}18`, color: d.color }}>{dificuldade}</span>
                </div>
                <p className="mb-4 text-[12px] leading-relaxed text-[#a0b0c8]">{descricao}</p>
                <div className="mt-auto flex items-center justify-between border-t border-[#1c2438] pt-3">
                  <div>
                    <p className="text-[11px] text-[#8896b0]">Comissão</p>
                    <p className="text-[13px] font-bold text-[#00e5c3]">{comissao}</p>
                  </div>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg py-2 px-3 text-[11px] font-bold text-white transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                    Cadastrar <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
