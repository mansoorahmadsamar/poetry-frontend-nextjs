"use client";

import { useAuth } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserDisplayName, getUserProfilePicture, getUserInitials } from "@/lib/user-utils";
import { 
  PenTool, 
  BookOpen, 
  Heart, 
  Bookmark, 
  Calendar,
  TrendingUp,
  Users,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, userProfile, onboardingStep } = useAuth();
  const router = useRouter();

  if (!user) return null;

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (userProfile && !userProfile.onboardingCompleted && onboardingStep < 5) {
      router.push('/onboarding');
    }
  }, [userProfile, onboardingStep, router]);

  const userName = getUserDisplayName(user);
  const profilePicture = getUserProfilePicture(user);
  const userInitials = getUserInitials(user);

  return (
    <div className="container py-8 px-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profilePicture} alt={userName} />
            <AvatarFallback className="text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold poetry-title">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Ready to share some beautiful poetry today?
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/poems/upload">
              <PenTool className="mr-2 h-4 w-4" />
              Write New Poem
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/poems">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Poems
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Poems Written
              </CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Start writing your first poem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Likes Received
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Share poems to get likes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bookmarks
              </CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Bookmark poems you love
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Collections
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Your Recent Poems
              </CardTitle>
              <CardDescription>
                Your latest poetry creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No poems yet</p>
                <p className="mb-4">Start your poetry journey by writing your first poem.</p>
                <Button asChild>
                  <Link href="/poems/upload">
                    <Plus className="mr-2 h-4 w-4" />
                    Write Your First Poem
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bookmark className="mr-2 h-5 w-5" />
                Bookmarked Poems
              </CardTitle>
              <CardDescription>
                Poems you've saved for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No bookmarked poems</p>
                <p className="mb-4">Discover and bookmark poems you love.</p>
                <Button variant="outline" asChild>
                  <Link href="/poems">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Poems
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Poetry enthusiast
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/poems/upload">
                  <PenTool className="mr-2 h-4 w-4" />
                  Write a Poem
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/collections/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/poems">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Poems
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted mr-3"></div>
                  Complete your profile
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted mr-3"></div>
                  Write your first poem
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted mr-3"></div>
                  Explore community poems
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted mr-3"></div>
                  Create your first collection
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}