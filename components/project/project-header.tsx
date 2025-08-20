"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { apiClient } from "@/lib/api";
import type { Project } from "@/lib/types";
import {
  ArrowLeft,
  MoreHorizontal,
  Music,
  Settings,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InviteMemberDialog } from "./invite-member-dialog";
import { ProjectSettingsDialog } from "./project-settings-dialog";

interface ProjectHeaderProps {
  projectId: number;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const projectData = await apiClient.getProject(projectId);
        setProject(projectData as Project);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-8 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!project) {
    return (
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Projekt nie został znaleziony
            </h1>
          </div>
        </div>
      </header>
    );
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
                    <h1 className="text-2xl font-bold text-foreground">
                      {project.name}
                    </h1>
                    <p className="text-muted-foreground">
                      Utworzono {formatDate(project.createdAt)} •{" "}
                      {project.users.length} członk
                      {project.users.length === 1
                        ? ""
                        : project.users.length >= 2 && project.users.length <= 4
                        ? "i"
                        : "ów"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground">
                  Członkowie:
                </span>
                <div className="flex -space-x-2">
                  {project.users.slice(0, 5).map((user) => (
                    <UserAvatar key={user.id} user={user} size="md" />
                  ))}
                  {project.users.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{project.users.length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2">
                  {project.users.length} łącznie
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
                Zaproś
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border hover:bg-secondary bg-transparent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Ustawienia Projektu
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Usuń Projekt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <InviteMemberDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        projectId={projectId}
      />

      <ProjectSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        project={project}
        onProjectUpdate={setProject}
      />
    </>
  );
}
