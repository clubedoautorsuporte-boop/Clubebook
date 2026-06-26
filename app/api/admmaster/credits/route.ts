import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Acesso negado' }, { status: 403 })

  const { userId, operation, amount } = await req.json() as {
    userId: string
    operation: 'add' | 'subtract' | 'set'
    amount: number
  }

  if (!userId || !operation || typeof amount !== 'number' || amount < 0) {
    return Response.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, credits: true } })
  if (!user) return Response.json({ error: 'Usuário não encontrado' }, { status: 404 })

  let newCredits: number
  if (operation === 'add')      newCredits = user.credits + amount
  else if (operation === 'subtract') newCredits = Math.max(0, user.credits - amount)
  else                          newCredits = amount  // set

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { credits: newCredits },
    select: { id: true, credits: true, name: true, email: true },
  })

  return Response.json({ success: true, user: updated, previousCredits: user.credits })
}
