export default function LandingPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">
        Session
      </h1>

      <p className="mt-3 text-sm text-gray-400">
        Focus. Measure. Improve.
      </p>

      <p className="mt-6 max-w-md text-sm text-gray-400">
        Session helps you track your study time, understand your habits,
        and build consistency — without distractions.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/login"
          className="rounded-xl bg-white px-6 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
        >
          Log in
        </a>

        <a
          href="/signup"
          className="rounded-xl border border-white/10 px-6 py-2 text-sm text-white hover:bg-white/5 transition"
        >
          Sign up
        </a>
      </div>
    </main>
  );
}
