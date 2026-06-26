import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminSidebar from './sidebar'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export const metadata = { title: 'Admin Master · Clube do Autor IA', robots: 'noindex' }

export default async function AdmMasterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) redirect('/')

  return (
    <div className="flex min-h-screen bg-[#060912]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
