"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import type { Project } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

export function ProjectSettingsDialog({
  open,
  onOpenChange,
  project,
  onProjectUpdate,
}: ProjectSettingsDialogProps) {
  const [name, setName] = useState(project.name);
  const [isLoading, setIsLoading] = useState(false);

  // Reset name when dialog opens or project changes
  React.useEffect(() => {
    if (open) {
      setName(project.name);
    }
  }, [open, project.name]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    try {
      const updatedProject = await apiClient.updateProject(project.id, name.trim());
      
      // Update project in parent component with the response from API
      onProjectUpdate(updatedProject as Project);
      toast.success("Projekt został zaktualizowany");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Nie udało się zaktualizować projektu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edytuj projekt</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Update Project Name */}
          <form onSubmit={handleUpdateProject}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nazwa projektu
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
                {isLoading ? "Aktualizowanie..." : "Zapisz"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
