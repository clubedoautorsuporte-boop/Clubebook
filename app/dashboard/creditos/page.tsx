import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Zap, ShoppingCart } from 'lucide-react'

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, deliveries: { select: { id: true } } },
  })

  const credits = user?.credits ?? 1300
  const ebooksCount = user?.deliveries.length ?? 0

  const creditPackages = [
    { id: 1, credits: 500, price: 29.90, label: '500 Créditos', discount: '' },
    { id: 2, credits: 1000, price: 49.90, label: '1.000 Créditos', discount: '5% off' },
    { id: 3, credits: 2500, price: 99.90, label: '2.500 Créditos', discount: '20% off' },
    { id: 4, credits: 5000, price: 179.90, label: '5.000 Créditos', discount: '28% off' },
  ]

  return (
    <div className="px-5 pt-6 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meus Créditos</h1>
        <p className="text-[#6b7a99]">Gerencie seus créditos para criar ebooks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Saldo atual */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff20]">
              <Zap className="size-5 text-[#4f7fff]" />
            </div>
            <span className="text-sm text-[#6b7a99]">Saldo Disponível</span>
          </div>
          <p className="text-4xl font-bold text-white">{credits.toLocaleString()}</p>
          <p className="text-xs text-[#3a4a66] mt-2">Créditos</p>
        </div>

        {/* Ebooks criados */}
        <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00e5c320]">
              <ShoppingCart className="size-5 text-[#00e5c3]" />
            </div>
            <span className="text-sm text-[#6b7a99]">Ebooks Criados</span>
          </div>
          <p className="text-4xl font-bold text-white">{ebooksCount}</p>
          <p className="text-xs text-[#3a4a66] mt-2">Total de ebooks</p>
        </div>
      </div>

      {/* Packages */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Comprar Créditos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map(pkg => (
            <div key={pkg.id} className="rounded-xl border border-[#1c2438] bg-[#0f1523] p-4 hover:border-[#4f7fff40] transition">
              {pkg.discount && (
                <div className="mb-2 inline-block rounded-full bg-[#00e5c315] px-2 py-1 text-xs font-bold text-[#00e5c3]">
                  {pkg.discount}
                </div>
              )}
              <p className="text-sm font-bold text-white mb-1">{pkg.label}</p>
              <p className="text-2xl font-bold text-[#4f7fff] mb-4">R$ {pkg.price.toFixed(2)}</p>
              <button className="w-full rounded-lg bg-[#4f7fff] py-2 text-sm font-bold text-white transition hover:bg-[#3d63ff] disabled:opacity-40">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-[#1c2438] bg-[#0f1523] p-6">
        <h3 className="font-bold text-white mb-3">Como funcionam os créditos?</h3>
        <ul className="space-y-2 text-sm text-[#6b7a99]">
          <li>• Cada ebook criado consome 1 crédito</li>
          <li>• Você começa com 1.300 créditos grátis</li>
          <li>• Indique amigos e ganhe bônus de créditos</li>
          <li>• Créditos não expiram</li>
        </ul>
      </div>
    </div>
  )
}
