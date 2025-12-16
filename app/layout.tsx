import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";

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
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
        >
          <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
                  <div>
                    <p className="text-sm font-medium leading-none">Session</p>
                    <p className="mt-1 text-xs leading-none text-gray-400">
                      Focus. Measure. Improve.
                    </p>
                  </div>
                </Link>

                <SignedIn>
                  <nav className="hidden gap-6 text-sm text-gray-400 sm:flex">
                    <Link href="/dashboard" className="hover:text-white transition">
                      Dashboard
                    </Link>
                    <Link href="/sessions" className="hover:text-white transition">
                      Sessions
                    </Link>
                    <Link href="/subjects" className="hover:text-white transition">
                      Subjects
                    </Link>
                  </nav>
                </SignedIn>

                <div className="flex items-center gap-3">
                  <SignedIn>
                    <Link
                      href="/sessions?open=true"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition"
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
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition"
                    >
                      Sign In
                    </Link>
                  </SignedOut>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="mx-auto max-w-6xl px-6 py-10">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Session — Focus. Measure. Improve.
              <p>
                Created by{" "}
                <a
                  href="https://haripatel.github.io"
                  className="underline hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hari Patel
                </a>
              </p>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}