"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"
import { InvitationsPanel } from "@/components/dashboard/invitations-panel"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Invitations Section */}
        <InvitationsPanel />

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Projects</h1>
              <p className="text-muted-foreground">Manage and collaborate on your music projects</p>
            </div>
          </div>

          <ProjectsGrid />
        </div>
      </main>
    </div>
  )
}
