"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { EngagementActivity } from "@/types/profile";
import { BarChart3, Eye, Heart, Bookmark, Share2, Search, Clock, TrendingUp } from "lucide-react";

interface EngagementStats {
  totalActivities: number;
  averageReadingTime: number;
  favoriteCategories: { name: string; count: number }[];
  topPoets: { name: string; count: number }[];
  recentActivities: EngagementActivity[];
  weeklyStats: { day: string; count: number }[];
}

export function EngagementStats() {
  const [stats, setStats] = useState<EngagementStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagementStats();
  }, []);

  const loadEngagementStats = async () => {
    setLoading(true);
    try {
      // Load recent engagement data
      const recentActivities = await apiClient.getRecentEngagement(30);
      
      // Process the data to create meaningful stats
      const processedStats: EngagementStats = {
        totalActivities: recentActivities.length,
        averageReadingTime: calculateAverageReadingTime(recentActivities),
        favoriteCategories: extractFavoriteCategories(recentActivities),
        topPoets: extractTopPoets(recentActivities),
        recentActivities: recentActivities.slice(0, 10),
        weeklyStats: generateWeeklyStats(recentActivities),
      };

      setStats(processedStats);
    } catch (error) {
      console.error("Failed to load engagement stats:", error);
      // Set empty stats on error
      setStats({
        totalActivities: 0,
        averageReadingTime: 0,
        favoriteCategories: [],
        topPoets: [],
        recentActivities: [],
        weeklyStats: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageReadingTime = (activities: EngagementActivity[]): number => {
    const viewActivities = activities.filter(a => a.activityType === 'VIEW' && a.durationSeconds);
    if (viewActivities.length === 0) return 0;
    
    const totalTime = viewActivities.reduce((sum, activity) => 
      sum + (activity.durationSeconds || 0), 0
    );
    return Math.round(totalTime / viewActivities.length);
  };

  const extractFavoriteCategories = (activities: EngagementActivity[]) => {
    const categoryCount: Record<string, number> = {};
    
    // This would normally come from the backend with proper category names
    activities.forEach(activity => {
      if (activity.targetType === 'CATEGORY') {
        const categoryName = `Category ${activity.targetId}`;
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      }
    });

    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const extractTopPoets = (activities: EngagementActivity[]) => {
    const poetCount: Record<string, number> = {};
    
    activities.forEach(activity => {
      if (activity.targetType === 'POET') {
        const poetName = `Poet ${activity.targetId}`;
        poetCount[poetName] = (poetCount[poetName] || 0) + 1;
      }
    });

    return Object.entries(poetCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateWeeklyStats = (activities: EngagementActivity[]) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyCount: Record<string, number> = {};
    
    // Initialize all days with 0
    days.forEach(day => {
      weeklyCount[day] = 0;
    });

    // Count activities by day of week
    activities.forEach(activity => {
      const date = new Date(activity.activityTimestamp);
      const dayIndex = date.getDay();
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]; // Convert Sunday=0 to our format
      weeklyCount[dayName]++;
    });

    return days.map(day => ({ day, count: weeklyCount[day] }));
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'VIEW': return <Eye className="h-4 w-4" />;
      case 'LIKE': return <Heart className="h-4 w-4" />;
      case 'BOOKMARK': return <Bookmark className="h-4 w-4" />;
      case 'SHARE': return <Share2 className="h-4 w-4" />;
      case 'SEARCH': return <Search className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'VIEW': return 'text-blue-600';
      case 'LIKE': return 'text-red-600';
      case 'BOOKMARK': return 'text-yellow-600';
      case 'SHARE': return 'text-green-600';
      case 'SEARCH': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return <EngagementStatsSkeleton />;
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Unable to load engagement statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.totalActivities}</p>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.averageReadingTime}s</p>
                <p className="text-xs text-muted-foreground">Avg Reading Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {stats.recentActivities.filter(a => a.activityType === 'LIKE').length}
                </p>
                <p className="text-xs text-muted-foreground">Poems Liked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Bookmark className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {stats.recentActivities.filter(a => a.activityType === 'BOOKMARK').length}
                </p>
                <p className="text-xs text-muted-foreground">Poems Bookmarked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Your poetry engagement over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.weeklyStats.map((stat, index) => (
              <div key={stat.day} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium">{stat.day}</div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${stats.totalActivities > 0 ? (stat.count / Math.max(...stats.weeklyStats.map(s => s.count))) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="w-8 text-sm text-muted-foreground">{stat.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Categories & Poets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Favorite Categories</CardTitle>
            <CardDescription>Categories you engage with most</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.favoriteCategories.length > 0 ? (
              <div className="space-y-3">
                {stats.favoriteCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count} interactions</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No category preferences yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Poets</CardTitle>
            <CardDescription>Poets you follow most closely</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topPoets.length > 0 ? (
              <div className="space-y-3">
                {stats.topPoets.map((poet, index) => (
                  <div key={poet.name} className="flex items-center justify-between">
                    <span className="font-medium">{poet.name}</span>
                    <Badge variant="secondary">{poet.count} interactions</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No poet preferences yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest poetry interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className={`p-1 rounded ${getActivityColor(activity.activityType)}`}>
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium capitalize">
                        {activity.activityType.toLowerCase()}
                      </span>{" "}
                      {activity.targetType.toLowerCase()} #{activity.targetId}
                      {activity.durationSeconds && (
                        <span className="text-muted-foreground">
                          {" "}• {activity.durationSeconds}s
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.activityTimestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No recent activities
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EngagementStatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}