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
  loginWithGoogle: (token: string) => Promise<void>
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

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedSession = localStorage.getItem("bandspace_session")
        if (storedSession) {
          const session: Session = JSON.parse(storedSession)
          apiClient.setAccessToken(session.accessToken)
          setUser(session.user)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
        localStorage.removeItem("bandspace_session")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
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

  const clearSession = () => {
    localStorage.removeItem("bandspace_session")
    apiClient.setAccessToken("")
    setUser(null)
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

  const loginWithGoogle = useCallback(async (token: string) => {
    try {
      setIsLoading(true)
      const session = await apiClient.googleLogin(token)
      saveSession(session)
    } catch (error) {
      console.error("Google login failed:", error)
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
      await apiClient.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      clearSession()
    }
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const storedSession = localStorage.getItem("bandspace_session")
      if (!storedSession) throw new Error("No session found")

      const session: Session = JSON.parse(storedSession)
      // TODO: Implement refresh token endpoint
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
    loginWithGoogle,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
