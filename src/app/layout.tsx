import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoetryVerse - Share and Discover Poetry",
  description: "A platform for poets to share their work, discover new voices, and connect with fellow lovers of poetry.",
  keywords: "poetry, poems, poets, literature, writing, verse, creative writing",
  authors: [{ name: "PoetryVerse Team" }],
  creator: "PoetryVerse",
  publisher: "PoetryVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://poetryverse.com",
    title: "PoetryVerse - Share and Discover Poetry",
    description: "A platform for poets to share their work, discover new voices, and connect with fellow lovers of poetry.",
    siteName: "PoetryVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "PoetryVerse - Share and Discover Poetry",
    description: "A platform for poets to share their work, discover new voices, and connect with fellow lovers of poetry.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
