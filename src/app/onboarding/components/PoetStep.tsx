"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/stores/auth";
import { apiClient } from "@/lib/api";
import { OnboardingData } from "@/types/profile";
import { Users, CheckCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Poet {
  id: number;
  name: string;
  bio?: string;
  imageUrl?: string;
  poemsCount?: number;
}

interface PoetStepProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
}

const FAMOUS_POETS: Poet[] = [
  {
    id: 1,
    name: "Allama Iqbal",
    bio: "Philosopher, poet, and politician who inspired the Pakistan movement",
    imageUrl: "",
    poemsCount: 150,
  },
  {
    id: 2,
    name: "Mirza Ghalib",
    bio: "One of the greatest Urdu poets of the Mughal era",
    imageUrl: "",
    poemsCount: 200,
  },
  {
    id: 3,
    name: "Faiz Ahmad Faiz",
    bio: "Revolutionary poet and intellectual",
    imageUrl: "",
    poemsCount: 120,
  },
  {
    id: 4,
    name: "Ahmad Faraz",
    bio: "Modern Urdu poet known for ghazals and nazms",
    imageUrl: "",
    poemsCount: 100,
  },
  {
    id: 5,
    name: "Parveen Shakir",
    bio: "Feminist Urdu poet and civil servant",
    imageUrl: "",
    poemsCount: 80,
  },
  {
    id: 6,
    name: "Jaun Elia",
    bio: "Iconic Urdu poet known for melancholic poetry",
    imageUrl: "",
    poemsCount: 90,
  },
];

export function PoetStep({ data, updateData, onNext }: PoetStepProps) {
  const { addInterest } = useAuth();
  const [poets, setPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoets, setSelectedPoets] = useState<number[]>(
    data.interests.poets || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPoets();
  }, []);

  const loadPoets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPoets();
      setPoets(response || []);
      
      // If no poets from API, use famous poets
      if (!response || response.length === 0) {
        setPoets(FAMOUS_POETS);
      }
    } catch (error) {
      console.error("Failed to load poets:", error);
      // Fallback to famous poets
      setPoets(FAMOUS_POETS);
    } finally {
      setLoading(false);
    }
  };

  const togglePoet = (poetId: number) => {
    setSelectedPoets(prev => {
      if (prev.includes(poetId)) {
        return prev.filter(id => id !== poetId);
      } else {
        return [...prev, poetId];
      }
    });
  };

  const filteredPoets = poets.filter(poet =>
    poet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = async () => {
    setIsSubmitting(true);
    
    // Update local data
    updateData("interests", { 
      ...data.interests, 
      poets: selectedPoets 
    });

    // Add interests to backend
    try {
      for (const poetId of selectedPoets) {
        const poet = poets.find(p => p.id === poetId);
        if (poet) {
          await addInterest({
            interestType: "POET",
            interestId: poetId,
            interestName: poet.name,
            strength: 0.7, // High initial strength for explicit selections
            explicitPreference: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to save poet interests:", error);
      // Continue anyway
    }

    setIsSubmitting(false);
    onNext();
  };

  const getPoetInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (loading) {
    return <PoetStepSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold">Follow your favorite poets</h3>
        <p className="text-muted-foreground">
          Select poets you admire to get their latest poems in your feed
        </p>
        <Badge variant="outline">
          {selectedPoets.length} selected
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search poets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredPoets.map((poet) => {
          const isSelected = selectedPoets.includes(poet.id);
          return (
            <Card
              key={poet.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => togglePoet(poet.id)}
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={poet.imageUrl} alt={poet.name} />
                    <AvatarFallback>
                      {getPoetInitials(poet.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">
                        {poet.name}
                      </CardTitle>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    {poet.bio && (
                      <CardDescription className="text-sm mt-1 line-clamp-2">
                        {poet.bio}
                      </CardDescription>
                    )}
                    {poet.poemsCount && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {poet.poemsCount} poems
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {filteredPoets.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "No poets found matching your search" : "No poets available"}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground">
          You can always add more poets later in your profile
        </div>
        <Button 
          onClick={handleContinue}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? "Saving..." : selectedPoets.length > 0 ? "Continue" : "Skip for now"}
        </Button>
      </div>
    </div>
  );
}

function PoetStepSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <Skeleton className="h-6 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
        <Skeleton className="h-5 w-20 mx-auto" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}