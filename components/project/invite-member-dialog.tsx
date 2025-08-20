"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient, ApiError } from "@/lib/api";
import { useState } from "react";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  onMemberInvited?: () => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  projectId,
  onMemberInvited,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.inviteUser(projectId, email.trim());

      // Reset form and close dialog
      setEmail("");
      onOpenChange(false);
      onMemberInvited?.();
    } catch (error) {
      console.error("Failed to invite member:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Nie udało się wysłać zaproszenia. Spróbuj ponownie.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Zaproś do projektu
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Wyślij zaproszenie do współpracy nad tym projektem muzycznym.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Adres e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Wprowadź adres e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-accent transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Wysyłanie..." : "Wyślij zaproszenie"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
