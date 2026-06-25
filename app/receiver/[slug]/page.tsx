import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Download, BookOpen, CheckCircle, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { getDelivery } from '@/lib/delivery-store'
import PdfViewer from './pdf-viewer'

const SLUG_RE = /^[a-f0-9]{32}$/

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) return { title: 'Planejamento | Clube do Autor IA' }

  const delivery = await getDelivery(slug)
  if (!delivery) return { title: 'Planejamento | Clube do Autor IA' }

  return {
    title: `${delivery.planJson.titulo} | Clube do Autor IA`,
    description: delivery.planJson.promessa,
    robots: 'noindex, nofollow',
  }
}

export default async function ReceiverPage({ params }: Props) {
  const { slug } = await params

  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson, nomeAutor } = delivery
  const capitulos = planJson.capitulos ?? []

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0d0d14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
              <BookOpen className="h-4 w-4 text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-white/80">Clube do Autor IA</span>
          </Link>
          <span className="text-xs text-white/30">Planejamento exclusivo</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Badge + Hero */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-400">
            <CheckCircle className="h-4 w-4" />
            SEU PLANEJAMENTO CHEGOU
          </div>

          {nomeAutor && nomeAutor !== 'Autor' && (
            <p className="mb-2 text-sm text-white/50">Preparado especialmente para {nomeAutor}</p>
          )}

          <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {planJson.titulo}
          </h1>
          <p className="mx-auto mb-2 max-w-2xl text-lg text-white/60">{planJson.subtitulo}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            {capitulos.length} capítulos planejados pela Aurora IA
          </div>
        </div>

        {/* Promessa */}
        <div className="mb-10 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 text-center">
          <p className="text-base font-medium text-teal-300">✨ {planJson.promessa}</p>
        </div>

        {/* Capítulos */}
        <section className="mb-12">
          <h2 className="mb-5 text-lg font-bold text-white/80">Estrutura do Livro</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {capitulos.map((cap) => (
              <div
                key={cap.numero}
                className="group flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.06]"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-400">
                  {cap.numero}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/90">{cap.titulo}</p>
                  {cap.descricao && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-white/40">{cap.descricao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mensagem da Aurora */}
        {planJson.mensagem_final && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-bold text-white/80">Mensagem da Aurora IA</h2>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
              {planJson.mensagem_final.split('\n').filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  className="mb-3 text-sm italic leading-relaxed text-white/60 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* PDF Viewer */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white/80">Seu Documento</h2>
            <a
              href={`/api/pdf/${slug}`}
              download
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-400"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </a>
          </div>
          <PdfViewer slug={slug} titulo={planJson.titulo} />
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-transparent p-8 text-center">
          <h3 className="mb-2 text-xl font-bold text-white">
            Pronto para receber seu ebook completo?
          </h3>
          <p className="mb-6 text-sm text-white/60">
            Finalize agora e em menos de 1 hora você recebe o livro completo no WhatsApp e e-mail.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-3 text-sm font-bold text-black shadow-lg shadow-teal-500/25 transition hover:bg-teal-400"
          >
            🚀 Finalizar meu ebook — R$ 67
          </Link>
        </div>
      </main>
    </div>
  )
}
