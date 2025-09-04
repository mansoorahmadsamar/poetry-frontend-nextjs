// Extended profile and interest management types
export type InterestType = 'CATEGORY' | 'POET' | 'TAG' | 'LANGUAGE' | 'CONTENT_TYPE';
export type ActivityType = 'VIEW' | 'LIKE' | 'UNLIKE' | 'BOOKMARK' | 'UNBOOKMARK' | 'SHARE' | 'SEARCH' | 'FOLLOW_POET' | 'UNFOLLOW_POET';
export type TargetType = 'POEM' | 'POET' | 'CATEGORY' | 'TAG' | 'COLLECTION' | 'USER';
export type ReadingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProfileVisibility = 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Extended User Profile
export interface ExtendedUser {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: Gender;
  location?: string;
  country?: string;
  preferredLanguage: string;
  readingLevel: ReadingLevel;
  onboardingCompleted: boolean;
  profileVisibility: ProfileVisibility;
  createdAt: string;
  updatedAt: string;
}

// User Interest
export interface UserInterest {
  id: number;
  interestType: InterestType;
  interestId: number;
  interestName: string;
  strength: number; // 0.0 to 1.0
  explicitPreference: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Engagement Activity
export interface EngagementActivity {
  id: number;
  activityType: ActivityType;
  targetType: TargetType;
  targetId: number;
  durationSeconds?: number;
  interactionStrength: number;
  activityTimestamp: string;
  sessionId?: string;
  deviceType?: string;
  metadata?: string;
}

// Request DTOs
export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: Gender;
  location?: string;
  country?: string;
  preferredLanguage?: string;
  readingLevel?: ReadingLevel;
  profileVisibility?: ProfileVisibility;
}

export interface AddInterestRequest {
  interestType: InterestType;
  interestId: number;
  interestName: string;
  strength: number;
  explicitPreference: boolean;
}

export interface TrackEngagementRequest {
  activityType: ActivityType;
  targetType: TargetType;
  targetId: number;
  durationSeconds?: number;
  sessionId?: string;
  deviceType?: string;
  metadata?: string;
}

// Response types
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ExtendedUser;
}

export interface InterestsResponse {
  success: boolean;
  message?: string;
  data: UserInterest[];
}

export interface EngagementResponse {
  success: boolean;
  message?: string;
  data: EngagementActivity[];
}

// Onboarding types
export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface OnboardingData {
  basicInfo: {
    fullName?: string;
    username?: string;
    bio?: string;
    dateOfBirth?: string;
    gender?: Gender;
    location?: string;
    country?: string;
  };
  preferences: {
    preferredLanguage: string;
    readingLevel: ReadingLevel;
    profileVisibility: ProfileVisibility;
  };
  interests: {
    categories: number[];
    poets: number[];
    languages: number[];
    contentTypes: number[];
  };
}

// Form types for components
export interface ProfileFormData {
  fullName: string;
  username: string;
  bio: string;
  dateOfBirth: string;
  gender: Gender | '';
  location: string;
  country: string;
  preferredLanguage: string;
  readingLevel: ReadingLevel;
  profileVisibility: ProfileVisibility;
}

export interface OnboardingFormData {
  step1: {
    fullName: string;
    username: string;
    bio: string;
    dateOfBirth: string;
    gender: Gender | '';
    location: string;
    country: string;
  };
  step2: {
    preferredLanguage: string;
    readingLevel: ReadingLevel;
    profileVisibility: ProfileVisibility;
  };
  step3: {
    selectedCategories: number[];
  };
  step4: {
    selectedPoets: number[];
  };
}

// Utility types
export interface InterestOption {
  id: number;
  name: string;
  description?: string;
  color?: string;
  selected?: boolean;
  strength?: number;
}

export interface EngagementStats {
  totalActivities: number;
  averageReadingTime: number;
  favoriteCategories: string[];
  topPoets: string[];
  engagementTrend: {
    date: string;
    count: number;
  }[];
}

// Constants
export const READING_LEVELS: { value: ReadingLevel; label: string; description: string }[] = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    description: 'New to poetry, prefer simple and accessible poems'
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    description: 'Familiar with poetry, enjoy various styles and themes'
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    description: 'Experienced reader, appreciate complex and experimental poetry'
  }
];

export const PROFILE_VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; description: string }[] = [
  {
    value: 'PUBLIC',
    label: 'Public',
    description: 'Everyone can see your profile and activities'
  },
  {
    value: 'FRIENDS_ONLY',
    label: 'Friends Only',
    description: 'Only people you follow can see your profile'
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Only you can see your profile activities'
  }
];

export const GENDER_OPTIONS: { value: Gender | 'none'; label: string }[] = [
  { value: 'none', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'Urdu' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fa', label: 'Persian' },
  { value: 'hi', label: 'Hindi' }
];

export const COUNTRIES = [
  'Select Country', 'Afghanistan', 'Bangladesh', 'India', 'Iran', 'Iraq', 'Pakistan', 
  'Saudi Arabia', 'Turkey', 'United Arab Emirates', 'United Kingdom', 
  'United States', 'Canada', 'Australia', 'Other'
];