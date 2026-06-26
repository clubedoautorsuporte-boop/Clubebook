import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Zap, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, deliveries: { select: { id: true } } },
  })

  const credits = user?.credits ?? 1000
  const ebooksCount = user?.deliveries.length ?? 0
  const creditsBought = 0
  const creditsUsed = 0

  const creditPackages = [
    { id: 1, credits: 20000, price: 179.99, popular: false, discount: 8 },
    { id: 2, credits: 50000, price: 439.99, popular: true, discount: 12 },
    { id: 3, credits: 100000, price: 849.99, popular: false, discount: 9 },
  ]

  const services = [
    { name: 'Ebook do Livro (página completa)', cost: 'R$ 60,00', credits: '-50 créditos' },
    { name: 'Edição Profissional (& categorias)', cost: 'R$ 80,00', credits: '-60 créditos' },
    { name: 'Ajuste de Capa', cost: 'R$ 30,00', credits: '-10 créditos' },
    { name: 'Audiobook Premium', cost: 'R$ 100,00', credits: '-80 créditos' },
    { name: 'Preparação para Publicação', cost: 'R$ 25,00', credits: '-25 créditos' },
    { name: 'Manual de Marketing (por página)', cost: 'R$ 15,00', credits: '-5/20 créditos' },
    { name: 'Tradução (por página)', cost: 'R$ 25,00', credits: '-20 créditos' },
    { name: 'Subtítulos (por imagem)', cost: 'R$ 5,00', credits: '-5/30-14,000' },
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
          <p className="text-xs text-[#6b7a99]">Equivalente a R$ 0,00</p>
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

              <p className="text-xs text-[#00e5c3] mb-6">Economiza de {pkg.discount}%</p>

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#1c2438] bg-[#080b14]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-[#6b7a99]">Serviço</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase text-[#6b7a99]">Preço</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase text-[#6b7a99]">Créditos</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <tr key={i} className={cn('border-b border-[#1c2438]', i % 2 === 0 ? 'bg-[#0a0e17]' : 'bg-[#0f1523]')}>
                    <td className="px-6 py-3 text-[#c4d0e8]">{service.name}</td>
                    <td className="px-6 py-3 text-right text-white">{service.cost}</td>
                    <td className="px-6 py-3 text-right text-[#00e5c3] font-semibold">{service.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#3a4a66] px-6 py-2 bg-[#080b14]">
            Os custos listados são uma referência. O valor exato de uma transação pode variar. Lembre-se de que todos têm uma forma de organização. O crédito é em R$ 1 em um serviço.
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
