"use client"

import { LoadingSpinner } from "@/components/ui/loading-indicator"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  fallbackPath?: string
}

export function AuthGuard({ children, fallbackPath = "/" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Przekierowywanie...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}