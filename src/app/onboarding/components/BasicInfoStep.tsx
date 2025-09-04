"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingData, GENDER_OPTIONS, COUNTRIES } from "@/types/profile";

const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
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
  const { updateProfile } = useAuth();

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: data.basicInfo.fullName || "",
      username: data.basicInfo.username || "",
      bio: data.basicInfo.bio || "",
      dateOfBirth: data.basicInfo.dateOfBirth || "",
      gender: data.basicInfo.gender || "none",
      location: data.basicInfo.location || "",
      country: data.basicInfo.country || "Select Country",
    },
  });

  const onSubmit = async (formData: BasicInfoFormData) => {
    // Update local onboarding data
    updateData("basicInfo", formData);

    // Also update the profile in the backend
    try {
      await updateProfile({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender === "none" ? undefined : formData.gender,
        location: formData.location,
        country: formData.country === "Select Country" ? undefined : formData.country,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Continue anyway - this is just onboarding
    }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
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

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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