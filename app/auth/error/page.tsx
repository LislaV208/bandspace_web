import { Suspense } from "react";
import { ErrorContent } from "./error-content";
import AuthErrorLoading from "./loading";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <ErrorContent />
    </Suspense>
  );
}