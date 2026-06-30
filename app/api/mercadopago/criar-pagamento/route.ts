import { NextRequest, NextResponse } from 'next/server'

const PRICES: Record<string, { amount: number; credits: number }> = {
  '20k':  { amount: 179.99, credits: 20000  },
  '50k':  { amount: 439.99, credits: 50000  },
  '100k': { amount: 849.99, credits: 100000 },
}

export async function POST(req: NextRequest) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 503 })

  const { MercadoPagoConfig, Payment } = await import('mercadopago')
  const client = new MercadoPagoConfig({ accessToken: token })
  const payment = new Payment(client)

  try {
    const body = await req.json() as {
      pacoteId: string
      token: string
      installments: number
      paymentMethodId: string
      issuerId: string
      email: string
      identificationType: string
      identificationNumber: string
    }

    const pkg = PRICES[body.pacoteId]
    if (!pkg) return NextResponse.json({ error: 'Pacote inválido' }, { status: 400 })

    const result = await payment.create({
      body: {
        transaction_amount: pkg.amount,
        token: body.token,
        installments: body.installments,
        payment_method_id: body.paymentMethodId,
        issuer_id: Number(body.issuerId) || undefined,
        payer: {
          email: body.email,
          identification: {
            type: body.identificationType,
            number: body.identificationNumber,
          },
        },
        description: `${pkg.credits.toLocaleString('pt-BR')} Créditos — Clube do Autor IA`,
        metadata: { pacoteId: body.pacoteId, credits: pkg.credits },
      },
    })

    const status = result.status
    if (status === 'approved') {
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
