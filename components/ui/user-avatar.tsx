"use client";

import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface UserAvatarProps {
  user?: User | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function UserAvatar({
  user,
  size = "md",
  className,
  onClick,
  showTooltip = true,
}: UserAvatarProps) {
  const getInitials = (user?: User | null): string => {
    if (user?.name && user.name.trim()) {
      const names = user.name.trim().split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      } else {
        const name = names[0];
        return name.length >= 2
          ? `${name[0]}${name[1]}`.toUpperCase()
          : name[0].toUpperCase();
      }
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return "?";
  };

  const generateBackgroundColor = (user?: User | null): string => {
    if (!user) return "hsl(var(--muted))";

    const colors = [
      "#1E3A8A", // blue-900
      "#065F46", // emerald-800
      "#92400E", // amber-800
      "#991B1B", // red-800
      "#5B21B6", // violet-800
      "#155E75", // cyan-800
      "#EA580C", // orange-600
      "#365314", // lime-800
      "#BE185D", // pink-700
      "#312E81", // indigo-900
    ];

    return colors[user.id % colors.length];
  };

  const initials = getInitials(user);
  const backgroundColor = generateBackgroundColor(user);

  const getTooltipText = (user?: User | null): string => {
    if (user?.name && user.name.trim()) {
      return user.name;
    }
    if (user?.email) {
      return user.email;
    }
    return "User";
  };

  const avatarElement = (
    <Avatar
      className={cn(sizeClasses[size], className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <AvatarImage src="" alt={user?.name || user?.email || "User"} />
      <AvatarFallback
        className={cn("text-white font-semibold", textSizeClasses[size])}
        style={{ backgroundColor }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip) {
    return avatarElement;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            {avatarElement}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{getTooltipText(user)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
