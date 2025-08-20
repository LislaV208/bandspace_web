"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseAuthGuardOptions {
  fallbackPath?: string
}

export function useAuthGuard({ fallbackPath = "/" }: UseAuthGuardOptions = {}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading && isAuthenticated,
  }
}