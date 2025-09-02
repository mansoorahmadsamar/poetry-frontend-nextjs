"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Bookmark, Share2, Eye, Calendar, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Poem } from "@/types";
import { formatRelativeTime, createExcerpt, getCategoryColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PoemCardProps {
  poem: Poem;
  showActions?: boolean;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function PoemCard({
  poem,
  showActions = true,
  variant = "default",
  className
}: PoemCardProps) {
  const [isLiked, setIsLiked] = useState(poem.isLikedByUser || false);
  const [isBookmarked, setIsBookmarked] = useState(poem.isBookmarkedByUser || false);
  const [likesCount, setLikesCount] = useState(poem.likesCount || 0);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    // TODO: Implement actual API call
    // try {
    //   if (wasLiked) {
    //     await apiClient.unlikePoem(poem.id);
    //   } else {
    //     await apiClient.likePoem(poem.id);
    //   }
    // } catch (error) {
    //   // Revert optimistic update on error
    //   setIsLiked(wasLiked);
    //   setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
    //   console.error("Failed to toggle like:", error);
    // }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!isBookmarked);

    // TODO: Implement actual API call
    // try {
    //   if (wasBookmarked) {
    //     await apiClient.unbookmarkPoem(poem.id);
    //   } else {
    //     await apiClient.bookmarkPoem(poem.id);
    //   }
    // } catch (error) {
    //   setIsBookmarked(wasBookmarked);
    //   console.error("Failed to toggle bookmark:", error);
    // }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem.title,
          text: createExcerpt(poem.content, 100),
          url: `${window.location.origin}/poems/${poem.id}`,
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/poems/${poem.id}`);
        // TODO: Show toast notification
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  if (variant === "compact") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/poems/${poem.id}`}>
                <h3 className="font-semibold poetry-title hover:text-primary transition-colors line-clamp-1">
                  {poem.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {createExcerpt(poem.content, 100)}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className="ml-2 shrink-0"
              style={{ borderColor: getCategoryColor(poem.category.id) }}
            >
              {poem.category.name}
            </Badge>
          </div>
        </CardHeader>
        {showActions && (
          <CardFooter className="pt-0 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{poem.bookmarksCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn("h-7 px-2", isLiked && "text-red-500")}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn("h-7 px-2", isBookmarked && "text-blue-500")}
              >
                <Bookmark className={cn("h-3 w-3", isBookmarked && "fill-current")} />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className={cn("hover:shadow-lg transition-all duration-300 border-2 border-primary/20", className)}>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={poem.author.profilePicture} alt={poem.author.name || "User"} />
              <AvatarFallback>
                {poem.author.name 
                  ? poem.author.name.split(" ").map(n => n[0]).join("").toUpperCase()
                  : poem.author.email 
                    ? poem.author.email[0].toUpperCase()
                    : "U"
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{poem.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(poem.createdAt)}
              </p>
            </div>
            <Badge 
              className="ml-auto"
              style={{ backgroundColor: getCategoryColor(poem.category.id) }}
            >
              {poem.category.name}
            </Badge>
          </div>
          <Link href={`/poems/${poem.id}`}>
            <h2 className="text-2xl font-bold poetry-title hover:text-primary transition-colors">
              {poem.title}
            </h2>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="poetry-text text-muted-foreground line-clamp-6">
            {poem.content}
          </div>
        </CardContent>
        {showActions && (
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>{poem.bookmarksCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(isLiked && "text-red-500")}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(isBookmarked && "text-blue-500")}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={poem.author.profilePicture} alt={poem.author.name || "User"} />
              <AvatarFallback>
                {poem.author.name 
                  ? poem.author.name.split(" ").map(n => n[0]).join("").toUpperCase()
                  : poem.author.email 
                    ? poem.author.email[0].toUpperCase()
                    : "U"
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${poem.author.id}`}>
                <p className="font-medium text-sm hover:text-primary transition-colors">
                  {poem.author.name}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatRelativeTime(poem.createdAt)}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline"
            style={{ borderColor: getCategoryColor(poem.category.id) }}
          >
            {poem.category.name}
          </Badge>
        </div>
        <Link href={`/poems/${poem.id}`}>
          <h3 className="text-lg font-semibold poetry-title hover:text-primary transition-colors">
            {poem.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="poetry-text text-muted-foreground line-clamp-4">
          {poem.content}
        </div>
        {poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {poem.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {poem.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{poem.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      {showActions && (
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bookmark className="h-4 w-4" />
              <span>{poem.bookmarksCount || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(isLiked && "text-red-500")}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={cn(isBookmarked && "text-blue-500")}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}