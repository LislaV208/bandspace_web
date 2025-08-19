"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { ApiError, apiClient } from "@/lib/api";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "./google-icon";

export function LoginForm() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [isTransitioningToGoogle, setIsTransitioningToGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleGoogleLogin = () => {
    try {
      setError(null);
      // Użyj elegancką metodę z API client
      apiClient.redirectToGoogleAuth();
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Logowanie przez Google nie powiodło się. Spróbuj ponownie.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setError(null);
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Nieprawidłowy e-mail lub hasło");
        } else {
          setError(error.message);
        }
      } else {
        setError("Logowanie nie powiodło się. Spróbuj ponownie.");
      }
    }
  };

  return (
    <Card className="border-border bg-card shadow-2xl shadow-black/20 rounded-3xl">
      <CardHeader className="space-y-2 pb-2 pt-8 px-8">
        <CardTitle className="text-3xl text-center font-bold tracking-tight">
          Witaj z powrotem!
        </CardTitle>
        <CardDescription className="text-center text-base">
          Zaloguj się, aby kontynuować pracę nad swoimi projektami
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 transition-all duration-500 ease-in-out pt-1 px-8 pb-2">
        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-2xl text-center border border-destructive/30 shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
              </div>
              {error}
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showEmailLogin
              ? "max-h-[800px] opacity-100"
              : "max-h-[200px] opacity-100"
          }`}
        >
          {/* Google Login Button */}
          {(!showEmailLogin || isTransitioningToGoogle) && (
            <div
              className={`transition-all duration-500 ease-in-out ${
                isTransitioningToGoogle
                  ? "opacity-0 max-h-0 mb-0"
                  : "opacity-100 max-h-20 mb-6"
              }`}
            >
              <Button
                className="w-full h-16 text-primary-foreground font-semibold text-base tracking-wide transition-all duration-300"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon className="mr-3 h-6 w-6" />
                Kontynuuj z kontem Google
              </Button>
            </div>
          )}

          {!showEmailLogin ? (
            <div className="text-center transition-all duration-500 ease-in-out">
              <Button
                variant="ghost"
                className="text-muted-foreground p-4 rounded-xl hover:bg-muted/50"
                onClick={() => setShowEmailLogin(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Użyj adresu email i hasła
              </Button>
            </div>
          ) : (
            <div className="transition-all duration-500 ease-in-out">
              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Wprowadź swój e-mail"
                      className="pl-10 h-14 bg-surface border-border rounded-2xl transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Wprowadź swoje hasło"
                      className="pl-10 pr-10 h-14 bg-surface border-border rounded-2xl  transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-primary-foreground font-semibold text-base tracking-wide transition-all duration-300 mt-8"
                  disabled={isLoading || !email.trim() || !password.trim()}
                >
                  {isLoading ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <Button variant="link">Zapomniałeś hasła?</Button>
                <div className="text-sm text-muted-foreground">
                  Nie masz konta?{" "}
                  <Button variant="link">Zarejestruj się</Button>
                </div>
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setShowEmailLogin(false);
                      setIsTransitioningToGoogle(true);
                      setTimeout(() => {
                        setIsTransitioningToGoogle(false);
                      }, 1);
                    }}
                  >
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Użyj konta Google
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
