import { notFound } from 'next/navigation'
import { getDelivery } from '@/lib/delivery-store'
import { IsbnClient } from './isbn-client'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

export default async function IsbnPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  return <IsbnClient slug={slug} titulo={delivery.planJson.titulo} />
}
