"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/stores/auth";
import { apiClient } from "@/lib/api";
import { OnboardingData } from "@/types/profile";
import { Heart, CheckCircle } from "lucide-react";
import { POEM_CATEGORIES } from "@/types";

interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

interface CategoryStepProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
}

export function CategoryStep({ data, updateData, onNext }: CategoryStepProps) {
  const { addInterest } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    data.interests.categories || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-save selected categories whenever selection changes
  useEffect(() => {
    updateData("interests", { 
      ...data.interests, 
      categories: selectedCategories 
    });
  }, [selectedCategories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCategories();
      setCategories(response || []);
      
      // If no categories from API, use default ones
      if (!response || response.length === 0) {
        const defaultCategories = POEM_CATEGORIES.map((cat, index) => ({
          id: index + 1,
          name: cat.name,
          description: `Poetry about ${cat.name.toLowerCase()}`,
          color: cat.color,
        }));
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      // Fallback to default categories
      const defaultCategories = POEM_CATEGORIES.map((cat, index) => ({
        id: index + 1,
        name: cat.name,
        description: `Poetry about ${cat.name.toLowerCase()}`,
        color: cat.color,
      }));
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    
    // Update local data
    updateData("interests", { 
      ...data.interests, 
      categories: selectedCategories 
    });

    // Add interests to backend
    try {
      for (const categoryId of selectedCategories) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          await addInterest({
            interestType: "CATEGORY",
            interestId: categoryId,
            interestName: category.name,
            strength: 0.8, // High initial strength for explicit selections
            explicitPreference: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to save interests:", error);
      // Continue anyway
    }

    setIsSubmitting(false);
    onNext();
  };

  if (loading) {
    return <CategoryStepSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold">Choose your favorite poetry categories</h3>
        <p className="text-muted-foreground">
          Select categories that interest you to get personalized recommendations
        </p>
        <Badge variant="outline">
          {selectedCategories.length} selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => toggleCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || "#6366f1" }}
                  />
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                {category.description && (
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {selectedCategories.length === 0 && (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Select at least one category to continue
          </p>
        </div>
      )}

      <div className="text-center pt-4">
        <div className="text-sm text-muted-foreground">
          Select categories you're interested in - you can add more later
        </div>
      </div>
    </div>
  );
}

function CategoryStepSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <Skeleton className="h-6 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
        <Skeleton className="h-5 w-20 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}