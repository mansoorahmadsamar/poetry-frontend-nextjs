// Auth types
export interface User {
  id: string;
  email: string;
  name: string; // Keep for backward compatibility
  fullName?: string; // Backend returns this field
  profilePicture?: string; // Keep for backward compatibility
  profileImageUrl?: string; // Backend returns this field
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Poem types
export interface Poem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: PoemCategory;
  tags: string[];
  authorId: string;
  author: User;
  isPublic: boolean;
  likesCount: number;
  bookmarksCount: number;
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PoemCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface CreatePoemDto {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdatePoemDto extends Partial<CreatePoemDto> {
  id: string;
}

// Collection types
export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  authorId: string;
  author: User;
  poems: Poem[];
  poemsCount: number;
  followersCount: number;
  isFollowedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionDto {
  name: string;
  description?: string;
  isPublic: boolean;
  poemIds?: string[];
}

export interface UpdateCollectionDto extends Partial<CreateCollectionDto> {
  id: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'title' | 'likesCount' | 'bookmarksCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PoemFilters extends SearchFilters {
  isPublic?: boolean;
}

export interface CollectionFilters extends SearchFilters {
  isPublic?: boolean;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
}

// Form types
export interface LoginFormData {
  redirectTo?: string;
}

export interface PoemFormData {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
}

export interface CollectionFormData {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  profilePicture?: File;
}

// Component Props types
export interface PoemCardProps {
  poem: Poem;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export interface CollectionCardProps {
  collection: Collection;
  showActions?: boolean;
}

export interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

// Hook return types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (redirectTo?: string) => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

export interface UsePoemsReturn {
  poems: Poem[];
  isLoading: boolean;
  error: Error | null;
  fetchMore: () => void;
  hasMore: boolean;
}

// Constants
export const POEM_CATEGORIES = [
  { id: 'love', name: 'Love & Romance', color: '#ef4444', description: 'Poems about love and relationships' },
  { id: 'nature', name: 'Nature', color: '#22c55e', description: 'Poems about the natural world' },
  { id: 'life', name: 'Life & Philosophy', color: '#3b82f6', description: 'Poems about life experiences and philosophy' },
  { id: 'grief', name: 'Grief & Loss', color: '#6b7280', description: 'Poems about loss and mourning' },
  { id: 'celebration', name: 'Celebration', color: '#f59e0b', description: 'Poems about joy and celebration' },
  { id: 'spiritual', name: 'Spiritual', color: '#8b5cf6', description: 'Poems about spirituality and faith' },
  { id: 'social', name: 'Social Commentary', color: '#ef4444', description: 'Poems about social issues' },
  { id: 'experimental', name: 'Experimental', color: '#ec4899', description: 'Experimental and avant-garde poetry' },
] as const;

export type PoemCategoryId = typeof POEM_CATEGORIES[number]['id'];

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];