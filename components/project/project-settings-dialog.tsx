"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Project } from "@/lib/types"

interface ProjectSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onProjectUpdate: (project: Project) => void
}

export function ProjectSettingsDialog({ open, onOpenChange, project, onProjectUpdate }: ProjectSettingsDialogProps) {
  const [name, setName] = useState(project.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    try {
      // TODO: Implement update project API call
      console.log("Updating project:", { projectId: project.id, name })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update project in parent component
      onProjectUpdate({ ...project, name })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten projekt? Ta operacja nie może zostać cofnięta.")) {
      return
    }

    setIsDeleting(true)

    try {
      // TODO: Implement delete project API call
      console.log("Deleting project:", project.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Failed to delete project:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Ustawienia Projektu</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Zarządzaj ustawieniami i preferencjami projektu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Update Project Name */}
          <form onSubmit={handleUpdateProject}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nazwa Projektu
                </Label>
                <Input
                  id="name"
                  placeholder="Wprowadź nazwę projektu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !name.trim() || name === project.name}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Aktualizowanie..." : "Zaktualizuj Projekt"}
              </Button>
            </div>
          </form>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground">Strefa Niebezpieczeństwa</h4>
              <p className="text-sm text-muted-foreground">Nieodwracalne i destruktywne działania.</p>
            </div>

            <Button variant="destructive" onClick={handleDeleteProject} disabled={isDeleting} className="w-full">
              {isDeleting ? "Usuwanie..." : "Usuń Projekt"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
