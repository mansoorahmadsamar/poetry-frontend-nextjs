"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";
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
  const { userProfile, onboardingStep } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if onboarding is already completed
    if (userProfile?.onboardingCompleted || onboardingStep >= 5) {
      router.push("/dashboard");
    }
  }, [userProfile, onboardingStep, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/20">
      <div className="container py-8 px-4">
        <OnboardingWizard />
      </div>
    </div>
  );
}