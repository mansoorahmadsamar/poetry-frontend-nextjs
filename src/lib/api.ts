import { ApiResponse, ApiError, AuthTokens } from "@/types";
import {
  ExtendedUser,
  UserInterest,
  EngagementActivity,
  UpdateProfileRequest,
  AddInterestRequest,
  TrackEngagementRequest,
  ProfileResponse,
  InterestsResponse,
  EngagementResponse,
  InterestType
} from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
  private baseURL: string;
  private getAuthToken: () => string | null;
  private onUnauthorized?: () => void;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.getAuthToken = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("accessToken");
      }
      return null;
    };
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && this.onUnauthorized) {
        this.onUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        
        const error: ApiError = {
          message: errorData.message || "An error occurred",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
        
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        throw error;
      }
      
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      
      throw {
        message: error instanceof Error ? error.message : "Network error",
        status: 500,
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
  }

  // Auth endpoints
  async login(redirectTo?: string): Promise<void> {
    const params = new URLSearchParams();
    if (redirectTo) {
      params.set("redirect_uri", `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`);
    } else {
      params.set("redirect_uri", `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`);
    }
    
    const loginUrl = `${this.baseURL}/oauth2/authorization/google?${params.toString()}`;
    window.location.href = loginUrl;
  }

  async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.request<ApiResponse<AuthTokens>>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    return response.data;
  }

  async getMe(): Promise<any> {
    const response = await this.request<ApiResponse<any>>("/api/auth/me");
    return response.data;
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  // Poems endpoints
  async getPoems(params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/poems${queryString}`);
    return response.data;
  }

  async getPoem(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}`);
    return response.data;
  }

  async createPoem(poem: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>("/api/poems", {
      method: "POST",
      body: JSON.stringify(poem),
    });
    return response.data;
  }

  async updatePoem(id: string, poem: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}`, {
      method: "PUT",
      body: JSON.stringify(poem),
    });
    return response.data;
  }

  async deletePoem(id: string): Promise<void> {
    await this.request(`/api/poems/${id}`, {
      method: "DELETE",
    });
  }

  async likePoem(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}/like`, {
      method: "POST",
    });
    return response.data;
  }

  async unlikePoem(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}/like`, {
      method: "DELETE",
    });
    return response.data;
  }

  async bookmarkPoem(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}/bookmark`, {
      method: "POST",
    });
    return response.data;
  }

  async unbookmarkPoem(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poems/${id}/bookmark`, {
      method: "DELETE",
    });
    return response.data;
  }

  // Collections endpoints
  async getCollections(params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/collections${queryString}`);
    return response.data;
  }

  async getCollection(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/collections/${id}`);
    return response.data;
  }

  async createCollection(collection: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>("/api/collections", {
      method: "POST",
      body: JSON.stringify(collection),
    });
    return response.data;
  }

  async updateCollection(id: string, collection: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(collection),
    });
    return response.data;
  }

  async deleteCollection(id: string): Promise<void> {
    await this.request(`/api/collections/${id}`, {
      method: "DELETE",
    });
  }

  async addPoemToCollection(collectionId: string, poemId: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/collections/${collectionId}/poems`, {
      method: "POST",
      body: JSON.stringify({ poemId }),
    });
    return response.data;
  }

  async removePoemFromCollection(collectionId: string, poemId: string): Promise<void> {
    await this.request(`/api/collections/${collectionId}/poems/${poemId}`, {
      method: "DELETE",
    });
  }

  // User/Profile endpoints
  async getUser(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/users/${id}`);
    return response.data;
  }

  async updateProfile(profile: any): Promise<any> {
    const response = await this.request<ApiResponse<any>>("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
    return response.data;
  }

  async getUserPoems(userId: string, params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/users/${userId}/poems${queryString}`);
    return response.data;
  }

  async getUserCollections(userId: string, params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/users/${userId}/collections${queryString}`);
    return response.data;
  }

  async getBookmarkedPoems(params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/users/bookmarks${queryString}`);
    return response.data;
  }

  // Categories endpoint
  async getCategories(params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/categories${queryString}`);
    return response.data;
  }

  // Search endpoint
  async search(query: string, type?: string): Promise<any> {
    const params = new URLSearchParams({ q: query });
    if (type) params.set("type", type);
    
    const response = await this.request<ApiResponse<any>>(`/api/search?${params.toString()}`);
    return response.data;
  }

  // Profile Management endpoints
  async getProfile(): Promise<ExtendedUser> {
    const response = await this.request<ProfileResponse>("/api/profile");
    return response.data;
  }

  async updateUserProfile(data: UpdateProfileRequest): Promise<ExtendedUser> {
    const response = await this.request<ProfileResponse>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async completeOnboarding(): Promise<ExtendedUser> {
    const response = await this.request<ProfileResponse>("/api/profile/complete-onboarding", {
      method: "POST",
    });
    return response.data;
  }

  // Interest Management endpoints
  async getInterests(): Promise<UserInterest[]> {
    const response = await this.request<InterestsResponse>("/api/profile/interests");
    return response.data;
  }

  async getInterestsByType(interestType: InterestType): Promise<UserInterest[]> {
    const response = await this.request<InterestsResponse>(`/api/profile/interests/${interestType}`);
    return response.data;
  }

  async addInterest(interest: AddInterestRequest): Promise<UserInterest> {
    const response = await this.request<ApiResponse<UserInterest>>("/api/profile/interests", {
      method: "POST",
      body: JSON.stringify(interest),
    });
    return response.data;
  }

  async removeInterest(interestType: InterestType, interestId: number): Promise<void> {
    await this.request(`/api/profile/interests/${interestType}/${interestId}`, {
      method: "DELETE",
    });
  }

  // Engagement Tracking endpoints
  async trackEngagement(engagement: TrackEngagementRequest): Promise<EngagementActivity> {
    const response = await this.request<ApiResponse<EngagementActivity>>("/api/profile/engagement/track", {
      method: "POST",
      body: JSON.stringify(engagement),
    });
    return response.data;
  }

  async getRecentEngagement(days: number = 30): Promise<EngagementActivity[]> {
    const response = await this.request<EngagementResponse>(`/api/profile/engagement/recent?days=${days}`);
    return response.data;
  }

  async getTopEngagedContent(targetType: string, days: number = 30): Promise<EngagementActivity[]> {
    const response = await this.request<EngagementResponse>(`/api/profile/engagement/top/${targetType}?days=${days}`);
    return response.data;
  }

  // Poets endpoint
  async getPoets(params?: Record<string, any>): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await this.request<ApiResponse<any>>(`/api/poets${queryString}`);
    return response.data;
  }

  async getPoet(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/poets/${id}`);
    return response.data;
  }

  // Tags endpoint
  async getTags(): Promise<any> {
    const response = await this.request<ApiResponse<any>>("/api/tags");
    return response.data;
  }
}

export const apiClient = new ApiClient();