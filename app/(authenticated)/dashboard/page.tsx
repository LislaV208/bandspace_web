"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectsGrid } from "@/components/dashboard/projects-grid";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCw, Plus } from "lucide-react";
import { useCallback, useState } from "react";

export default function DashboardPage() {
  const [refreshProjects, setRefreshProjects] = useState<(() => void) | null>(
    null
  );
  const [showCreateProject, setShowCreateProject] = useState(false);

  const handleSetRefreshProjects = useCallback((refreshFn: () => void) => {
    setRefreshProjects(() => refreshFn);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Moje projekty
              </h1>
              <p className="text-muted-foreground">
                Zarządzaj swoimi projektami muzycznymi
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Create Project Button */}
              <Button
                onClick={() => setShowCreateProject(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nowy Projekt
              </Button>

              {/* Refresh Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (refreshProjects) {
                          refreshProjects();
                        }
                      }}
                      disabled={!refreshProjects}
                      className="h-14 w-14 hover:text-foreground disabled:opacity-50"
                    >
                      <RefreshCw style={{ width: "24px", height: "24px" }} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-muted/90 text-foreground border-border/50 shadow-sm"
                    arrowClassName="bg-muted/90 fill-muted/90"
                    sideOffset={-4}
                  >
                    <p>Odśwież</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ProjectsGrid onRefresh={handleSetRefreshProjects} />
        </div>
      </main>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </div>
  );
}
