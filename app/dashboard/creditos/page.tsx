import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Zap, Check, Gift, Gem, TrendingUp, History } from 'lucide-react'
import { ComprarButton } from './comprar-button'

const PACOTES = [
  {
    id: 'starter',
    nome: 'Starter',
    creditos: 20000,
    preco: 'R$ 179,99',
    precoNum: 179.99,
    desc: 'Ideal para começar e testar a plataforma',
    features: ['~20 ebooks completos', 'PDF, DOCX e EPUB', 'Suporte por email', 'Sem vencimento'],
    destaque: false,
    cor: '#4f7fff',
    g: 'linear-gradient(135deg,#4f7fff,#2554e0)',
    s: 'rgba(79,127,255,0.4)',
  },
  {
    id: 'pro',
    nome: 'Pro',
    creditos: 50000,
    preco: 'R$ 439,99',
    precoNum: 439.99,
    desc: 'Para quem quer revender e escalar',
    features: ['~50 ebooks completos', 'PDF, DOCX e EPUB', 'Suporte prioritário', 'Sem vencimento', 'Economize 18%'],
    destaque: true,
    cor: '#a855f7',
    g: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    s: 'rgba(168,85,247,0.4)',
  },
  {
    id: 'ultra',
    nome: 'Ultra',
    creditos: 100000,
    preco: 'R$ 849,99',
    precoNum: 849.99,
    desc: 'Máxima produção para agências e revendedores',
    features: ['~100 ebooks completos', 'PDF, DOCX e EPUB', 'Suporte VIP 24h', 'Sem vencimento', 'Economize 29%'],
    destaque: false,
    cor: '#f97316',
    g: 'linear-gradient(135deg,#f97316,#ea580c)',
    s: 'rgba(249,115,22,0.4)',
  },
]

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const creditos = (session.user as Record<string, unknown>).creditos as number ?? 0
  const userEmail = session.user.email ?? ''
  const userName = session.user.name ?? ''

  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
          <Zap className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Créditos</h1>
          <p className="text-sm text-[#6b7a99]">Compre créditos para gerar ebooks com IA</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Saldo atual', value: creditos.toLocaleString('pt-BR'), sub: 'créditos disponíveis', icon: Zap, g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: 'rgba(79,127,255,0.5)' },
          { label: 'Ebooks possíveis', value: Math.floor(creditos / 1000), sub: '~1.000 créditos por ebook', icon: TrendingUp, g: 'linear-gradient(135deg,#00e5c3,#00b09b)', s: 'rgba(0,229,195,0.5)' },
          { label: 'Bônus acumulados', value: 0, sub: 'via indicações', icon: Gift, g: 'linear-gradient(135deg,#a855f7,#7c3aed)', s: 'rgba(168,85,247,0.5)' },
        ].map(({ label, value, sub, icon: Icon, g, s }) => (
          <div key={label} className="overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="flex h-full">
              <div className="grid w-[64px] shrink-0 place-items-center" style={{ background: g, boxShadow: s }}>
                <Icon className="size-6 text-white" />
              </div>
              <div className="flex flex-col justify-center p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7a99]">{label}</p>
                <p className="text-2xl font-black text-white tabular-nums">{value}</p>
                <p className="text-[10px] text-[#3a4a66]">{sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-white">Escolha um pacote</h2>
        <p className="text-[12px] text-[#6b7a99]">Pagamento único · sem mensalidade · créditos sem vencimento</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {PACOTES.map(({ id, nome, creditos: cred, preco, precoNum, desc, features, destaque, g, s, cor }) => (
          <div key={id} className={`relative flex flex-col rounded-xl border overflow-hidden ${destaque ? 'border-[#a855f7]' : 'border-[#1c2438]'}`} style={{ background: '#0d1220' }}>
            {destaque && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: g }} />}
            {destaque && (
              <div className="flex justify-center pt-3">
                <span className="rounded-full px-3 py-0.5 text-[10px] font-bold text-white" style={{ background: g }}>
                  Mais popular
                </span>
              </div>
            )}
            <div className="flex flex-col flex-1 p-5 pt-4">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl" style={{ background: g, boxShadow: `0 4px 20px ${s}` }}>
                <Gem className="size-5 text-white" />
              </div>
              <h3 className="text-[16px] font-extrabold text-white">{nome}</h3>
              <p className="mt-0.5 text-[11px] text-[#6b7a99]">{desc}</p>
              <div className="my-4 border-t border-[#1c2438]" />
              <p className="text-2xl font-extrabold text-white">{preco}</p>
              <p className="text-[11px] text-[#3a4a66]">{(cred / 1000).toFixed(0)}k créditos</p>
              <div className="my-4 space-y-2">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="grid h-4 w-4 place-items-center rounded-full" style={{ background: `${cor}20` }}>
                      <Check className="size-2.5" style={{ color: cor }} />
                    </div>
                    <span className="text-[11px] text-[#6b7a99]">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <ComprarButton popular={destaque} credits={cred} price={precoNum} userEmail={userEmail} userName={userName} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Histórico */}
      <div className="mt-8 rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
        <div className="flex items-center gap-2 border-b border-[#1c2438] px-5 py-4">
          <History className="size-4 text-[#3a4a66]" />
          <h2 className="text-[14px] font-bold text-white">Histórico de compras</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl" style={{ background: '#0b0f1c' }}>
            <History className="size-5 text-[#3a4a66]" />
          </div>
          <p className="text-[13px] font-semibold text-white">Sem histórico ainda</p>
          <p className="text-[11px] text-[#3a4a66]">Suas compras aparecerão aqui</p>
        </div>
      </div>
    </div>
  )
}
