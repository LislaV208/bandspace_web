"use client";

import { AuthProvider } from "@/contexts/auth-context";
import type React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}