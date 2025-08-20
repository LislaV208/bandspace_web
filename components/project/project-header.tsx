"use client";

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
  Trash2,
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
          <div className="flex items-center justify-between animate-pulse">
            {/* Left section skeleton */}
            <div className="flex items-center space-x-4">
              {/* Back button skeleton */}
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
              
              {/* Project icon skeleton */}
              <div className="h-12 w-12 bg-muted rounded-xl"></div>
              
              {/* Project info skeleton */}
              <div className="flex flex-col space-y-2">
                {/* Project name skeleton */}
                <div className="h-8 bg-muted rounded w-48"></div>
                {/* Meta info skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="flex items-center space-x-2">
                    {/* Avatar skeletons */}
                    <div className="flex -space-x-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-6 w-6 bg-muted rounded-full"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-20 bg-muted rounded-lg"></div>
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
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
          <div className="flex items-center justify-between">
            {/* Left section with back button and project info */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="bg-primary rounded-xl p-2">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-foreground">
                  {project.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Utworzono {formatDate(project.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {project.users.map((user) => (
                        <UserAvatar key={user.id} user={user} size="sm" />
                      ))}
                      {project.users.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{project.users.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section with actions */}
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
                    Edytuj projekt
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Usuń projekt
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
