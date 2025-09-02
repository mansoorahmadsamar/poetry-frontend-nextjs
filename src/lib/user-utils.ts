import { User } from "@/types";

/**
 * Get the display name for a user, handling different backend field formats
 */
export function getUserDisplayName(user: User): string {
  // Backend returns fullName
  if ((user as any).fullName) return (user as any).fullName;
  // Fallback to name if available
  if (user.name) return user.name;
  // Handle Google OAuth format
  if ((user as any).given_name && (user as any).family_name) {
    return `${(user as any).given_name} ${(user as any).family_name}`;
  }
  if ((user as any).given_name) return (user as any).given_name;
  // Extract name from email as last resort
  if (user.email) {
    return user.email.split('@')[0].replace(/[._]/g, ' ');
  }
  return "User";
}

/**
 * Get the profile picture URL for a user, handling different backend field formats
 */
export function getUserProfilePicture(user: User): string | undefined {
  // Backend returns profileImageUrl
  if ((user as any).profileImageUrl) return (user as any).profileImageUrl;
  // Fallback to profilePicture if available
  if (user.profilePicture) return user.profilePicture;
  // Handle Google OAuth format
  if ((user as any).picture) return (user as any).picture;
  return undefined;
}

/**
 * Get initials for a user's avatar fallback
 */
export function getUserInitials(user: User): string {
  const displayName = getUserDisplayName(user);
  
  if (displayName && displayName !== "User") {
    return displayName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return "U";
}