import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <SignIn
        afterSignInUrl="/dashboard"
        signUpUrl="/signup"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-black border border-gray-200 dark:border-white/10"
          }
        }}
      />
    </main>
  );
}