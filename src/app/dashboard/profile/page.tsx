"use client";

import { useAuth } from "@/stores/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileSettings } from "./components/ProfileSettings";
import { EngagementStats } from "./components/EngagementStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Settings, BarChart3, Heart } from "lucide-react";
import { getUserDisplayName, getUserProfilePicture, getUserInitials } from "@/lib/user-utils";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, userProfile, profileLoading, interests } = useAuth();

  if (profileLoading && !userProfile) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  const displayName = getUserDisplayName(user);
  const profilePicture = getUserProfilePicture(user);
  const userInitials = getUserInitials(user);

  return (
    <div className="container py-8 px-4 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile?.profileImageUrl || profilePicture} alt={displayName} />
                <AvatarFallback className="text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold poetry-title mb-1">
                  {userProfile?.fullName || displayName}
                </h1>
                {userProfile?.username && (
                  <p className="text-lg text-muted-foreground mb-2">
                    @{userProfile.username}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  {userProfile?.bio || "Poetry enthusiast"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.readingLevel && (
                    <Badge variant="secondary">
                      {userProfile.readingLevel.charAt(0) + userProfile.readingLevel.slice(1).toLowerCase()} Reader
                    </Badge>
                  )}
                  {userProfile?.preferredLanguage && (
                    <Badge variant="outline">
                      {userProfile.preferredLanguage.toUpperCase()}
                    </Badge>
                  )}
                  {userProfile?.location && (
                    <Badge variant="outline">
                      📍 {userProfile.location}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {interests.length} Interest{interests.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="edit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="interests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Interests
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="interests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interests.map((interest) => (
                  <div
                    key={`${interest.interestType}-${interest.interestId}`}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{interest.interestName}</h3>
                      <Badge variant={interest.explicitPreference ? "default" : "secondary"}>
                        {interest.interestType}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${interest.strength * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {interest.explicitPreference ? "Explicit" : "Learned"} • {Math.round(interest.strength * 100)}% strength
                    </p>
                  </div>
                ))}
                {interests.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No interests yet. Complete your onboarding to add interests!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <EngagementStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container py-8 px-4 max-w-6xl">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-64 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}