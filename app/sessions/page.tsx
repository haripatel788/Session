"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Edit2 } from "lucide-react";

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
  const { userId, isLoaded } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check URL parameter to auto-open form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('open') === 'true') {
      setShowForm(true);
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/sessions');
    }
  }, []);

  useEffect(() => {
    async function loadSessions() {
      if (!userId) return;
      
      try {
        const res = await fetch("/api/study-sessions");
        if (!res.ok) {
          throw new Error(`Failed to fetch sessions: ${res.statusText}`);
        }
        const data: { sessions: Session[] } = await res.json();
        setSessions(data.sessions ?? []);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadSessions();
    }
  }, [userId, isLoaded]);

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      const res = await fetch(`/api/study-sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete session: ${res.statusText}`);
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setSubjectName(session.subject.name);
    setDuration(session.duration.toString());
    setDifficulty(session.difficulty);
    setNotes(session.notes || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingSession
        ? `/api/study-sessions/${editingSession.id}`
        : "/api/study-sessions";
      
      const method = editingSession ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName,
          duration: Number(duration),
          difficulty,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save session: ${res.statusText}`);
      }

      const savedSession: Session = await res.json();

      if (editingSession) {
        setSessions((prev) =>
          prev.map((s) => (s.id === editingSession.id ? savedSession : s))
        );
      } else {
        setSessions((prev) => [savedSession, ...prev]);
      }

      setSubjectName("");
      setDuration("");
      setDifficulty(3);
      setNotes("");
      setEditingSession(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Failed to save session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setSubjectName("");
    setDuration("");
    setDifficulty(3);
    setNotes("");
  };

  if (!isLoaded || loading) {
    return (
      <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
    );
  }

  if (!userId) {
    return (
      <p className="text-sm text-gray-400">Please sign in to view sessions.</p>
    );
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
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <h3 className="text-lg font-medium">
            {editingSession ? "Edit Session" : "New Session"}
          </h3>
          
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
            >
              {submitting ? "Saving…" : editingSession ? "Update Session" : "Save Session"}
            </button>
            
            {editingSession && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Sessions Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-medium border-b border-white/10">
          <span>Subject</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Difficulty</span>
          <span>Notes</span>
          <span className="text-right">Actions</span>
        </div>

        {sessions.length === 0 && (
          <p className="px-6 py-6 text-sm text-gray-400">
            No sessions logged yet.
          </p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-6 gap-4 px-6 py-4 border-t border-white/5 hover:bg-white/5 transition"
          >
            <span className="font-medium">{session.subject.name}</span>

            <span className="text-gray-400">
              {new Date(session.createdAt).toLocaleDateString()}
            </span>

            <span>{session.duration} min</span>

            <span>Level {session.difficulty}</span>

            <span className="truncate text-gray-400">
              {session.notes || "—"}
            </span>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleEdit(session)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
                title="Edit session"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(session.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                title="Delete session"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}