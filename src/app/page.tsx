"use client";

import Link from "next/link";
import { ArrowRight, Heart, BookOpen, Users, Sparkles, PenTool, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PoemCard } from "@/components/poems/poem-card";
import { useAuth } from "@/stores/auth";
import { POEM_CATEGORIES, Poem } from "@/types";

// Mock data for featured poems
const mockFeaturedPoems: Poem[] = [
  {
    id: "1",
    title: "Whispers of Dawn",
    content: `In the quiet hours before the world awakes,
When dew drops hang like diamonds on the grass,
I find myself lost in morning's gentle grace,
Where shadows dance and golden sunlight breaks.

The birds begin their symphony so sweet,
A chorus welcoming the brand new day,
While gentle breeze makes autumn leaves retreat,
And paints the sky in shades of pink and gray.`,
    excerpt: "In the quiet hours before the world awakes, when dew drops hang like diamonds...",
    category: { id: "nature", name: "Nature", description: "Poems about the natural world" },
    tags: ["morning", "nature", "peaceful"],
    authorId: "author1",
    author: {
      id: "author1",
      email: "poet@example.com",
      name: "Emily Rivers",
      profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b78c4f01?w=150&h=150&fit=crop&crop=face",
      bio: "Nature poet and sunrise enthusiast",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    isPublic: true,
    likesCount: 142,
    bookmarksCount: 67,
    isLikedByUser: false,
    isBookmarkedByUser: false,
    createdAt: "2024-01-20T08:15:00Z",
    updatedAt: "2024-01-20T08:15:00Z"
  },
  {
    id: "2",
    title: "Love's Echo",
    content: `Your laughter echoes through these empty halls,
A melody that time cannot erase,
Though seasons change and autumn gently falls,
I carry still the memory of your face.

In every sunset's warm and golden glow,
I see the light that used to fill your eyes,
And though you're gone, my heart continues so,
To love you still beneath these starlit skies.`,
    excerpt: "Your laughter echoes through these empty halls, a melody that time cannot erase...",
    category: { id: "love", name: "Love & Romance", description: "Poems about love and relationships" },
    tags: ["love", "memory", "heartbreak"],
    authorId: "author2",
    author: {
      id: "author2",
      email: "romantic@example.com",
      name: "Marcus Stone",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Writing love letters to the universe",
      createdAt: "2024-01-10T14:22:00Z",
      updatedAt: "2024-01-10T14:22:00Z"
    },
    isPublic: true,
    likesCount: 203,
    bookmarksCount: 89,
    isLikedByUser: false,
    isBookmarkedByUser: false,
    createdAt: "2024-01-18T19:45:00Z",
    updatedAt: "2024-01-18T19:45:00Z"
  }
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/20">
        <div className="container px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge className="w-fit" variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Poetry Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold poetry-title leading-tight">
                  Share Your Voice,{" "}
                  <span className="text-primary">Discover</span> New Worlds
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  PoetryVerse is where poets come together to share their work, 
                  find inspiration, and connect with fellow lovers of verse. 
                  Express your thoughts, emotions, and experiences through the power of poetry.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!isAuthenticated ? (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/login">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/poems">
                        Explore Poems <BookOpen className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/poems/upload">
                        Write a Poem <PenTool className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/dashboard">
                        My Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t">
                <div>
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-sm text-muted-foreground">Poems Shared</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">350+</div>
                  <div className="text-sm text-muted-foreground">Active Poets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Collections</div>
                </div>
              </div>
            </div>

            {/* Featured Poem Preview */}
            <div className="lg:pl-8 animate-fade-in-delay">
              <Card className="bg-card/50 backdrop-blur border-2">
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>Featured Poem</span>
                  </div>
                  <CardTitle className="poetry-title text-2xl">Whispers of Dawn</CardTitle>
                  <CardDescription>by Emily Rivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="poetry-text text-muted-foreground leading-relaxed">
                    In the quiet hours before the world awakes,<br />
                    When dew drops hang like diamonds on the grass,<br />
                    I find myself lost in morning's gentle grace,<br />
                    Where shadows dance and golden sunlight breaks...
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>142</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>67</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/poems/1">Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold poetry-title">
              Why Choose PoetryVerse?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to share, discover, and celebrate poetry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <PenTool className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Share Your Poetry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your poems with beautiful formatting, categorize them, 
                  and share your voice with the world.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Discover New Voices</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore thousands of poems across different categories, 
                  styles, and themes from poets around the world.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Connect with Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Like, bookmark, and collect your favorite poems. 
                  Follow poets and build your own poetry collections.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Poems Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold poetry-title mb-2">
                Featured Poems
              </h2>
              <p className="text-muted-foreground">
                Discover exceptional poetry from our community
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/poems">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mockFeaturedPoems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                poem={poem} 
                variant="featured"
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold poetry-title">
              Explore by Category
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find poems that resonate with your mood and interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POEM_CATEGORIES.slice(0, 8).map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    120+ poems
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold poetry-title">
              Ready to Share Your Voice?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of poets who are already sharing their work and 
              discovering amazing poetry on PoetryVerse.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Join PoetryVerse <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/poems">
                    Explore First
                  </Link>
                </Button>
              </div>
            ) : (
              <Button size="lg" asChild>
                <Link href="/poems/upload">
                  Write Your First Poem <PenTool className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
