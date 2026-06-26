import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Zap, Check, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComprarButton } from './comprar-button'

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const credits = (session.user as { credits?: number })?.credits ?? 1000
  const creditsBought = 0
  const creditsUsed = 0

  const packages = [
    { credits: 20000,  price: 179.99, discount: 10, realValue: 200,  popular: false },
    { credits: 50000,  price: 439.99, discount: 12, realValue: 500,  popular: true  },
    { credits: 100000, price: 849.99, discount: 15, realValue: 1000, popular: false },
  ]

  const services = [
    {
      title: 'Serviços Principais (pagamento direto em R$)',
      items: [
        { name: 'Escrita do Livro (geração completa)',   value: 'R$ 49,99'       },
        { name: 'Capa Profissional (4 variações)',        value: 'R$ 99,99'       },
        { name: 'Ajuste de Capa',                         value: 'R$ 19,99'       },
        { name: 'Audiobook Premium',                      value: 'R$ 409,99'      },
        { name: 'Preparação para Publicação',             value: 'R$ 39,99'       },
        { name: 'Material de Marketing (por peça)',       value: 'R$ 7,99–19,99'  },
        { name: 'Tradução (por idioma)',                  value: 'R$ 29,99'       },
        { name: 'Ilustrações (por imagem)',               value: 'R$ 9,99–14,99'  },
      ],
    },
    {
      title: 'Edições com Créditos (Aurora Builder)',
      subtitle: 'Use créditos para editar seu livro após a geração',
      items: [
        { name: 'Criar novo capítulo',                value: '-488 créditos'  },
        { name: 'Reescrever capítulo inteiro',         value: '-735 créditos'  },
        { name: 'Reescrever seção',                   value: '-499 créditos'  },
        { name: 'Reescrever parágrafo',               value: '-348 créditos'  },
        { name: 'Corrigir texto do capítulo',         value: '-116 créditos'  },
        { name: 'Análise editorial do capítulo',      value: '-65 créditos'   },
        { name: 'Editar texto da capa',               value: '-498 créditos'  },
        { name: 'Editar estilo da capa',              value: '-720 créditos'  },
        { name: 'Gerar metadados de publicação',      value: '-260 créditos'  },
        { name: 'Buscar e substituir (todo livro)',   value: '-30 créditos'   },
      ],
    },
  ]

  const transactions = [
    {
      badge: 'Presente',
      badgeColor: 'bg-[#4f7fff22] text-[#4f7fff]',
      description: 'Boas-vindas! 1.000 créditos para explorar a plataforma',
      amount: '+1.000',
      balance: '1.000',
      date: '25 de Jun. de 2026',
    },
  ]

  return (
    <div className="px-5 pt-6 pb-12 md:px-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Meus Créditos</h1>
        <p className="mt-0.5 text-sm text-[#6b7a99]">Compre créditos e use em qualquer serviço da plataforma</p>
      </div>

      {/* ── Saldo + Stats ── */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Saldo disponível */}
        <div className="rounded-2xl border border-[#00e5c320] bg-gradient-to-br from-[#071e1a] to-[#040e0c] p-5">
          <p className="mb-3 text-xs text-[#6b7a99]">Saldo disponível</p>
          <p className="text-4xl font-extrabold leading-none text-[#00e5c3]">
            {credits.toLocaleString('pt-BR')}
            <span className="ml-1.5 text-base font-semibold text-[#00e5c3]/60">créditos</span>
          </p>
          <p className="mt-2 text-xs text-[#3a4a66]">
            Equivalente a R$ {(credits / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total comprado */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
          <p className="mb-3 text-xs text-[#6b7a99]">Total comprado</p>
          <p className="text-4xl font-extrabold leading-none text-white">
            {creditsBought.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Total utilizado */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
          <p className="mb-3 text-xs text-[#6b7a99]">Total utilizado</p>
          <p className="text-4xl font-extrabold leading-none text-white">
            {creditsUsed.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* ── Comprar Créditos ── */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-2">
          <Zap className="size-4 text-[#4f7fff]" />
          <h2 className="text-base font-bold text-white">Comprar Créditos</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={cn(
                'relative flex flex-col rounded-2xl border-2 p-6 transition',
                pkg.popular
                  ? 'border-[#00e5c3] bg-[#00e5c30a]'
                  : 'border-[#1c2438] bg-[#0b0f1c] hover:border-[#1c2438]/80',
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#00e5c3] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#040810]">
                    MAIS POPULAR
                  </span>
                </div>
              )}

              {/* Credits */}
              <p className="text-4xl font-extrabold text-white">
                {pkg.credits.toLocaleString('pt-BR')}
              </p>
              <p className="mb-4 text-sm text-[#6b7a99]">créditos</p>

              {/* Price */}
              <p className={cn('mb-3 text-2xl font-bold', pkg.popular ? 'text-[#00e5c3]' : 'text-white')}>
                R$ {pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>

              {/* Discount */}
              <div className="mb-6 flex flex-col gap-0.5">
                <span className="flex items-center gap-1 text-xs text-[#00e5c3]">
                  <Check className="size-3" /> Economia de {pkg.discount}%
                </span>
                <span className="text-xs text-[#3a4a66]">
                  Valor real R$ {pkg.realValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <ComprarButton popular={pkg.popular} credits={pkg.credits} price={pkg.price} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabela de Custos ── */}
      <div className="mb-8">
        <h2 className="mb-4 text-base font-bold text-white">Tabela de Custos por Serviço</h2>

        <div className="overflow-hidden rounded-2xl border border-[#1c2438]">
          {services.map((section, si) => (
            <div key={si}>
              {/* Section header */}
              <div className={cn('border-b border-[#1c2438] bg-[#080b14] px-5 py-3', si > 0 && 'border-t border-[#1c2438]')}>
                <p className="text-[13px] font-semibold text-white">{section.title}</p>
                {section.subtitle && (
                  <p className="mt-0.5 text-[11px] text-[#3a4a66]">{section.subtitle}</p>
                )}
              </div>

              {/* Rows */}
              {section.items.map((item, ii) => (
                <div
                  key={ii}
                  className={cn(
                    'flex items-center justify-between px-5 py-3',
                    ii % 2 === 0 ? 'bg-[#080b14]' : 'bg-[#0b0f1c]',
                  )}
                >
                  <span className="text-sm text-[#b0bdd4]">{item.name}</span>
                  <span className={cn(
                    'text-sm font-semibold tabular-nums',
                    item.value.startsWith('-') ? 'text-[#4f7fff]' : 'text-[#00e5c3]',
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Footer note */}
          <p className="border-t border-[#1c2438] bg-[#080b14] px-5 py-3 text-[10px] leading-relaxed text-[#3a4a66]">
            Os custos incluem uma taxa base + tempo de processamento da Aurora.
            O valor final pode variar conforme a complexidade da tarefa. 100 créditos = R$ 1,00.
          </p>
        </div>
      </div>

      {/* ── Histórico de Transações ── */}
      <div>
        <h2 className="mb-4 text-base font-bold text-white">Histórico de Transações</h2>

        <div className="overflow-hidden rounded-2xl border border-[#1c2438]">
          {transactions.length === 0 ? (
            <p className="p-6 text-center text-sm text-[#6b7a99]">Nenhuma transação ainda.</p>
          ) : (
            <div className="divide-y divide-[#1c2438]">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-[#080b14] transition">
                  {/* Icon */}
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4f7fff15]">
                    <Gift className="size-5 text-[#4f7fff]" />
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider', tx.badgeColor)}>
                        {tx.badge}
                      </span>
                    </div>
                    <p className="truncate text-sm text-[#c4d0e8]">{tx.description}</p>
                  </div>

                  {/* Amount + date */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#00e5c3]">{tx.amount}</p>
                    <p className="text-[10px] text-[#3a4a66]">Saldo: {tx.balance}</p>
                    <p className="mt-0.5 text-[10px] text-[#3a4a66]">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
