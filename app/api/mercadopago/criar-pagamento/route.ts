import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PRICES: Record<string, { amount: number; credits: number }> = {
  '20k':  { amount: 179.99, credits: 20000  },
  '50k':  { amount: 439.99, credits: 50000  },
  '100k': { amount: 849.99, credits: 100000 },
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 503 })

  const { MercadoPagoConfig, Payment } = await import('mercadopago')
  const client = new MercadoPagoConfig({ accessToken: token })
  const payment = new Payment(client)

  try {
    const body = await req.json() as {
      pacoteId: string
      token: string
      issuer_id: string
      payment_method_id: string
      transaction_amount: number
      installments: number
      payer: { email?: string; identification?: { type: string; number: string } }
      email: string
    }

    const pkg = PRICES[body.pacoteId]
    if (!pkg) return NextResponse.json({ error: 'Pacote inválido' }, { status: 400 })

    const result = await payment.create({
      body: {
        transaction_amount: pkg.amount,
        token: body.token,
        installments: body.installments,
        payment_method_id: body.payment_method_id,
        issuer_id: Number(body.issuer_id) || undefined,
        payer: {
          email: body.payer?.email ?? body.email,
          identification: body.payer?.identification,
        },
        description: `${pkg.credits.toLocaleString('pt-BR')} Créditos — Clube do Autor IA`,
        metadata: { pacoteId: body.pacoteId, credits: pkg.credits, userId: session.user.id },
      },
    })

    const status = result.status
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { increment: pkg.credits } },
      })
      return NextResponse.json({ status: 'approved' })
    }
    if (status === 'in_process' || status === 'pending') {
      return NextResponse.json({ status: 'pending' })
    }
    return NextResponse.json({ status: 'rejected', detail: result.status_detail }, { status: 402 })
  } catch (err) {
    console.error('[mercadopago] erro:', err)
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
