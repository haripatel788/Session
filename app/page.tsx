export default function LandingPage() {
  return (
    <main className="flex items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <div>
        <h1 className="text-5xl font-semibold text-black dark:text-white tracking-tight">
          Session
        </h1>

        <p className="mt-3 text-base text-gray-600 dark:text-gray-400 font-medium">
          Focus. Measure. Improve.
        </p>

        <p className="mt-6 max-w-md text-base text-gray-700 dark:text-gray-300 mx-auto leading-relaxed">
          Session helps you track your study time, understand your habits,
          and build consistency – without distractions.
        </p>
      </div>
      <div className="mt-10 flex gap-4 justify-center">
        <a
          href="/login"
          className="rounded-xl bg-black dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
        >
          Log in
        </a>

        <a
          href="/signup"
          className="rounded-xl border border-gray-300 dark:border-white/20 px-6 py-3 text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
        >
          Sign up
        </a>
      </div>
    </main>
  );
}