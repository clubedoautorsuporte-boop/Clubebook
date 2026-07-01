import { PipelineSidebar } from '@/components/pipeline-sidebar'

export default function BibliotecaSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingRight: 242 }}>
      {children}
      <PipelineSidebar />
    </div>
  )
}
