"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/stores/auth";
import { RoutingManager } from "@/lib/routing";

export function useAuthRouting() {
  const { userProfile, isAuthenticated, isLoading, profileLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading || profileLoading) return;

    // If user is not authenticated, let ProtectedRoute handle the redirect
    if (!isAuthenticated) return;

    // Only handle routing when we have profile data
    if (userProfile) {
      const decision = RoutingManager.getAuthRedirect(userProfile, pathname);
      
      if (decision.shouldRedirect && decision.redirectPath) {
        console.log(`Redirecting: ${decision.reason} - ${pathname} -> ${decision.redirectPath}`);
        router.push(decision.redirectPath);
      }
    }
  }, [userProfile, isAuthenticated, isLoading, profileLoading, pathname, router]);

  return {
    isLoading: isLoading || profileLoading,
    shouldShowContent: isAuthenticated && !isLoading && !profileLoading,
    userProfile,
    routingDecision: userProfile ? RoutingManager.getAuthRedirect(userProfile, pathname) : null
  };
}