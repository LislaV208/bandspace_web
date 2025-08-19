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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { ApiError, apiClient } from "@/lib/api";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "./google-icon";

export function LoginForm() {
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [isTransitioningToGoogle, setIsTransitioningToGoogle] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isLoginView && password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    try {
      setError(null);
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth failed:", error);
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Nieprawidłowy e-mail lub hasło");
        } else if (error.status === 409) {
          setError("Użytkownik z tym adresem e-mail już istnieje");
        } else {
          setError(error.message);
        }
      } else {
        setError(
          isLoginView
            ? "Logowanie nie powiodło się. Spróbuj ponownie."
            : "Rejestracja nie powiodła się. Spróbuj ponownie."
        );
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    try {
      setResetError(null);
      setResetLoading(true);
      await apiClient.requestPasswordReset(resetEmail);
      setResetSuccess(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      if (error instanceof ApiError) {
        setResetError(error.message);
      } else {
        setResetError("Nie udało się wysłać emaila resetującego. Spróbuj ponownie.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetModalClose = () => {
    setShowResetModal(false);
    setResetEmail("");
    setResetSuccess(false);
    setResetError(null);
    setResetLoading(false);
  };

  return (
    <Card className="border-border bg-card shadow-2xl shadow-black/20 rounded-3xl">
      <CardHeader className="space-y-2 pb-2 pt-8 px-8">
        <div className="transition-all duration-500 ease-in-out">
          <CardTitle className="text-3xl text-center font-bold tracking-tight">
            {isLoginView ? "Witaj z powrotem!" : "Dołącz do BandSpace"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLoginView
              ? "Zaloguj się, aby kontynuować pracę nad swoimi projektami"
              : "Utwórz konto, aby rozpocząć współpracę muzyczną"}
          </CardDescription>
        </div>
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
              <form onSubmit={handleEmailSubmit} className="space-y-4">
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

                {/* Confirm Password field for registration with animation */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    !isLoginView ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {!isLoginView && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Potwierdź swoje hasło"
                          className="pl-10 pr-10 h-14 bg-surface border-border rounded-2xl transition-all duration-300"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required={!isLoginView}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-primary-foreground font-semibold text-base tracking-wide transition-all duration-300 mt-4"
                  disabled={
                    isLoading ||
                    !email.trim() ||
                    !password.trim() ||
                    (!isLoginView && !confirmPassword.trim())
                  }
                >
                  {isLoading
                    ? isLoginView
                      ? "Logowanie..."
                      : "Tworzenie konta..."
                    : isLoginView
                    ? "Zaloguj się"
                    : "Utwórz konto"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                {/* Forgot password - only visible during login */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isLoginView
                      ? "max-h-10 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {isLoginView && (
                    <Button 
                      variant="link"
                      onClick={() => {
                        setShowResetModal(true);
                        setResetEmail(email); // Pre-fill with current email if available
                      }}
                    >
                      Zapomniałeś hasła?
                    </Button>
                  )}
                </div>

                {/* Toggle between login/register */}
                <div className="text-sm text-muted-foreground transition-all duration-500 ease-in-out">
                  {isLoginView ? "Nie masz konta?" : "Masz już konto?"}{" "}
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLoginView(!isLoginView);
                      setError(null);
                      setPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    {isLoginView ? "Zarejestruj się" : "Zaloguj się"}
                  </Button>
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

      {/* Password Reset Modal */}
      <Dialog open={showResetModal} onOpenChange={handleResetModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Resetowanie hasła
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Podaj adres e-mail, a wyślemy Ci link do resetowania hasła
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Email wysłany!</h3>
                <p className="text-muted-foreground text-sm">
                  Sprawdź swoją skrzynkę pocztową i kliknij w link resetujący hasło.
                </p>
              </div>
              <Button 
                onClick={handleResetModalClose}
                className="w-full"
              >
                Zamknij
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {resetError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center border border-destructive/30">
                  {resetError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="resetEmail">Adres e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Wprowadź swój e-mail"
                    className="pl-10 h-12"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={resetLoading}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetModalClose}
                  disabled={resetLoading}
                  className="flex-1"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  disabled={resetLoading || !resetEmail.trim()}
                  className="flex-1"
                >
                  {resetLoading ? "Wysyłanie..." : "Wyślij"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
