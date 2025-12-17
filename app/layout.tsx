import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/app/components/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Session",
  description: "Focus. Measure. Improve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-black text-black dark:text-white antialiased`}
        >
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5" />
                    <div>
                      <p className="text-sm font-semibold leading-none text-black dark:text-white">Session</p>
                      <p className="mt-1 text-xs leading-none text-gray-600 dark:text-gray-400">
                        Focus. Measure. Improve.
                      </p>
                    </div>
                  </Link>

                  <SignedIn>
                    <nav className="hidden gap-6 text-sm text-gray-700 dark:text-gray-300 sm:flex">
                      <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition font-medium">
                        Dashboard
                      </Link>
                      <Link href="/sessions" className="hover:text-black dark:hover:text-white transition font-medium">
                        Sessions
                      </Link>
                      <Link href="/subjects" className="hover:text-black dark:hover:text-white transition font-medium">
                        Subjects
                      </Link>
                      <Link href="/settings" className="hover:text-black dark:hover:text-white transition font-medium">
                        Settings
                      </Link>
                    </nav>
                  </SignedIn>

                  <div className="flex items-center gap-3">
                    <SignedIn>
                      <Link
                        href="/sessions?open=true"
                        className="rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition font-medium"
                      >
                        Add Session
                      </Link>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9"
                          }
                        }}
                      />
                    </SignedIn>
                    
                    <SignedOut>
                      <Link
                        href="/login"
                        className="rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition font-medium"
                      >
                        Sign In
                      </Link>
                    </SignedOut>
                  </div>
                </div>
              </header>

              {/* Page Content - flex-1 makes it take remaining space */}
              <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
                {children}
              </main>

              {/* Footer - will be pushed to bottom */}
              <footer className="border-t border-gray-200 dark:border-white/10 py-6 text-center text-xs text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Session – Focus. Measure. Improve.
                <p className="mt-1">
                  Created by{" "}
                  
                  <a
                    href="https://haripatel.github.io"
                    className="underline hover:text-black dark:hover:text-white transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hari Patel
                  </a>
                </p>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}