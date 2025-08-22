import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 rounded-full p-3 animate-pulse">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Błąd logowania</CardTitle>
          <CardDescription>Ładowanie...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg text-center animate-pulse">
            Ładowanie komunikatu błędu...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
