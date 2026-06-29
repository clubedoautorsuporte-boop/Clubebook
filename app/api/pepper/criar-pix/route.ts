import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const PEPPER_BASE = 'https://api.cloud.pepperpay.com.br/public/v1'

const OFFER_MAP: Record<string, { offerHash: string; credits: number; amount: number }> = {
  '20k':  { offerHash: process.env.PEPPER_OFFER_HASH_20K  ?? '', credits: 20000,  amount: 17999 },
  '50k':  { offerHash: process.env.PEPPER_OFFER_HASH_50K  ?? '', credits: 50000,  amount: 43999 },
  '100k': { offerHash: process.env.PEPPER_OFFER_HASH_100K ?? '', credits: 100000, amount: 84999 },
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json() as {
    pacote: string
    nome: string
    email: string
    cpf: string
    telefone: string
  }

  const { pacote, nome, email, cpf, telefone } = body
  const pkg = OFFER_MAP[pacote]
  if (!pkg) return NextResponse.json({ error: 'pacote inválido' }, { status: 400 })

  const token = process.env.PEPPER_API_TOKEN
  if (!token || !pkg.offerHash) {
    return NextResponse.json({ error: 'PEPPER_API_TOKEN ou offer hash não configurado' }, { status: 500 })
  }

  const payload = {
    api_token: token,
    amount: pkg.amount,
    payment_method: 'pix',
    cart: [{
      offer_hash: pkg.offerHash,
      price: pkg.amount,
      quantity: 1,
      operation_type: 1,
      title: `${pkg.credits.toLocaleString('pt-BR')} Créditos — Clube do Autor IA`,
    }],
    installments: 1,
    customer: {
      name: nome,
      email,
      phone_number: telefone.replace(/\D/g, ''),
      document: cpf.replace(/\D/g, ''),
    },
    tracking: {
      utm_content: session.user.id, // userId para rastrear no webhook
    },
  }

  const res = await fetch(`${PEPPER_BASE}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json() as {
    success: boolean
    message?: string
    errors?: string[]
    data?: { transaction_hash: string; payment_url: string; qr_code: string }
  }

  if (!data.success || !data.data) {
    console.error('[pepper-pix] erro:', data)
    return NextResponse.json(
      { error: data.message ?? 'Erro ao criar transação', details: data.errors },
      { status: 400 }
    )
  }

  return NextResponse.json({
    hash: data.data.transaction_hash,
    qr_code: data.data.qr_code,
    payment_url: data.data.payment_url,
    credits: pkg.credits,
  })
}
