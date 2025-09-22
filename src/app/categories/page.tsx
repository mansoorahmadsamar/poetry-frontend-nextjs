"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Tag, BookOpen, TrendingUp, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { PaginatedResponse } from "@/types";

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  poemsCount: number;
  followersCount: number;
  isFollowedByUser?: boolean;
  popularPoets: string[];
  languages: string[];
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 12;

  const fetchCategories = async (page: number = 1, query: string = "") => {
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

      const response: PaginatedResponse<Category> = await apiClient.getCategories(params);

      setCategories(response.data);
      setTotalPages(response.totalPages);
      setTotalCategories(response.total);
      setCurrentPage(response.page);
      setHasMore(response.page < response.totalPages);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchCategories(1, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCategories(page, searchQuery);
  };

  const handleFollowCategory = async (categoryId: string) => {
    try {
      // Implement follow/unfollow API call when available
      console.log("Follow category:", categoryId);
    } catch (err) {
      console.error("Failed to follow category:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCategoryColor = (color?: string) => {
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
      "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
      "#ec4899", "#f43f5e"
    ];
    return color || colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold poetry-title">Categories</h1>
            <p className="text-muted-foreground">
              Explore poetry by themes, styles, and topics
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories by name or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{totalCategories} categories found</span>
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
                onClick={() => fetchCategories(currentPage, searchQuery)}
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
                  <Skeleton className="h-12 w-12 rounded-lg" />
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

      {/* Categories Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => {
              const categoryColor = getCategoryColor(category.color);

              return (
                <Card key={category.id} className="group hover:shadow-lg transition-shadow relative overflow-hidden">
                  {/* Color accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: categoryColor }}
                  />

                  {category.trending && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-start gap-3">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: categoryColor }}
                      >
                        <Palette className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {category.poemsCount} poems
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {category.description && (
                      <CardDescription className="line-clamp-3">
                        {category.description}
                      </CardDescription>
                    )}

                    {/* Popular Poets */}
                    {category.popularPoets.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Popular Poets:</div>
                        <div className="flex flex-wrap gap-1">
                          {category.popularPoets.slice(0, 3).map((poet, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {poet}
                            </Badge>
                          ))}
                          {category.popularPoets.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.popularPoets.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {category.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {category.languages.slice(0, 3).map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                        {category.languages.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.languages.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{category.poemsCount} poems</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{category.followersCount} followers</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.location.href = `/categories/${category.id}`}
                      >
                        Explore
                      </Button>
                      <Button
                        variant={category.isFollowedByUser ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleFollowCategory(category.id)}
                      >
                        {category.isFollowedByUser ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
          {categories.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No categories found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No categories match "${searchQuery}". Try a different search term.`
                      : "No categories available at the moment."
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