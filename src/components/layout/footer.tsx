"use client";

import Link from "next/link";
import { PenTool, Heart, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <PenTool className="h-6 w-6" />
              <span className="text-xl font-bold poetry-title">PoetryVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              A platform for poets to share their work, discover new voices, and 
              connect with fellow lovers of poetry. Express your thoughts, emotions, 
              and experiences through the power of verse.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/poems" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Poems
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/poems?category=love" className="text-muted-foreground hover:text-foreground transition-colors">
                  Love Poems
                </Link>
              </li>
              <li>
                <Link href="/poems?category=nature" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nature Poems
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 PoetryVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>for poetry lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}