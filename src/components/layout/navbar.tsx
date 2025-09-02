"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, Menu, X, PenTool, Home, Book, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/stores/auth";
import { getUserDisplayName, getUserProfilePicture, getUserInitials } from "@/lib/user-utils";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        href="/poems"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Book className="h-4 w-4" />
        Poems
      </Link>
      <Link
        href="/collections"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Book className="h-4 w-4" />
        Collections
      </Link>
      {isAuthenticated && (
        <Link
          href="/poems/upload"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          <PenTool className="h-4 w-4" />
          Write
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <PenTool className="h-6 w-6" />
          <span className="text-xl font-bold poetry-title">PoetryVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 flex-1">
          <NavLinks />
        </nav>

        {/* Search */}
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search poems, authors..."
              className="w-[200px] lg:w-[300px] pl-9"
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={getUserProfilePicture(user)} 
                      alt={getUserDisplayName(user)} 
                    />
                    <AvatarFallback>
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{getUserDisplayName(user)}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/edit">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-lg font-bold poetry-title">
                  PoetryVerse
                </Link>
                <div className="flex flex-col space-y-3">
                  <NavLinks />
                </div>
                {!isAuthenticated && (
                  <Button asChild className="mt-6">
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}