"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./BasicInfoStep";
import { LanguageStep } from "./LanguageStep";
import { CategoryStep } from "./CategoryStep";
import { PoetStep } from "./PoetStep";
import { CompletionStep } from "./CompletionStep";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { OnboardingData } from "@/types/profile";

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    component: BasicInfoStep,
  },
  {
    id: 2,
    title: "Language & Preferences",
    description: "Set your reading preferences",
    component: LanguageStep,
  },
  {
    id: 3,
    title: "Poetry Interests",
    description: "Choose your favorite categories",
    component: CategoryStep,
  },
  {
    id: 4,
    title: "Favorite Poets",
    description: "Select poets you admire",
    component: PoetStep,
  },
  {
    id: 5,
    title: "Welcome to PoetryVerse!",
    description: "You're all set to explore poetry",
    component: CompletionStep,
  },
];

export function OnboardingWizard() {
  const { user, userProfile, completeOnboarding, addInterest } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    basicInfo: {
      fullName: "",
      username: "",
      bio: "",
      dateOfBirth: "",
      gender: undefined,
      location: "",
      country: "",
    },
    preferences: {
      preferredLanguage: "en",
      readingLevel: "BEGINNER",
      profileVisibility: "PUBLIC",
    },
    interests: {
      categories: [],
      poets: [],
      languages: [],
      contentTypes: [],
    },
  });
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();

  // Monitor currentStep changes
  useEffect(() => {
    console.log("currentStep changed to:", currentStep);
  }, [currentStep]);

  // Load existing user data when component mounts - only run once
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        // Fetch both user and profile data directly
        const [currentUser, currentProfile] = await Promise.allSettled([
          apiClient.getMe(),
          apiClient.getProfile()
        ]);
        
        const userData = currentUser.status === 'fulfilled' ? currentUser.value : user;
        const profileData = currentProfile.status === 'fulfilled' ? currentProfile.value : userProfile;
        
        // Pre-fill onboarding data with existing user/profile data
        if (userData || profileData) {
          setOnboardingData({
            basicInfo: {
              fullName: profileData?.fullName || userData?.fullName || userData?.name || "",
              username: profileData?.username || "",
              bio: profileData?.bio || userData?.bio || "",
              dateOfBirth: profileData?.dateOfBirth || "",
              gender: profileData?.gender || undefined,
              location: profileData?.location || "",
              country: profileData?.country || "",
            },
            preferences: {
              preferredLanguage: profileData?.preferredLanguage || "en",
              readingLevel: profileData?.readingLevel || "BEGINNER",
              profileVisibility: profileData?.profileVisibility || "PUBLIC",
            },
            interests: {
              categories: [],
              poets: [],
              languages: [],
              contentTypes: [],
            },
          });
        }
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Failed to load existing data:", error);
        setIsDataLoaded(true); // Still mark as loaded to continue
      }
    };

    // Only run once on mount
    loadExistingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    console.log("nextStep called, currentStep:", currentStep);
    setCurrentStep(currentStep + 1);
    console.log("setCurrentStep called with:", currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboardingProcess = async () => {
    setIsCompleting(true);
    try {
      await completeOnboarding();
      // Redirect to dashboard after completion
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const currentStepConfig = STEPS[currentStep - 1];
  const CurrentStepComponent = currentStepConfig.component;
  const progress = (currentStep / STEPS.length) * 100;

  console.log("Rendering step:", currentStep, "Config:", currentStepConfig?.title, "Component:", CurrentStepComponent?.name);

  // Show loading while data is being loaded
  if (!isDataLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-medium">Loading your information...</h3>
          <p className="text-muted-foreground">We're preparing your personalized onboarding experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold poetry-title mb-2">Welcome to PoetryVerse!</h1>
        <p className="text-muted-foreground text-lg">
          Let's personalize your poetry experience in just a few steps
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">
            Step {currentStep} of {STEPS.length}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                step.id <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <div className="text-center hidden sm:block">
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>{currentStepConfig.title}</CardTitle>
          <CardDescription>{currentStepConfig.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={onboardingData}
            updateData={updateOnboardingData}
            onNext={nextStep}
            onComplete={completeOnboardingProcess}
            isCompleting={isCompleting}
          />
        </CardContent>
      </Card>

      {/* Navigation - Skip for step 1 as it has its own Next button */}
      {currentStep > 1 && currentStep < STEPS.length && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}