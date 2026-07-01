import { notFound } from 'next/navigation'
import { getDelivery } from '@/lib/delivery-store'
import { CapaStudio } from './capa-studio'

const SLUG_RE = /^[a-f0-9]{32}$/

type Props = { params: Promise<{ slug: string }> }

export default async function CapaPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  return (
    <CapaStudio
      slug={slug}
      titulo={delivery.planJson.titulo}
      subtitulo={delivery.planJson.subtitulo}
      sinopse={delivery.planJson.sinopse}
      nomeAutor={delivery.nomeAutor}
    />
  )
}
