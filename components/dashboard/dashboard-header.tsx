"use client";

import { ProfileDialog } from "@/components/profile/profile-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, Music, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-xl p-2">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">BandSpace</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <UserAvatar user={user} size="lg" showTooltip={false} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Wyloguj</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                v{process.env.APP_VERSION}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </header>
  );
}
