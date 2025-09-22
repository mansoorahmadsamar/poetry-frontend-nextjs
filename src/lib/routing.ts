import { ExtendedUser } from "@/types/profile";

export interface RouteDecision {
  shouldRedirect: boolean;
  redirectPath?: string;
  reason?: string;
}

export class RoutingManager {
  /**
   * Determines where to redirect a user based on their profile and current route
   */
  static getAuthRedirect(userProfile: ExtendedUser | null, currentPath: string, intendedDestination?: string): RouteDecision {
    // If user profile is not loaded yet, don't redirect
    if (!userProfile) {
      return { shouldRedirect: false };
    }

    // Skip onboarding completely - redirect away from onboarding to dashboard
    if (currentPath.startsWith('/onboarding')) {
      return {
        shouldRedirect: true,
        redirectPath: intendedDestination || '/dashboard',
        reason: 'Onboarding skipped - redirecting to dashboard'
      };
    }

    return { shouldRedirect: false };
  }

  /**
   * Determines the redirect path after successful authentication
   */
  static getPostAuthRedirect(userProfile: ExtendedUser | null, intendedDestination?: string): string {
    // Always redirect to dashboard (feed) - skip onboarding completely
    return intendedDestination || '/dashboard';
  }

  /**
   * Checks if a route requires onboarding to be completed
   */
  static requiresOnboarding(path: string): boolean {
    const onboardingRequiredRoutes = [
      '/dashboard',
      '/poems',
      '/collections',
      '/profile',
      '/bookmarks'
    ];

    return onboardingRequiredRoutes.some(route => path.startsWith(route));
  }

  /**
   * Checks if a route is part of the onboarding flow
   */
  static isOnboardingRoute(path: string): boolean {
    return path.startsWith('/onboarding');
  }

  /**
   * Checks if a route is publicly accessible without authentication
   */
  static isPublicRoute(path: string): boolean {
    const publicRoutes = [
      '/',
      '/login',
      '/about',
      '/privacy',
      '/terms',
      '/auth/callback'
    ];

    return publicRoutes.some(route => path === route || path.startsWith(route));
  }
}