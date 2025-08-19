"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  variant?: "spinner" | "dots" | "pulse"
  color?: "primary" | "secondary" | "muted"
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
}

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground"
}

export function LoadingIndicator({ 
  size = "md", 
  className,
  variant = "spinner",
  color = "primary"
}: LoadingIndicatorProps) {
  
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-current animate-pulse",
              size === "sm" ? "w-1 h-1" : 
              size === "md" ? "w-1.5 h-1.5" : 
              size === "lg" ? "w-2 h-2" : "w-3 h-3",
              colorClasses[color]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "1s"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div 
        className={cn(
          "rounded-full bg-current animate-pulse",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        style={{
          animationDuration: "1.5s"
        }}
      />
    )
  }

  // Material Design circular spinner
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="animate-spin w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Background circle */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Animated arc */}
        <path
          className={cn("opacity-75", colorClasses[color])}
          fill="currentColor"
          d="m12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"
        />
        {/* Spinning indicator */}
        <path
          className={cn(colorClasses[color])}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Preset variants for common use cases
export function LoadingSpinner(props: Omit<LoadingIndicatorProps, 'variant'>) {
  return <LoadingIndicator {...props} variant="spinner" />
}

export function LoadingDots(props: Omit<LoadingIndicatorProps, 'variant'>) {
  return <LoadingIndicator {...props} variant="dots" />
}

export function LoadingPulse(props: Omit<LoadingIndicatorProps, 'variant'>) {
  return <LoadingIndicator {...props} variant="pulse" />
}