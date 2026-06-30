import { NextRequest, NextResponse } from 'next/server'

const PRICES: Record<string, number> = {
  '20k':  17999,
  '50k':  43999,
  '100k': 84999,
}

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return NextResponse.json({ error: 'Stripe não configurado' }, { status: 503 })

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(key, { apiVersion: '2025-06-30.basil' })

  try {
    const { pacoteId } = await req.json() as { pacoteId: string }
    const amount = PRICES[pacoteId]
    if (!amount) return NextResponse.json({ error: 'Pacote inválido' }, { status: 400 })

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      metadata: { pacoteId },
    })

    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch (err) {
    console.error('[stripe] erro:', err)
    return NextResponse.json({ error: 'Erro ao criar intenção de pagamento' }, { status: 500 })
  }
}
