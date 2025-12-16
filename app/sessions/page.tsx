"use client";

import { useEffect, useState } from "react";



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
  const [showForm, setShowForm] = useState(false);
const [subjectName, setSubjectName] = useState("");
const [duration, setDuration] = useState("");
const [difficulty, setDifficulty] = useState(3);
const [notes, setNotes] = useState("");
const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    async function loadSessions() {
      const userId = getCurrentUserId();
      const res = await fetch(`/api/study-sessions?userId=${userId}`);
      const data = await res.json();
      setSessions(data?.sessions ?? []);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Sessions</h1>
          <p className="mt-1 text-sm text-gray-400">
            All your recorded study sessions.
          </p>
        </div>

        <button
  type="button"
  onClick={() => setShowForm((prev) => !prev)}
  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 hover:-translate-y-[1px] transition-all duration-200"
>
  {showForm ? "Cancel" : "Add Session"}
</button>


      </div>

      {showForm && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      setSubmitting(true);

      const userId = getCurrentUserId();

      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subjectName,
          duration: Number(duration),
          difficulty,
          notes,
        }),
      });

      const newSession = await res.json();

      if (res.ok) {
        setSessions((prev) => [newSession, ...prev]);
        setSubjectName("");
        setDuration("");
        setDifficulty(3);
        setNotes("");
        setShowForm(false);
      }

      setSubmitting(false);
    }}
    className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
  >
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <input
        required
        placeholder="Subject"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm"
      />

      <input
        required
        type="number"
        min={1}
        placeholder="Duration (min)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm"
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm"
      >
        {[1, 2, 3, 4, 5].map((d) => (
          <option key={d} value={d}>
            Difficulty {d}
          </option>
        ))}
      </select>

      <input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm"
      />
    </div>

    <button
      disabled={submitting}
      className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
    >
      {submitting ? "Saving…" : "Save Session"}
    </button>
  </form>
)}


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
function getCurrentUserId() {
  // Simulating fetching the current user ID from a session or authentication context
  const userId = localStorage.getItem("currentUserId");
  if (!userId) {
    throw new Error("User is not logged in.");
  }
  return userId;
}

