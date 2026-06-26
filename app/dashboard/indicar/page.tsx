import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import IndicarClient from './client'

export default async function IndicarPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  return <IndicarClient userId={session.user.id} />
}
