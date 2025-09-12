"use client";

import { useAuth } from "@/stores/auth";
import { useAuthRouting } from "@/hooks/use-auth-routing";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { OnboardingWizard } from "./components/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}

function OnboardingContent() {
  const { isLoading, shouldShowContent } = useAuthRouting();

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/20">
      <div className="container py-8 px-4">
        <OnboardingWizard />
      </div>
    </div>
  );
}