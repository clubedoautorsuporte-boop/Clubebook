import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Download, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'
import { ChaptersList, FaqList, PricingBlock } from '@/app/receiver/[slug]/receiver-client'
import HolographicCard from '@/components/ui/holographic-card'
import { EditorialPlan } from '@/app/receiver/[slug]/editorial-plan'
import { PublicationPipeline } from '@/components/publication-pipeline'

const SLUG_RE = /^[a-f0-9]{32}$/
import { SERVICOS } from '@/lib/servicos-data'

type Props = { params: Promise<{ slug: string }> }

export default async function BibliotecaLivroPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson: plan, nomeAutor } = delivery
  const capitulos = plan.capitulos ?? []
  const sampleBlocos = capitulos[0]?.blocos?.slice(0, 3) ?? []

  return (
    <div className="min-h-full pb-16">

      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 mb-2">
        <Link href="/dashboard/projetos"
          className="flex items-center gap-2 text-[12px] font-semibold transition hover:text-white"
          style={{ color: '#5a6a84' }}>
          <ArrowLeft className="size-3.5" /> Meus Projetos
        </Link>
        <a href={`/api/pdf/${slug}`} download
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:text-white"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#6a7a96', background: 'rgba(255,255,255,0.04)' }}>
          <Download className="size-3.5" /> Baixar PDF
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-5">
      <div className="flex gap-6 items-start">
      {/* ── Coluna principal ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-7">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#4f7fff,#a855f7)' }} />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="hidden sm:flex shrink-0 h-28 w-20 rounded-xl items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#0d1a3a,#1a0d40)', border: '1px solid rgba(79,127,255,0.2)' }}>
                <BookOpen className="size-7" style={{ color: '#4f7fff' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(0,229,195,0.1)', color: '#00e5c3', border: '1px solid rgba(0,229,195,0.2)' }}>
                  <CheckCircle className="size-3" /> Planejamento aprovado
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">{plan.titulo}</h1>
                {plan.subtitulo && <p className="mt-1 text-[13px]" style={{ color: '#5a6a84' }}>{plan.subtitulo}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-[12px]" style={{ color: '#5a6a84' }}>
                    por <span className="font-semibold" style={{ color: '#a0b0c8' }}>{nomeAutor}</span>
                  </span>
                  <span style={{ color: '#2a3a56' }}>·</span>
                  <span className="flex items-center gap-1 text-[12px]" style={{ color: '#5a6a84' }}>
                    <Sparkles className="size-3" style={{ color: '#4f7fff' }} /> {capitulos.length} capítulos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl p-7 sm:p-8"
          style={{ background: 'linear-gradient(135deg,#0a0f2e,#111836,#0d0a28)', border: '1px solid rgba(79,127,255,0.2)' }}>
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
            style={{ background: 'radial-gradient(circle,#4f7fff,transparent 65%)' }} />
          <div className="pointer-events-none absolute right-10 bottom-0 h-32 w-32 rounded-full opacity-20 blur-2xl"
            style={{ background: 'radial-gradient(circle,#a855f7,transparent 65%)' }} />
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: '#f97316' }}>Próximo passo</p>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-2">
              Seu livro está a um clique de virar realidade
            </h2>
            <p className="text-[13px] mb-5" style={{ color: '#6a7a96' }}>
              A Aurora escreve cada capítulo por você — do início ao fim, no seu tom. Por apenas{' '}
              <strong className="text-white">R$ 49,99</strong>, pagamento único.
            </p>
            <CheckoutButton slug={slug} title={plan.titulo} amount={49.99}>
              Gerar meu livro completo
            </CheckoutButton>
          </div>
        </div>

        {/* ── Promessa ─────────────────────────────────────────────── */}
        {plan.promessa && (
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(79,127,255,0.06)', border: '1px solid rgba(79,127,255,0.15)' }}>
            <p className="text-[13px] font-medium leading-relaxed" style={{ color: '#a0b8e8' }}>
              ✦ {plan.promessa}
            </p>
          </div>
        )}

        {/* ── Planejamento Editorial ───────────────────────────────── */}
        <EditorialPlan plan={plan} slug={slug} />

        {/* ── Capítulos ────────────────────────────────────────────── */}
        <div>
          <div className="mb-4">
            <h2 className="text-[16px] font-black text-white tracking-tight">Estrutura do Livro</h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#5a6a84' }}>
              {capitulos.length} capítulos planejados pela Aurora
            </p>
          </div>
          <ChaptersList capitulos={capitulos} />
        </div>

        {/* ── Mensagem da Aurora ───────────────────────────────────── */}
        {plan.mensagem_final && (
          <div className="rounded-2xl p-6"
            style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#4f7fff' }}>Aurora IA</p>
            {plan.mensagem_final.split('\n').filter(Boolean).map((p, i) => (
              <p key={i} className="text-[13px] italic leading-relaxed mb-2 last:mb-0" style={{ color: '#6a7a96' }}>{p}</p>
            ))}
          </div>
        )}

        {/* ── Amostra Grátis ───────────────────────────────────────── */}
        {sampleBlocos.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-4"
              style={{ background: '#0d1220', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#00e5c3' }}>Amostra grátis</p>
              <p className="text-[13px] font-bold text-white mt-0.5">Capítulo 1 · {capitulos[0]?.titulo}</p>
            </div>
            <div className="px-6 py-5 space-y-3 relative overflow-hidden" style={{ background: '#0a0e1e' }}>
              {sampleBlocos.map((bloco, i) => (
                <p key={i} className="text-[13px] leading-relaxed"
                  style={{ color: i === sampleBlocos.length - 1 ? '#3a4a60' : '#8a9ab8' }}>
                  {bloco}
                </p>
              ))}
              <div className="absolute inset-x-0 bottom-0 h-12"
                style={{ background: 'linear-gradient(to top, #0a0e1e, transparent)' }} />
            </div>
            <div className="px-6 py-4 text-center"
              style={{ background: '#0d1220', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[12px] mb-3" style={{ color: '#5a6a84' }}>
                Gostou do começo? O livro completo tem {capitulos.length} capítulos nesse nível.
              </p>
              <CheckoutButton slug={slug} title={plan.titulo} amount={49.99}>
                Continuar lendo meu livro completo
              </CheckoutButton>
            </div>
          </div>
        )}

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <PricingBlock />

        {/* ── Serviços ─────────────────────────────────────────────── */}
        <div>
          <h2 className="text-[16px] font-black text-white tracking-tight mb-1">Serviços</h2>
          <p className="text-[12px] mb-5" style={{ color: '#5a6a84' }}>
            Tudo que você precisa para publicar e vender seu livro
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICOS.map(s => (
              <HolographicCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <FaqList />

      </div>{/* fim coluna principal */}

      {/* ── Pipeline sidebar ─────────────────────────────────────── */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-6">
        <PublicationPipeline slug={slug} />
      </div>

      </div>{/* fim flex */}
      </div>{/* fim max-w-6xl */}
    </div>
  )
}
