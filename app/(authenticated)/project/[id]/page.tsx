import { ProjectHeader } from "@/components/project/project-header"
import { SongsTab } from "@/components/project/tabs/songs-tab"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = Number.parseInt(params.id)

  if (isNaN(projectId)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader projectId={projectId} />
      <main className="container mx-auto px-4 py-6">
        <SongsTab projectId={projectId} />
      </main>
    </div>
  )
}
