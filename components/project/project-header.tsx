"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Settings, UserPlus, MoreHorizontal, Music } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"
import { InviteMemberDialog } from "./invite-member-dialog"
import { ProjectSettingsDialog } from "./project-settings-dialog"

interface ProjectHeaderProps {
  projectId: number
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  useEffect(() => {
    // Mock data - will be replaced with API call
    const mockProject: Project = {
      id: projectId,
      name: "Summer Album 2024",
      slug: "summer-album-2024",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
      users: [
        { id: 1, email: "john@example.com", name: "John Doe" },
        { id: 2, email: "jane@example.com", name: "Jane Smith" },
        { id: 3, email: "mike@example.com", name: "Mike Johnson" },
      ],
    }

    setTimeout(() => {
      setProject(mockProject)
      setIsLoading(false)
    }, 500)
  }, [projectId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-8 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    )
  }

  if (!project) {
    return (
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              {/* Back button and title */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard")}
                  className="hover:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary rounded-xl p-2">
                    <Music className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                    <p className="text-muted-foreground">
                      Created {formatDate(project.createdAt)} • {project.users.length} members
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground">Members:</span>
                <div className="flex -space-x-2">
                  {project.users.slice(0, 5).map((user) => (
                    <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={undefined || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-secondary text-xs">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.users.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.users.length - 5}</span>
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2">
                  {project.users.length} total
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(true)}
                className="border-border hover:bg-secondary"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-border hover:bg-secondary bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Project Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <InviteMemberDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} projectId={projectId} />

      <ProjectSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        project={project}
        onProjectUpdate={setProject}
      />
    </>
  )
}
