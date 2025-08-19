"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectsGrid } from "@/components/dashboard/projects-grid";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [refreshProjects, setRefreshProjects] = useState<(() => void) | null>(
    null
  );

  const handleSetRefreshProjects = useCallback((refreshFn: () => void) => {
    setRefreshProjects(() => refreshFn);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Przekierowywanie...</p>
        </div>
      </div>
    );
  }

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

          <ProjectsGrid onRefresh={handleSetRefreshProjects} />
        </div>
      </main>
    </div>
  );
}
