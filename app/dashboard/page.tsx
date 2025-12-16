"use client";

import { useEffect, useState } from "react";
import StatCard from "@/app/components/StatCard";
import { getCurrentUserId } from "@/app/lib/currentUser";

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
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const userId = getCurrentUserId();

      const [analyticsRes, sessionsRes] = await Promise.all([
        fetch(`/api/analytics?userId=${userId}`),
        fetch(`/api/study-sessions?userId=${userId}`),
      ]);

      const analyticsData = await analyticsRes.json();
      const sessionsData = await sessionsRes.json();

      setAnalytics(analyticsData);
      setSessions(sessionsData.sessions);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading dashboard…</p>;
  }

  return (
    <section className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Your study activity at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          label="Total Study Time"
          value={`${analytics?.totalMinutes} min`}
          subtext="All time"
        />
        <StatCard
          label="Average Difficulty"
          value={analytics?.avgDifficulty ?? "N/A"}
          subtext="Across sessions"
        />
        <StatCard
          label="Subjects Studied"
          value={Object.keys(analytics?.perSubject || {}).length}
          subtext="Unique subjects"
        />
      </div>

      {/* Recent Sessions */}
      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-medium">Recent Sessions</h2>
        </div>

        <div className="divide-y divide-white/10">
          {sessions.length === 0 && (
            <p className="px-6 py-6 text-sm text-gray-400">
              No study sessions logged yet.
            </p>
          )}

          {sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition"
            >
              <div>
                <p className="text-sm font-medium">
                  {session.subject.name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-300">
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
