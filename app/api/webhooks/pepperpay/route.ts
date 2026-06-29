import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CREDITS_BY_OFFER: Record<string, number> = {
  [process.env.PEPPER_OFFER_HASH_20K  ?? 'x']: 20000,
  [process.env.PEPPER_OFFER_HASH_50K  ?? 'x']: 50000,
  [process.env.PEPPER_OFFER_HASH_100K ?? 'x']: 100000,
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-pepper-token') ?? req.headers.get('authorization')
  if (process.env.PEPPER_WEBHOOK_TOKEN && token !== process.env.PEPPER_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await req.json() as {
    event?: string
    data?: {
      transaction?: { status?: string; method?: string }
      customer?: { email?: string; name?: string }
      items?: Array<{ offer_hash?: string }>
      tracking?: { utm_content?: string }
    }
  }

  const { data } = payload
  const status = data?.transaction?.status ?? ''
  if (status !== 'paid') {
    return NextResponse.json({ received: true, skipped: status })
  }

  const email = data?.customer?.email ?? ''
  const offerHash = data?.items?.[0]?.offer_hash ?? ''
  const userId = data?.tracking?.utm_content ?? '' // passado no criar-pix

  const creditsToAdd = CREDITS_BY_OFFER[offerHash] ?? 0
  if (!creditsToAdd) {
    console.error('[webhook] offer não mapeado:', offerHash)
    return NextResponse.json({ received: true })
  }

  // Tenta por userId primeiro (mais seguro), fallback por email
  const where = userId
    ? { id: userId }
    : email ? { email } : null

  if (!where) {
    console.error('[webhook] sem identificador de usuário')
    return NextResponse.json({ received: true })
  }

  await prisma.user.update({
    where: where as { id: string } | { email: string },
    data: { credits: { increment: creditsToAdd } },
  }).catch(err => console.error('[webhook] erro ao creditar:', err))

  return NextResponse.json({ received: true, credits_added: creditsToAdd })
}
