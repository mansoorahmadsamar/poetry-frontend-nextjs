"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/types/profile";
import { CheckCircle, Sparkles, ArrowRight, Users, BookOpen, Globe, Heart } from "lucide-react";

interface CompletionStepProps {
  data: OnboardingData;
  onComplete: () => void;
  isCompleting: boolean;
}

export function CompletionStep({ data, onComplete, isCompleting }: CompletionStepProps) {
  const stats = {
    categories: data.interests.categories.length,
    poets: data.interests.poets.length,
    language: data.preferences.preferredLanguage,
    readingLevel: data.preferences.readingLevel,
  };

  return (
    <div className="space-y-8">
      {/* Success Animation */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold poetry-title text-primary">
            Welcome to PoetryVerse!
          </h3>
          <p className="text-muted-foreground text-lg">
            Your personalized poetry experience is ready
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Language & Level
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {stats.language.toUpperCase()} • {stats.readingLevel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Categories
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {stats.categories} interests selected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  Following
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {stats.poets} poets to discover
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                  Ready to Explore
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Personalized just for you
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Next */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">What's next?</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Discover poems tailored to your interests</p>
                <p className="text-sm text-muted-foreground">
                  Explore our curated collection based on your preferences
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Follow your favorite poets</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when they publish new poems
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Share your own poetry</p>
                <p className="text-sm text-muted-foreground">
                  Join our community of poets and share your work
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      <div className="text-center pt-4">
        <Button 
          onClick={onComplete}
          disabled={isCompleting}
          size="lg"
          className="min-w-[200px]"
        >
          {isCompleting ? (
            "Saving your profile..."
          ) : (
            <>
              Save & Complete Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          You can always update your preferences later in your profile settings
        </p>
      </div>
    </div>
  );
}