import { notFound } from 'next/navigation'
import { getDelivery } from '@/lib/delivery-store'
import { IllustrationCreator } from './illustration-creator'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

export default async function IlustrarCriarPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { titulo, capitulos, autor } = delivery.planJson

  return (
    <IllustrationCreator
      slug={slug}
      titulo={titulo}
      nomeAutor={autor ?? delivery.nomeAutor}
      capitulos={capitulos.map((c: { numero: number; titulo: string; descricao: string }) => ({
        numero: c.numero,
        titulo: c.titulo,
        descricao: c.descricao,
      }))}
    />
  )
}
