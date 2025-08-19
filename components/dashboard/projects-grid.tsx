"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { apiClient, ApiError } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectsGridProps {
  onRefresh?: (refreshFn: () => void) => void;
}

export function ProjectsGrid({ onRefresh }: ProjectsGridProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    console.log('ProjectsGrid: onRefresh effect triggered', { onRefresh });
    if (onRefresh) {
      console.log('ProjectsGrid: calling onRefresh with loadProjects wrapper');
      onRefresh(() => {
        console.log('ProjectsGrid: refresh wrapper called');
        loadProjects();
      });
    }
  }, [onRefresh]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectsData = await apiClient.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to load projects:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Nie udało się załadować projektów. Spróbuj ponownie.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "dzisiaj";
    if (days === 1) return "wczoraj";
    if (days < 7) return `${days} dni temu`;
    if (days < 30) return `${Math.floor(days / 7)} tyg. temu`;
    if (days < 365) return `${Math.floor(days / 30)} mies. temu`;
    return `${Math.floor(days / 365)} lat temu`;
  };

  const getMemberCountText = (count: number) => {
    if (count === 1) return "osoba";
    if (count >= 2 && count <= 4) return "osoby";
    return "osób";
  };

  const renderMemberAvatars = (project: Project) => {
    const maxVisibleAvatars = 5;
    const members = project.users;
    const visibleMembers =
      members.length > maxVisibleAvatars
        ? members.slice(0, maxVisibleAvatars)
        : members;

    if (members.length === 0) {
      return (
        <span className="text-sm text-muted-foreground">Brak członków</span>
      );
    }

    return (
      <div className="flex items-center">
        <div className="flex -space-x-1">
          {visibleMembers.map((user, index) => (
            <div
              key={user.id}
              className="ring-2 ring-card rounded-full"
              style={{ zIndex: visibleMembers.length + index }}
            >
              <UserAvatar user={user} size="sm" />
            </div>
          ))}
          {members.length > maxVisibleAvatars && (
            <div
              className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-muted-foreground ring-2 ring-card rounded-full"
              style={{ zIndex: 0 }}
            >
              +{members.length - maxVisibleAvatars}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border bg-card animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nie udało się załadować projektów
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button
          onClick={loadProjects}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Spróbuj Ponownie
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Brak projektów
        </h3>
        <p className="text-muted-foreground mb-4">
          Utwórz swój pierwszy projekt aby zacząć współpracę z zespołem
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          Ostrzeżenie: {error}. Wyświetlanie zapisanych danych.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group overflow-hidden"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header with icon and project info */}
                <div className="flex items-start gap-4">
                  {/* Gradient icon container */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-center">
                    <Music className="h-7 w-7 text-blue-400/80" />
                  </div>

                  {/* Project info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-foreground  transition-colors truncate">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Utworzono {formatRelativeTime(project.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member avatars and count */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">{renderMemberAvatars(project)}</div>

                  {/* Member count badge */}
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs px-2.5 py-1"
                  >
                    {project.users.length}{" "}
                    {getMemberCountText(project.users.length)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
