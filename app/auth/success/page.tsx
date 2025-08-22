import { Suspense } from "react";
import { SuccessContent } from "./success-content";
import AuthSuccessLoading from "./loading";

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<AuthSuccessLoading />}>
      <SuccessContent />
    </Suspense>
  );
}
