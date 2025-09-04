"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { OnboardingData, READING_LEVELS, PROFILE_VISIBILITY_OPTIONS, LANGUAGE_OPTIONS } from "@/types/profile";
import { Globe, BookOpen, Shield } from "lucide-react";

const languageStepSchema = z.object({
  preferredLanguage: z.string().min(1, "Please select a preferred language"),
  readingLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  profileVisibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]),
});

type LanguageStepFormData = z.infer<typeof languageStepSchema>;

interface LanguageStepProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
}

export function LanguageStep({ data, updateData, onNext }: LanguageStepProps) {
  const { updateProfile } = useAuth();

  const form = useForm<LanguageStepFormData>({
    resolver: zodResolver(languageStepSchema),
    defaultValues: {
      preferredLanguage: data.preferences.preferredLanguage || "en",
      readingLevel: data.preferences.readingLevel || "BEGINNER",
      profileVisibility: data.preferences.profileVisibility || "PUBLIC",
    },
  });

  const onSubmit = async (formData: LanguageStepFormData) => {
    // Update local onboarding data
    updateData("preferences", formData);

    // Also update the profile in the backend
    try {
      await updateProfile({
        preferredLanguage: formData.preferredLanguage,
        readingLevel: formData.readingLevel,
        profileVisibility: formData.profileVisibility,
      });
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold">Set your preferences</h3>
        <p className="text-muted-foreground">
          Help us curate the perfect poetry experience for you
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Language Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Preference
              </CardTitle>
              <CardDescription>
                Choose your preferred language for poetry recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Language *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Reading Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Reading Level
              </CardTitle>
              <CardDescription>
                This helps us recommend poems that match your experience with poetry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="readingLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid gap-4"
                      >
                        {READING_LEVELS.map((level) => (
                          <div key={level.value} className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={level.value} 
                              id={level.value}
                              className="mt-1" 
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={level.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                <Badge variant="outline" className="mr-2">
                                  {level.label}
                                </Badge>
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {level.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your profile and reading activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid gap-4"
                      >
                        {PROFILE_VISIBILITY_OPTIONS.map((option) => (
                          <div key={option.value} className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={option.value} 
                              id={option.value}
                              className="mt-1" 
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={option.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                <Badge 
                                  variant={option.value === "PUBLIC" ? "default" : "secondary"} 
                                  className="mr-2"
                                >
                                  {option.label}
                                </Badge>
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}