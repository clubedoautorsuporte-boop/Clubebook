import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Zap, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const credits = 1000
  const ebooksCount = 0
  const creditsBought = 0
  const creditsUsed = 0

  const creditPackages = [
    { id: 1, credits: 20000, price: 179.99, popular: false, discount: 10, realValue: 200 },
    { id: 2, credits: 50000, price: 439.99, popular: true, discount: 12, realValue: 500 },
    { id: 3, credits: 100000, price: 849.99, popular: false, discount: 15, realValue: 1000 },
  ]

  const services = [
    { category: 'Serviços Principais (pagamento direto em R$)', items: [
      { name: 'Escrita do Livro (geração completa)', cost: 'R$ 49,99' },
      { name: 'Capa Profissional (4 variações)', cost: 'R$ 99,99' },
      { name: 'Ajuste de Capa', cost: 'R$ 19,99' },
      { name: 'Audiobook Premium', cost: 'R$ 499,99' },
      { name: 'Preparação para Publicação', cost: 'R$ 29,99' },
      { name: 'Material de Marketing (por peça)', cost: 'R$ 7,99–19,99' },
      { name: 'Tradução (por idioma)', cost: 'R$ 29,99' },
      { name: 'Ilustrações (por imagem)', cost: 'R$ 9,99–14,99' },
    ] },
    { category: 'Edições com Créditos (Aurora Builder)', subtext: 'Use créditos para editar seu livro após a geração', items: [
      { name: 'Criar novo capítulo', credits: '~480 créditos' },
      { name: 'Reescrever capítulo inteiro', credits: '~735 créditos' },
      { name: 'Reescrever seção', credits: '~490 créditos' },
      { name: 'Reescrever parágrafo', credits: '~240 créditos' },
      { name: 'Corrigir texto do capítulo', credits: '~110 créditos' },
      { name: 'Análise editorial do capítulo', credits: '~65 créditos' },
      { name: 'Editar texto da capa', credits: '~490 créditos' },
      { name: 'Editar estilo da capa', credits: '~720 créditos' },
      { name: 'Gerar metadados de publicação', credits: '~260 créditos' },
      { name: 'Buscar e substituir (todo livro)', credits: '~30 créditos' },
    ] },
  ]

  const transactions = [
    { id: 1, type: 'Compra', description: 'Bonus: Boas-vindas 1.000 créditos para explorar a plataforma', credits: '+1,000', date: '22 de jun, 1:49' },
  ]

  return (
    <div className="px-5 pt-6 md:px-8 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Meus Créditos</h1>
        <p className="text-[#6b7a99]">Compre créditos e use em qualquer serviço de plataforma</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Saldo disponível - maior */}
        <div className="lg:col-span-1 rounded-2xl border border-[#1c2438] bg-gradient-to-br from-[#0a5e55] to-[#051a15] p-6">
          <p className="text-sm text-[#6b7a99] mb-2">Saldo disponível</p>
          <p className="text-5xl font-bold text-[#00e5c3] mb-1">{credits.toLocaleString()}</p>
          <p className="text-xs text-[#6b7a99]">Equivalente a R$ {(credits / 100).toFixed(2)}</p>
        </div>

        {/* Total comprado */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6">
          <p className="text-sm text-[#6b7a99] mb-2">Total comprado</p>
          <p className="text-4xl font-bold text-white">{creditsBought}</p>
        </div>

        {/* Total utilizado */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6">
          <p className="text-sm text-[#6b7a99] mb-2">Total utilizado</p>
          <p className="text-4xl font-bold text-white">{creditsUsed}</p>
        </div>
      </div>

      {/* Comprar Créditos */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="size-5 text-[#4f7fff]" />
          <h2 className="text-xl font-bold text-white">Comprar Créditos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPackages.map(pkg => (
            <div
              key={pkg.id}
              className={cn(
                'rounded-2xl border-2 p-6 transition',
                pkg.popular
                  ? 'border-[#00e5c3] bg-gradient-to-br from-[#00e5c315] to-[#0a5e5515]'
                  : 'border-[#1c2438] bg-[#0f1523] hover:border-[#4f7fff40]',
              )}
            >
              {pkg.popular && (
                <div className="mb-3 inline-block rounded-full bg-[#00e5c3] px-3 py-1 text-xs font-bold text-[#040810]">
                  MAIS POPULAR
                </div>
              )}

              <p className="text-3xl font-bold text-white mb-1">{(pkg.credits / 1000).toFixed(0)}{pkg.credits >= 1000 && '00'}</p>
              <p className="text-sm text-[#6b7a99] mb-4">Créditos</p>

              <p className={cn('text-2xl font-bold mb-2', pkg.popular ? 'text-[#00e5c3]' : 'text-white')}>
                R$ {pkg.price.toFixed(2)}
              </p>

              <div className="mb-6">
                <p className="text-xs text-[#00e5c3]">Economia de {pkg.discount}%</p>
                <p className="text-xs text-[#6b7a99]">Valor real: R$ {pkg.realValue.toFixed(2)}</p>
              </div>

              <button
                className={cn(
                  'w-full rounded-xl py-3 text-sm font-bold transition',
                  pkg.popular
                    ? 'bg-[#00e5c3] text-[#040810] hover:bg-[#00cfb0]'
                    : 'border border-[#1c2438] text-white hover:border-[#4f7fff40]',
                )}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Custos */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Tabela de Custos por Serviço</h3>
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] overflow-hidden">
          {services.map((section, sectionIdx) => (
            <div key={sectionIdx} className={sectionIdx > 0 ? 'border-t border-[#1c2438]' : ''}>
              <div className="bg-[#080b14] px-6 py-3 border-b border-[#1c2438]">
                <p className="text-sm font-bold text-white">{section.category}</p>
                {section.subtext && <p className="text-xs text-[#6b7a99] mt-0.5">{section.subtext}</p>}
              </div>
              <div className="divide-y divide-[#1c2438]">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={cn('flex justify-between px-6 py-3', itemIdx % 2 === 0 ? 'bg-[#0a0e17]' : 'bg-[#0f1523]')}>
                    <span className="text-sm text-[#c4d0e8]">{item.name}</span>
                    <span className="text-sm text-[#00e5c3] font-semibold text-right">
                      {item.cost || item.credits}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[10px] text-[#3a4a66] px-6 py-3 bg-[#080b14]">
            Os custos incluem uma taxa base + tempo de processamento da Aurora. O valor final pode variar conforme a complexidade da tarefa. 100 créditos = R$ 1,00.
          </p>
        </div>
      </div>

      {/* Histórico */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Histórico de Transações</h3>
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-[#6b7a99]">Nenhuma transação</div>
          ) : (
            <div className="divide-y divide-[#1c2438]">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-6 hover:bg-[#080b14] transition">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#4f7fff15]">
                      <TrendingDown className="size-5 text-[#4f7fff]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tx.description}</p>
                      <p className="text-xs text-[#6b7a99] mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#00e5c3]">{tx.credits}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
