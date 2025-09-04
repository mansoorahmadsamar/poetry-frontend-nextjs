"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/stores/auth";
import { Shield, Eye, Bell, Trash2, AlertTriangle } from "lucide-react";

export function ProfileSettings() {
  const { userProfile, onboardingStep } = useAuth();

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <div className="text-sm text-muted-foreground">
                Currently set to{" "}
                <Badge variant="outline">
                  {userProfile?.profileVisibility || "Public"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show reading activity</Label>
                <div className="text-sm text-muted-foreground">
                  Let others see what poems you're reading
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show liked poems</Label>
                <div className="text-sm text-muted-foreground">
                  Display your liked poems on your profile
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show bookmarked poems</Label>
                <div className="text-sm text-muted-foreground">
                  Make your bookmarked poems visible to others
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive updates about new poems and activities
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New follower notifications</Label>
              <div className="text-sm text-muted-foreground">
                Get notified when someone follows you
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Poem recommendations</Label>
              <div className="text-sm text-muted-foreground">
                Receive personalized poem suggestions
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly digest</Label>
              <div className="text-sm text-muted-foreground">
                Get a summary of your reading activity
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Onboarding Status
          </CardTitle>
          <CardDescription>
            Track your profile completion progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Onboarding Progress</Label>
              <div className="text-sm text-muted-foreground">
                {onboardingStep >= 5 ? (
                  <span className="text-green-600">✓ Completed</span>
                ) : (
                  <span className="text-orange-600">
                    Step {onboardingStep} of 4 - Incomplete
                  </span>
                )}
              </div>
            </div>
            {onboardingStep < 5 && (
              <Button variant="outline" size="sm">
                Complete Onboarding
              </Button>
            )}
          </div>

          {onboardingStep < 5 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Complete your profile
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Finish setting up your profile to get personalized poem recommendations
                    and connect with other poetry enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Delete Account
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Once you delete your account, there is no going back. This will permanently
              delete your profile, poems, collections, and all associated data.
            </p>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}