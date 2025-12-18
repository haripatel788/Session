import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-black border border-gray-200 dark:border-white/10",
            formButtonPrimary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100",
            footerActionLink: "text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
          }
        }}
      />
    </main>
  );
}