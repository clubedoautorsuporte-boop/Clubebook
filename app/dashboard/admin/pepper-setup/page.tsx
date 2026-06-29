import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Copy } from 'lucide-react'

type PepperOffer = {
  hash: string
  title: string
  price: number
  status: string
  payment_url: string
}

type PepperProduct = {
  hash: string
  name: string
  offers: PepperOffer[]
}

async function getPepperData(): Promise<{ products: PepperProduct[]; error?: string }> {
  const token = process.env.PEPPER_API_TOKEN
  if (!token || token === 'seu_token_aqui') {
    return { products: [], error: 'PEPPER_API_TOKEN não configurado no .env.local' }
  }

  try {
    const res = await fetch('https://api.cloud.pepperpay.com.br/public/v1/products', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
    const data = await res.json() as { success?: boolean; data?: PepperProduct[]; message?: string }

    if (!data.success) return { products: [], error: `${data.message ?? 'Erro na API Pepper'} | Status HTTP: ${res.status} | Resposta: ${JSON.stringify(data)}` }
    return { products: data.data ?? [] }
  } catch (err) {
    return { products: [], error: String(err) }
  }
}

export default async function PepperSetupPage() {
  const session = await auth()
  if (session?.user?.email !== 'clubedoautor.suporte@gmail.com') redirect('/dashboard')

  const { products, error } = await getPepperData()

  return (
    <div className="px-5 pt-6 pb-16 md:px-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">🔧 Setup Pepper API</h1>
        <p className="text-sm text-[#6b7a99] mt-1">Copie os offer hashes e cole no .env.local e na Vercel</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <p className="text-sm font-semibold text-red-400">Erro: {error}</p>
          <div className="mt-4 rounded-xl bg-[#080b14] border border-[#1c2438] p-4">
            <p className="text-xs text-[#6b7a99] mb-2">Adicione no .env.local:</p>
            <code className="text-xs text-[#00e5c3]">PEPPER_API_TOKEN=seu_token_da_pepper</code>
            <p className="text-[11px] text-[#3a4a66] mt-2">Token em: app.pepper.com.br → Configurações → API → Copiar token</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-8 text-center">
          <p className="text-[#6b7a99]">Nenhum produto encontrado na sua conta Pepper.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.hash} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] overflow-hidden">
              <div className="border-b border-[#1c2438] bg-[#080b14] px-5 py-3.5">
                <p className="font-bold text-white">{product.name}</p>
                <p className="text-[11px] text-[#3a4a66] font-mono mt-0.5">Product hash: {product.hash}</p>
              </div>

              {product.offers?.length > 0 ? (
                <div className="divide-y divide-[#1c2438]">
                  {product.offers.map(offer => (
                    <div key={offer.hash} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{offer.title}</p>
                        <p className="text-xs text-[#6b7a99] mt-0.5">
                          R$ {(offer.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          {' · '}
                          <span className="text-[#3a4a66]">Status: {offer.status}</span>
                        </p>
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#080b14] border border-[#1c2438] px-3 py-1.5">
                          <span className="text-[11px] text-[#6b7a99]">offer_hash:</span>
                          <code className="text-[11px] font-mono font-bold text-[#00e5c3]">{offer.hash}</code>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] text-[#3a4a66] mb-1">Copie para o .env:</p>
                        <code className="block text-[10px] text-[#4f7fff] bg-[#4f7fff08] rounded px-2 py-1">
                          PEPPER_OFFER_HASH_XXK={offer.hash}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-4 text-sm text-[#3a4a66]">Nenhuma oferta encontrada neste produto.</p>
              )}
            </div>
          ))}

          {/* Resumo para copiar */}
          <div className="rounded-2xl border border-[#4f7fff30] bg-[#4f7fff08] p-5">
            <p className="text-sm font-bold text-white mb-3">📋 Cole no .env.local e na Vercel:</p>
            <pre className="text-xs text-[#00e5c3] font-mono leading-relaxed whitespace-pre-wrap">
{`PEPPER_API_TOKEN=${process.env.PEPPER_API_TOKEN ?? 'seu_token'}
${products.flatMap(p => p.offers ?? []).map((o, i) =>
  `PEPPER_OFFER_HASH_${i === 0 ? '20K' : i === 1 ? '50K' : '100K'}=${o.hash}`
).join('\n')}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
