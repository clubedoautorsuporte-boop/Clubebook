import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Minha Área | Clube do Autor IA',
  robots: 'noindex',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/login')
  return <>{children}</>
}
