import { AuthGuard } from "@/components/auth/auth-guard"
import type React from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}