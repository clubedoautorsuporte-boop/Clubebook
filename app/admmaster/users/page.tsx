import { prisma } from '@/lib/prisma'
import UsersClient from './client'

export default async function UsersPage() {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true, name: true, email: true, image: true, credits: true, createdAt: true,
        _count: { select: { deliveries: true, drafts: true } },
      },
    }),
    prisma.user.count(),
  ])

  return <UsersClient initialUsers={users as UserRow[]} total={total} />
}

export type UserRow = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  credits: number
  createdAt: Date
  _count: { deliveries: number; drafts: number }
}
