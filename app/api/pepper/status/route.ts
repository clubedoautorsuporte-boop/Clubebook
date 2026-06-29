import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PEPPER_BASE = 'https://api.cloud.pepperpay.com.br/public/v1'

const CREDITS_BY_OFFER: Record<string, number> = {
  [process.env.PEPPER_OFFER_HASH_20K  ?? '']: 20000,
  [process.env.PEPPER_OFFER_HASH_50K  ?? '']: 50000,
  [process.env.PEPPER_OFFER_HASH_100K ?? '']: 100000,
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const hash = req.nextUrl.searchParams.get('hash')
  if (!hash) return NextResponse.json({ error: 'hash required' }, { status: 400 })

  const token = process.env.PEPPER_API_TOKEN
  const res = await fetch(`${PEPPER_BASE}/transactions/${hash}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const data = await res.json() as {
    payment_status?: string
    customer?: { email?: string }
    items?: Array<{ offer_hash?: string }>
  }

  const status = data.payment_status ?? 'waiting_payment'

  // Se pago, credita e retorna — idempotente via try/catch de upsert
  if (status === 'paid') {
    const offerHash = data.items?.[0]?.offer_hash ?? ''
    const creditsToAdd = CREDITS_BY_OFFER[offerHash] ?? 0

    if (creditsToAdd > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { increment: creditsToAdd } },
      }).catch(() => null) // ignora se já foi creditado via webhook
    }
  }

  return NextResponse.json({ status })
}
