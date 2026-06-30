import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' })

const PRICES: Record<string, number> = {
  '20k':  17999,
  '50k':  43999,
  '100k': 84999,
}

export async function POST(req: NextRequest) {
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
