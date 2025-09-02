import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthTokens } from "@/types";
import { authManager } from "@/lib/auth";
import { apiClient } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (redirectTo?: string) => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

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
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error instanceof Error ? error.message : "Authentication failed" 
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
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
    setUser,
    setLoading,
    setError,
    login,
    logout,
    refreshTokens,
    initializeAuth,
    clearError,
  } = useAuthStore();

  return {
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
  };
};