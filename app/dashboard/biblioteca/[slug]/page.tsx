import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Download, Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { ChaptersList, FaqList, PricingBlock } from '@/app/receiver/[slug]/receiver-client'
import HolographicCard from '@/components/ui/holographic-card'
import { EditorialPlan } from '@/app/receiver/[slug]/editorial-plan'

const SLUG_RE = /^[a-f0-9]{32}$/

const SERVICOS = [
  { icon: '✦', label: 'Texto',              desc: 'Escreva e edite o conteúdo do seu livro',             color: '#f97316', badge: 'FAZENDO',  badgeBg: 'rgba(249,115,22,0.15)',  badgeColor: '#f97316' },
  { icon: '◈', label: 'Capas',              desc: 'Uma capa profissional atrai mais leitores!',           color: '#a855f7', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◉', label: 'Ilustrações',        desc: 'Ilustrações dão vida à sua história!',                color: '#f59e0b', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '⊕', label: 'Publicação',         desc: 'Prepare tudo para publicar seu livro!',               color: '#22d3ee', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◆', label: 'Kit de Marketing',   desc: 'Posts prontos pra Instagram, e-mails e banners',      color: '#ec4899', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◎', label: 'Plano de Lançamento',desc: 'Cronograma D-30 → D-0 e distribuição',                color: '#f59e0b', badge: 'EM BREVE', badgeBg: 'rgba(168,85,247,0.12)', badgeColor: '#a855f7' },
  { icon: '◐', label: 'Audiobook',          desc: 'Alcance leitores que preferem ouvir histórias!',      color: '#4f7fff', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◫', label: 'Vender',             desc: 'Monetize seu livro na plataforma certa',               color: '#22d3ee', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◴', label: 'Tradução',           desc: 'Leitores do mundo inteiro podem ler seu livro!',      color: '#a855f7', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◱', label: 'Registro de ISBN',   desc: 'Documentação oficial do seu livro',                   color: '#f97316', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
  { icon: '◳', label: 'Ficha Catalográfica',desc: 'Complete esta etapa!',                                 color: '#a855f7', badge: 'A FAZER',  badgeBg: 'rgba(79,127,255,0.12)', badgeColor: '#4f7fff' },
]

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

      <div className="mx-auto max-w-4xl px-5 space-y-7">

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
            <Link href="#gerar"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[13px] font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 6px 24px rgba(79,127,255,0.35)' }}>
              Gerar meu livro completo <ArrowRight className="size-4" />
            </Link>
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
              <Link href="#gerar"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}>
                Continuar lendo meu livro completo <ArrowRight className="size-3.5" />
              </Link>
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

      </div>
    </div>
  )
}
