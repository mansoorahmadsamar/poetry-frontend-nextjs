import { AuthTokens, User } from "@/types";
import { apiClient } from "./api";

export class AuthManager {
  private static instance: AuthManager;
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    
    this.scheduleTokenRefresh(tokens.accessToken);
  }

  getTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  setUser(user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getTokens() !== null;
  }

  private parseJWT(token: string): { exp: number } | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  }

  private scheduleTokenRefresh(accessToken: string): void {
    const payload = this.parseJWT(accessToken);
    if (!payload) return;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;
    
    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(0, (timeUntilExpiry - 300) * 1000);

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    this.refreshTimeout = setTimeout(async () => {
      try {
        const newTokens = await apiClient.refreshTokens();
        this.setTokens(newTokens);
      } catch (error) {
        console.error("Failed to refresh tokens:", error);
        this.clearTokens();
        window.location.href = "/login";
      }
    }, refreshTime);
  }

  async refreshTokens(): Promise<void> {
    try {
      const newTokens = await apiClient.refreshTokens();
      this.setTokens(newTokens);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      this.clearTokens();
    }
  }

  async initializeAuth(): Promise<User | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    try {
      // Schedule token refresh
      this.scheduleTokenRefresh(tokens.accessToken);
      
      // Fetch user data
      const user = await apiClient.getMe();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      this.clearTokens();
      return null;
    }
  }
}

export const authManager = AuthManager.getInstance();

// Set up the API client to handle unauthorized responses
apiClient.setUnauthorizedHandler(() => {
  authManager.clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
});