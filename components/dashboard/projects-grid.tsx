"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"
import { apiClient, ApiError } from "@/lib/api"

export function ProjectsGrid() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const projectsData = await apiClient.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error("Failed to load projects:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to load projects. Please try again.")
      }
      // Fallback to mock data for demo
      const mockProjects: Project[] = [
        {
          id: 1,
          name: "Summer Album 2024",
          slug: "summer-album-2024",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T15:30:00Z",
          users: [
            { id: 1, email: "john@example.com", name: "John Doe" },
            { id: 2, email: "jane@example.com", name: "Jane Smith" },
          ],
        },
        {
          id: 2,
          name: "Acoustic Sessions",
          slug: "acoustic-sessions",
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-18T12:00:00Z",
          users: [{ id: 1, email: "john@example.com", name: "John Doe" }],
        },
        {
          id: 3,
          name: "Rock Covers",
          slug: "rock-covers",
          createdAt: "2024-01-05T14:00:00Z",
          updatedAt: "2024-01-15T16:45:00Z",
          users: [
            { id: 1, email: "john@example.com", name: "John Doe" },
            { id: 3, email: "mike@example.com", name: "Mike Johnson" },
            { id: 4, email: "sarah@example.com", name: "Sarah Wilson" },
          ],
        },
      ]
      setProjects(mockProjects)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.deleteProject(projectId)
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
    } catch (error) {
      console.error("Failed to delete project:", error)
      if (error instanceof ApiError) {
        alert(`Failed to delete project: ${error.message}`)
      } else {
        alert("Failed to delete project. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-border bg-card animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error && projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load projects</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadProjects} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Try Again
        </Button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-4">Create your first project to start collaborating with your band</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          Warning: {error}. Showing cached data.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleProjectClick(project.id)}>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Invite Members</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteProject(project.id, project.name)}
                    >
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {project.users.length} member{project.users.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.users.slice(0, 3).map((user) => (
                  <Badge key={user.id} variant="secondary" className="text-xs">
                    {user.name || user.email}
                  </Badge>
                ))}
                {project.users.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.users.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
