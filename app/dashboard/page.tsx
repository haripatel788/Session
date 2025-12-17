"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import StatCard from "@/app/components/StatCard";

type Session = {
  id: string;
  duration: number;
  difficulty: number;
  notes: string | null;
  createdAt: string;
  subject: {
    name: string;
  };
};

type Analytics = {
  totalMinutes: number;
  avgDifficulty: number;
  perSubject: Record<string, number>;
};

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [analyticsRes, sessionsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/study-sessions"),
        ]);

        const analyticsData = await analyticsRes.json();
        const sessionsData = await sessionsRes.json();

        setAnalytics(analyticsData ?? null);
        setSessions(sessionsData?.sessions ?? []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setAnalytics(null);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadData();
    }
  }, [userId, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const sessionCount = sessions.length;

  return (
    <section className="space-y-10 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold text-black dark:text-white tracking-tight">Dashboard</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Your study activity at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          label="Total Study Time"
          value={`${analytics?.totalMinutes ?? 0} min`}
          subtext="All time"
        />
        <StatCard
          label="Average Difficulty"
          value={analytics?.avgDifficulty ?? "N/A"}
          subtext="Across sessions"
        />
        <StatCard
          label="Subjects Studied"
          value={Object.keys(analytics?.perSubject ?? {}).length}
          subtext="Unique subjects"
        />
      </div>

      {/* This week */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">This Week</p>
        <p className="mt-2 text-2xl font-semibold text-black dark:text-white">
          {sessionCount} sessions logged
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Keep the streak going.</p>
      </div>

      {/* Recent sessions */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">Recent Sessions</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-white/10">
          {sessionCount === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You haven&#39;t logged any sessions yet.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Start by adding your first study session.
              </p>
            </div>
          )}

          {sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-[1px] transition-all duration-200"
            >
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">{session.subject.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <span>{session.duration} min</span>
                <span>Difficulty {session.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}