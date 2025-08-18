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
import { Separator } from "@/components/ui/separator";
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
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Zaloguj się</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Wybierz preferowany sposób logowania
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <Button
          variant="outline"
          className="w-full h-12 border-border hover:bg-secondary bg-transparent"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2 h-5 w-5" />
          Kontynuuj z Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Lub kontynuuj z
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Wprowadź swój e-mail"
                className="pl-10 h-12 bg-input border-border"
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
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Wprowadź swoje hasło"
                className="pl-10 pr-10 h-12 bg-input border-border"
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
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button
            variant="link"
            className="text-accent hover:text-accent/80 p-0"
          >
            Zapomniałeś hasła?
          </Button>
          <div className="text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Button
              variant="link"
              className="text-accent hover:text-accent/80 p-0"
            >
              Zarejestruj się
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
