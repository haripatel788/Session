"use client";

import { useEffect, useState } from "react";
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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const userId = getCurrentUserId();
      const res = await fetch(`/api/study-sessions?userId=${userId}`);
      const data = await res.json();
      setSessions(data.sessions);
      setLoading(false);
    }

    loadSessions();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400 animate-pulse">
    Loading…
  </p>
  ;
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Sessions</h1>
          <p className="mt-1 text-sm text-gray-400">
            All your recorded study sessions.
          </p>
        </div>

        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 hover:-translate-y-[1px] transition-all duration-200
 transition">
          Add Session
        </button>
      </div>

      {/* Sessions Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-white/5 hover:bg-white/5 transition"
        >
          <span>Subject</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Difficulty</span>
          <span>Notes</span>
        </div>

        {sessions.length === 0 && (
          <p className="px-6 py-6 text-sm text-gray-400">
            No sessions logged yet.
          </p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-white/5 hover:bg-white/5 transition"

          >
            <span className="font-medium">
              {session.subject.name}
            </span>

            <span className="text-gray-400">
              {new Date(session.createdAt).toLocaleDateString()}
            </span>

            <span>{session.duration} min</span>

            <span>Level {session.difficulty}</span>

            <span className="truncate text-gray-400">
              {session.notes || "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
