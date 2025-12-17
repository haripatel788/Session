"use client";

import { useTheme } from "@/app/components/ThemeContext";
import { Monitor, Moon, Sun, Check } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light mode theme",
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: "Dark mode theme",
      icon: Moon,
    },
    {
      value: "system" as const,
      label: "Follow system preference",
      icon: Monitor,
    },
  ];

  const handleExport = async () => {
    try {
      const response = await fetch("/api/study-sessions");
      const data = await response.json();

      if (!data.sessions || data.sessions.length === 0) {
        alert("No sessions to export");
        return;
      }

      const headers = ["Subject", "Duration (min)", "Difficulty", "Notes", "Date"];
      type Session = {
        subject: { name: string };
        duration: number;
        difficulty: string;
        notes?: string;
        createdAt: string;
      };

      const rows = data.sessions.map((session: Session) => [
        session.subject.name,
        session.duration,
        session.difficulty,
        session.notes || "",
        new Date(session.createdAt).toLocaleString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row: (string | number)[]) =>
          row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    }
  };

  return (
    <section className="space-y-8 min-h-[calc(100vh-200px)]">
      <div>
        <h1 className="text-3xl font-semibold text-black dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Customize your Session experience.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
          <h2 className="text-lg font-medium text-black dark:text-white">Appearance</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Choose how Session looks for you.
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-black dark:text-white">Theme</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Currently: <span className="font-medium capitalize text-black dark:text-white">{resolvedTheme}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`
                    rounded-xl border p-4 text-left transition-all
                    ${
                      isSelected
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-black"
                        : "border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      rounded-lg p-2
                      ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-500/20"
                          : "bg-gray-100 dark:bg-white/5"
                      }
                    `}
                    >
                      <Icon
                        size={20}
                        className={
                          isSelected
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{option.label}</p>
                    </div>
                    {isSelected && (
                      <Check size={20} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
          <h2 className="text-lg font-medium text-black dark:text-white">Data & Privacy</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your data and account.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">Export Data</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Download all your study sessions
              </p>
            </div>
            <button 
              onClick={handleExport}
              className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              Export
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Delete Account
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion functionality coming soon!');
                }
              }}
              className="rounded-lg border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-medium mb-2 text-black dark:text-white">About</h2>
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
          <p>Session v1.0.0</p>
          <p>Built with Next.js, Prisma, and Clerk</p>
          <p className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
            © {new Date().getFullYear()} Session – Focus. Measure. Improve.
          </p>
        </div>
      </div>
    </section>
  );
}