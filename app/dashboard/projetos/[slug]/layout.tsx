import { PipelineSidebar } from '@/components/pipeline-sidebar'

export default function ProjetosSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingRight: 242 }}>
      {children}
      <PipelineSidebar />
    </div>
  )
}
