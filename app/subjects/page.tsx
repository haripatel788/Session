"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type SubjectSummary = {
  name: string;
  totalMinutes: number;
  sessionCount: number;
  avgDifficulty: number;
};

export default function SubjectsPage() {
  const { userId, isLoaded } = useAuth();
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/study-sessions");
        const data = await res.json();

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
          avgDifficulty: Number((s.avgDifficulty / s.sessionCount).toFixed(1)),
        }));

        setSubjects(summaries);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadSubjects();
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
        <p className="text-sm text-gray-600 dark:text-gray-400">Please sign in to view subjects.</p>
      </div>
    );
  }

  return (
    <section className="space-y-8 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold text-black dark:text-white tracking-tight">Subjects</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Overview of your study subjects.
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">No subjects yet.</p>
        )}

        {subjects.map((subject) => (
          <div
            key={subject.name}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-[1px] transition-all duration-200"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">{subject.name}</h2>

            <p className="mt-3 text-3xl font-semibold text-black dark:text-white tracking-tight">
              {subject.totalMinutes} min
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500 font-medium">Total study time</p>

            <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Sessions:</span>{" "}
                <span className="font-semibold text-black dark:text-white">{subject.sessionCount}</span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Avg difficulty:</span>{" "}
                <span className="font-semibold text-black dark:text-white">{subject.avgDifficulty}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}