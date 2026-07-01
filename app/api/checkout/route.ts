import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const { slug, title, amount } = await req.json()

    if (!slug || !amount) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://clubedoautor.online'

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: [
          {
            id: slug,
            title: title ?? 'Livro completo — Clube do Autor IA',
            quantity: 1,
            unit_price: amount,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${siteUrl}/receiver/${slug}?pagamento=aprovado`,
          failure: `${siteUrl}/receiver/${slug}?pagamento=falhou`,
          pending: `${siteUrl}/receiver/${slug}?pagamento=pendente`,
        },
        auto_return: 'approved',
        external_reference: slug,
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
      },
    })

    return NextResponse.json({ checkoutUrl: result.init_point })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 500 })
  }
}
