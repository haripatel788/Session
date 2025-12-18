"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthPageProps = {
  mode: "signin" | "signup";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [userId, isLoaded, router]);

  const commonAppearance = {
    elements: {
      rootBox: "mx-auto",
      card: "bg-white dark:bg-black border border-gray-200 dark:border-white/10",
      formButtonPrimary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100",
      footerActionLink: "text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
    }
  };

  if (mode === "signin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <SignIn
          afterSignInUrl="/dashboard"
          signUpUrl="/signup"
          appearance={commonAppearance}
          routing="path"
          path="/login"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <SignUp
        afterSignUpUrl="/dashboard"
        signInUrl="/login"
        appearance={commonAppearance}
        routing="path"
        path="/signup"
        // This is the key setting - redirects to sign in if account exists
        unsafeMetadata={{
          allowDangerousMetadata: true
        }}
      />
    </main>
  );
}