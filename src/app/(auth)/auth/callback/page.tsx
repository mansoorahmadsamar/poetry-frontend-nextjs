"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authManager } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { RoutingManager } from "@/lib/routing";
import { useAuth } from "@/stores/auth";
import { AuthTokens } from "@/types";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        // Extract tokens from URL parameters
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const redirectTo = searchParams.get("redirectTo");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(error);
        }

        if (!accessToken || !refreshToken) {
          throw new Error("Missing authentication tokens");
        }

        // Store tokens
        const tokens: AuthTokens = {
          accessToken,
          refreshToken,
        };

        authManager.setTokens(tokens);

        // Initialize auth and get user data
        const user = await authManager.initializeAuth();
        if (!user) {
          throw new Error("Failed to get user data");
        }

        setUser(user);
        setStatus("success");

        // Auto-save auth provider information to profile and complete onboarding
        try {
          // Update profile with auth provider information
          const updateData = {
            fullName: user.fullName || user.name,
            username: user.email.split('@')[0], // Use email prefix as default username
            preferredLanguage: 'en',
            readingLevel: 'BEGINNER' as const,
            profileVisibility: 'PUBLIC' as const
          };

          await apiClient.updateUserProfile(updateData);

          // Complete onboarding automatically (in case it's not completed)
          await apiClient.completeOnboarding();
        } catch (error) {
          // Silently continue if profile update fails - user can update later
          console.log("Profile update skipped:", error);
        }

        // Always redirect to dashboard (feed)
        const redirectDestination = redirectTo || '/dashboard';

        // Redirect after a short delay
        setTimeout(() => {
          router.push(redirectDestination);
        }, 2000);

      } catch (error) {
        console.error("Authentication callback failed:", error);
        setError(error instanceof Error ? error.message : "Authentication failed");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, setLoading]);

  const handleRetry = () => {
    router.push("/login");
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {status === "success" && <CheckCircle className="h-8 w-8 text-green-500" />}
            {status === "error" && <AlertCircle className="h-8 w-8 text-red-500" />}
          </div>
          <CardTitle>
            {status === "loading" && "Signing you in..."}
            {status === "success" && "Welcome!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we complete your sign in."}
            {status === "success" && "You have been successfully signed in. Redirecting you now..."}
            {status === "error" && "We encountered an issue while signing you in."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="text-center text-sm text-muted-foreground">
              This should only take a moment...
            </div>
          )}
          
          {status === "success" && (
            <div className="text-center text-sm text-muted-foreground">
              You'll be redirected to your dashboard shortly.
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}