"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("Wystąpił nieznany błąd podczas logowania");

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  const handleRetryLogin = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Błąd logowania</CardTitle>
          <CardDescription>
            Nie udało się zalogować przez Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg text-center">
            {errorMessage}
          </div>
          
          <Button 
            onClick={handleRetryLogin}
            className="w-full"
          >
            Spróbuj ponownie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}