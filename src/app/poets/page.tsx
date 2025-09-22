"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Users, BookOpen, Heart, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { PaginatedResponse } from "@/types";

interface Poet {
  id: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  country?: string;
  birthYear?: number;
  deathYear?: number;
  poemsCount: number;
  followersCount: number;
  isFollowedByUser?: boolean;
  categories: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PoetsPage() {
  const [poets, setPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPoets, setTotalPoets] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 12;

  const fetchPoets = async (page: number = 1, query: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      };

      if (query.trim()) {
        params.search = query.trim();
      }

      const response: PaginatedResponse<Poet> = await apiClient.getPoets(params);

      setPoets(response.data);
      setTotalPages(response.totalPages);
      setTotalPoets(response.total);
      setCurrentPage(response.page);
      setHasMore(response.page < response.totalPages);
    } catch (err) {
      console.error("Failed to fetch poets:", err);
      setError(err instanceof Error ? err.message : "Failed to load poets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchPoets(1, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPoets(page, searchQuery);
  };

  const handleFollowPoet = async (poetId: string) => {
    try {
      // Implement follow/unfollow API call when available
      console.log("Follow poet:", poetId);
    } catch (err) {
      console.error("Failed to follow poet:", err);
    }
  };

  useEffect(() => {
    fetchPoets();
  }, []);

  const formatLifespan = (birthYear?: number, deathYear?: number) => {
    if (!birthYear) return "";
    if (deathYear) {
      return `${birthYear} - ${deathYear}`;
    }
    return `Born ${birthYear}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold poetry-title">Poets</h1>
            <p className="text-muted-foreground">
              Discover talented poets and their works
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search poets by name, country, or style..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{totalPoets} poets found</span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchPoets(currentPage, searchQuery)}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Poets Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {poets.map((poet) => (
              <Card key={poet.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={poet.profileImageUrl} alt={poet.name} />
                        <AvatarFallback>
                          {poet.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {poet.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {poet.country && (
                            <span>{poet.country}</span>
                          )}
                          {formatLifespan(poet.birthYear, poet.deathYear) && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatLifespan(poet.birthYear, poet.deathYear)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {poet.bio && (
                    <CardDescription className="line-clamp-3">
                      {poet.bio}
                    </CardDescription>
                  )}

                  {/* Categories and Languages */}
                  <div className="space-y-2">
                    {poet.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {poet.categories.slice(0, 3).map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {poet.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{poet.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {poet.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {poet.languages.slice(0, 2).map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{poet.poemsCount} poems</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{poet.followersCount} followers</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.href = `/poets/${poet.id}`}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant={poet.isFollowedByUser ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleFollowPoet(poet.id)}
                    >
                      {poet.isFollowedByUser ? "Following" : "Follow"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Empty State */}
          {poets.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No poets found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No poets match "${searchQuery}". Try a different search term.`
                      : "No poets available at the moment."
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => handleSearch("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}