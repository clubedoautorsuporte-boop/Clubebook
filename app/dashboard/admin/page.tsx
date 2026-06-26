import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminClient from './client'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export default async function AdminPage() {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) redirect('/dashboard')
  return <AdminClient />
}
