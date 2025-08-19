"use client";

import { apiClient } from "@/lib/api";
import type { User } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Pobierz tokeny z query parameters
        const accessToken = searchParams.get("token");
        const refreshToken = searchParams.get("refresh");

        if (!accessToken || !refreshToken) {
          throw new Error("Brak wymaganych tokenów autoryzacji");
        }

        // Ustaw access token w API client
        apiClient.setAccessToken(accessToken);

        // Pobierz dane użytkownika
        const userData = (await apiClient.getUserMe()) as User;

        // Stwórz sesję
        const session = {
          user: userData,
          accessToken,
          refreshToken,
        };

        // Zapisz sesję do localStorage
        localStorage.setItem("bandspace_session", JSON.stringify(session));

        // Wywołaj custom event żeby powiadomić AuthContext o nowej sesji
        window.dispatchEvent(new CustomEvent('bandspace-session-updated', { 
          detail: session 
        }));

        console.log("Google login successful:", userData.email);

        // Małe opóźnienie żeby AuthContext zdążył załadować dane
        await new Promise(resolve => setTimeout(resolve, 100));

        // Przekieruj do dashboardu
        router.replace("/dashboard");
      } catch (error) {
        console.error("Error handling auth success:", error);
        // Przekieruj do strony błędu
        router.replace(
          "/auth/error?message=" +
            encodeURIComponent(
              error instanceof Error
                ? error.message
                : "Nieznany błąd podczas logowania"
            )
        );
      }
    };

    handleAuthSuccess();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Finalizowanie logowania...</p>
      </div>
    </div>
  );
}
