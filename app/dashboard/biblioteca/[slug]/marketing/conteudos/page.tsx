import { notFound } from 'next/navigation'
import { getDelivery } from '@/lib/delivery-store'
import { ConteudosClient } from './conteudos-client'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

export default async function ConteudosPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  return (
    <ConteudosClient
      slug={slug}
      titulo={delivery.planJson.titulo}
      nomeAutor={delivery.planJson.autor}
    />
  )
}
