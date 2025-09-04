import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthTokens } from "@/types";
import { authManager } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { 
  ExtendedUser, 
  UserInterest, 
  EngagementActivity,
  UpdateProfileRequest,
  AddInterestRequest,
  TrackEngagementRequest
} from "@/types/profile";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Profile data
  userProfile: ExtendedUser | null;
  interests: UserInterest[];
  onboardingStep: number;
  profileLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (redirectTo?: string) => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  
  // Profile actions
  loadProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setOnboardingStep: (step: number) => void;
  
  // Interest actions
  loadInterests: () => Promise<void>;
  addInterest: (interest: AddInterestRequest) => Promise<void>;
  removeInterest: (type: string, id: number) => Promise<void>;
  
  // Engagement actions
  trackEngagement: (engagement: TrackEngagementRequest) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Profile state
      userProfile: null,
      interests: [],
      onboardingStep: 0,
      profileLoading: false,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        });
        if (user) {
          authManager.setUser(user);
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: (redirectTo) => {
        set({ isLoading: true, error: null });
        try {
          apiClient.login(redirectTo);
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Login failed" 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authManager.logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : "Logout failed" 
          });
        }
      },

      refreshTokens: async () => {
        try {
          await authManager.refreshTokens();
          // User data should remain the same after token refresh
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: error instanceof Error ? error.message : "Token refresh failed" 
          });
          throw error;
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authManager.initializeAuth();
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          });
          
          // Load profile if user is authenticated
          if (user) {
            get().loadProfile();
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error instanceof Error ? error.message : "Authentication failed" 
          });
        }
      },

      // Profile actions
      loadProfile: async () => {
        set({ profileLoading: true });
        try {
          const profile = await apiClient.getProfile();
          set({ 
            userProfile: profile,
            profileLoading: false,
            onboardingStep: profile.onboardingCompleted ? 5 : 0
          });
        } catch (error) {
          set({ 
            profileLoading: false,
            error: error instanceof Error ? error.message : "Failed to load profile"
          });
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        set({ profileLoading: true });
        try {
          const updatedProfile = await apiClient.updateUserProfile(data);
          set({ 
            userProfile: updatedProfile,
            profileLoading: false 
          });
        } catch (error) {
          set({ 
            profileLoading: false,
            error: error instanceof Error ? error.message : "Failed to update profile"
          });
          throw error;
        }
      },

      completeOnboarding: async () => {
        set({ profileLoading: true });
        try {
          const updatedProfile = await apiClient.completeOnboarding();
          set({ 
            userProfile: updatedProfile,
            onboardingStep: 5,
            profileLoading: false 
          });
        } catch (error) {
          set({ 
            profileLoading: false,
            error: error instanceof Error ? error.message : "Failed to complete onboarding"
          });
          throw error;
        }
      },

      setOnboardingStep: (step: number) => {
        set({ onboardingStep: step });
      },

      // Interest actions
      loadInterests: async () => {
        try {
          const interests = await apiClient.getInterests();
          set({ interests });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to load interests"
          });
        }
      },

      addInterest: async (interest: AddInterestRequest) => {
        try {
          const newInterest = await apiClient.addInterest(interest);
          set(state => ({ 
            interests: [...state.interests, newInterest] 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to add interest"
          });
          throw error;
        }
      },

      removeInterest: async (type: string, id: number) => {
        try {
          await apiClient.removeInterest(type as any, id);
          set(state => ({ 
            interests: state.interests.filter(
              interest => !(interest.interestType === type && interest.interestId === id)
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to remove interest"
          });
          throw error;
        }
      },

      // Engagement actions
      trackEngagement: async (engagement: TrackEngagementRequest) => {
        try {
          await apiClient.trackEngagement(engagement);
        } catch (error) {
          // Silently fail for engagement tracking to not disrupt user experience
          console.error("Failed to track engagement:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userProfile: state.userProfile,
        onboardingStep: state.onboardingStep
      }),
    }
  )
);

// Auth hook
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    userProfile,
    interests,
    onboardingStep,
    profileLoading,
    setUser,
    setLoading,
    setError,
    login,
    logout,
    refreshTokens,
    initializeAuth,
    clearError,
    loadProfile,
    updateProfile,
    completeOnboarding,
    setOnboardingStep,
    loadInterests,
    addInterest,
    removeInterest,
    trackEngagement,
  } = useAuthStore();

  return {
    // Basic auth
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    login,
    logout,
    refreshTokens,
    initializeAuth,
    clearError,
    
    // Profile
    userProfile,
    interests,
    onboardingStep,
    profileLoading,
    loadProfile,
    updateProfile,
    completeOnboarding,
    setOnboardingStep,
    loadInterests,
    addInterest,
    removeInterest,
    trackEngagement,
  };
};