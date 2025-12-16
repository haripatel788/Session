"use client";

import { useEffect, useState } from "react";
import { getCurrentUserId } from "@/app/lib/currentUser";

type Analytics = {
  totalMinutes: number;
  avgDifficulty: number;
  perSubject: Record<string, number>;
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const userId = getCurrentUserId();
      const res = await fetch(`/api/analytics?userId=${userId}`);
      const data = await res.json();
      setAnalytics(data);
      setLoading(false);
    }
  
    fetchAnalytics();
  }, []);
  

  if (loading) {
    return <p className="p-8">Loading analytics...</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Total Study Time</h2>
          <p>{analytics?.totalMinutes} minutes</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Average Difficulty</h2>
          <p>{analytics?.avgDifficulty}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Study Time by Subject</h2>
          <ul className="list-disc ml-6">
            {Object.entries(analytics?.perSubject || {}).map(
              ([subject, minutes]) => (
                <li key={subject}>
                  {subject}: {minutes} minutes
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
