import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
  className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
>
  <div className="min-h-screen">
    {/* Header */}
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
          <div>
            <p className="text-sm font-medium leading-none">Session</p>
            <p className="mt-1 text-xs leading-none text-gray-400">
              Focus. Measure. Improve.
            </p>
          </div>
        </div>

        <nav className="hidden gap-6 text-sm text-gray-400 sm:flex">
          <a href="/dashboard" className="hover:text-white transition">
            Dashboard
          </a>
          <a href="/sessions" className="hover:text-white transition">
            Sessions
          </a>
          <a href="/subjects" className="hover:text-white transition">
            Subjects
          </a>
          <a href="/settings" className="hover:text-white transition">
            Settings
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition">
            Add Session
          </button>
          <div className="h-9 w-9 rounded-full border border-white/10 bg-white/5" />
        </div>
      </div>
    </header>

    {/* Page Content */}
    <main className="mx-auto max-w-6xl px-6 py-10">
      {children}
    </main>
  </div>
</body>

    </html>
  );
}
