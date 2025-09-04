"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/auth";
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
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(Math.max(1, onboardingStep));
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
  const router = useRouter();

  useEffect(() => {
    setOnboardingStep(currentStep);
  }, [currentStep, setOnboardingStep]);

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
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

      {/* Navigation */}
      {currentStep < STEPS.length && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
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