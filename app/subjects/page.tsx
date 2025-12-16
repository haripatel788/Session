"use client";

import { useEffect, useState } from "react";
import { getCurrentUserId } from "@/app/lib/currentUser";

type SubjectSummary = {
  name: string;
  totalMinutes: number;
  sessionCount: number;
  avgDifficulty: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      const userId = getCurrentUserId();

      const res = await fetch(`/api/study-sessions?userId=${userId}`);
      const data = await res.json();

      // Aggregate sessions by subject
      const map: Record<string, SubjectSummary> = {};

      for (const session of data.sessions) {
        const name = session.subject.name;

        if (!map[name]) {
          map[name] = {
            name,
            totalMinutes: 0,
            sessionCount: 0,
            avgDifficulty: 0,
          };
        }

        map[name].totalMinutes += session.duration;
        map[name].sessionCount += 1;
        map[name].avgDifficulty += session.difficulty;
      }

      const summaries = Object.values(map).map((s) => ({
        ...s,
        avgDifficulty: Number(
          (s.avgDifficulty / s.sessionCount).toFixed(1)
        ),
      }));

      setSubjects(summaries);
      setLoading(false);
    }

    loadSubjects();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading subjects…</p>;
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Subjects</h1>
        <p className="mt-1 text-sm text-gray-400">
          Overview of your study subjects.
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 && (
          <p className="text-sm text-gray-400">
            No subjects yet.
          </p>
        )}

        {subjects.map((subject) => (
          <div
            key={subject.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <h2 className="text-lg font-medium">
              {subject.name}
            </h2>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Total time:</span>{" "}
                {subject.totalMinutes} min
              </p>
              <p>
                <span className="text-gray-400">Sessions:</span>{" "}
                {subject.sessionCount}
              </p>
              <p>
                <span className="text-gray-400">Avg difficulty:</span>{" "}
                {subject.avgDifficulty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
