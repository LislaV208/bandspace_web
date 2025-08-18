"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { apiClient } from "@/lib/api"
import type { User, Session } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const clearSession = useCallback(() => {
    localStorage.removeItem("bandspace_session")
    apiClient.setAccessToken("")
    setUser(null)
  }, [])

  // Initialize session from localStorage - unified for both login methods
  useEffect(() => {
    const initSession = async () => {
      try {
        const storedSession = localStorage.getItem("bandspace_session")
        if (storedSession) {
          const session: Session = JSON.parse(storedSession)
          apiClient.setAccessToken(session.accessToken)
          setUser(session.user)
          console.log("Loaded user from localStorage:", session.user.email)
        } else {
          console.log("No stored session found")
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
        localStorage.removeItem("bandspace_session")
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [clearSession])

  // Listen for storage changes (e.g., when auth success page saves session)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bandspace_session" && e.newValue) {
        try {
          const session: Session = JSON.parse(e.newValue)
          apiClient.setAccessToken(session.accessToken)
          setUser(session.user)
          console.log("Session updated from storage event:", session.user.email)
        } catch (error) {
          console.error("Failed to parse session from storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Auto-refresh token every 50 minutes
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(
      async () => {
        try {
          await refreshToken()
        } catch (error) {
          console.error("Auto token refresh failed:", error)
          await logout()
        }
      },
      50 * 60 * 1000,
    ) // 50 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const saveSession = (session: Session) => {
    localStorage.setItem("bandspace_session", JSON.stringify(session))
    apiClient.setAccessToken(session.accessToken)
    setUser(session.user)
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const session = await apiClient.login(email, password)
      saveSession(session)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])


  const register = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const session = await apiClient.register(email, password)
      saveSession(session)
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Logout from bandspace backend
      await apiClient.logout()
    } catch (error) {
      console.error("Backend logout failed:", error)
    }

    // Clear local session
    clearSession()
  }, [clearSession])

  const refreshToken = useCallback(async () => {
    try {
      const storedSession = localStorage.getItem("bandspace_session")
      if (!storedSession) throw new Error("No session found")

      // TODO: Implement refresh token endpoint
      // const session: Session = JSON.parse(storedSession)
      // const newSession = await apiClient.refreshToken(session.refreshToken)
      // saveSession(newSession)
    } catch (error) {
      console.error("Token refresh failed:", error)
      throw error
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
