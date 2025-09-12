"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData, GENDER_OPTIONS, COUNTRIES } from "@/types/profile";

const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  dateOfBirth: z.string(),
  gender: z.string().optional(),
  location: z.string().max(100),
  country: z.string().max(100),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
}

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const { updateProfile, userProfile } = useAuth();

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: data.basicInfo.fullName || userProfile?.fullName || "",
      username: data.basicInfo.username || userProfile?.username || "",
      bio: data.basicInfo.bio || userProfile?.bio || "",
      dateOfBirth: data.basicInfo.dateOfBirth || userProfile?.dateOfBirth || "",
      gender: data.basicInfo.gender || userProfile?.gender || "none",
      location: data.basicInfo.location || userProfile?.location || "",
      country: data.basicInfo.country || userProfile?.country || "Select Country",
    },
  });

  // Handle validation and saving when onNext is called
  const handleNext = async () => {
    console.log("handleNext called");
    const isValid = await form.trigger();
    console.log("Form validation result:", isValid);
    if (!isValid) return;

    const formData = form.getValues();
    console.log("Form data:", formData);
    
    // Update local onboarding data only - don't update backend profile yet
    updateData("basicInfo", formData);
    
    console.log("Data updated locally, calling onNext");
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold">Tell us about yourself</h3>
        <p className="text-muted-foreground">
          Help us create a personalized experience for you
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a unique username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your love for poetry and what inspires you..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Karachi, Sindh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        
        <div className="flex justify-end pt-6">
          <Button 
            type="button" 
            onClick={handleNext}
            className="px-8"
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
}