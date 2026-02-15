"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const supabase = createClient();

export default function HomePage() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const fetchCounts = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tasks")
      .select("completed")
      .eq("user_id", user.id);

    if (data) {
      setPendingCount(
        data.filter((t: { completed: boolean }) => !t.completed).length
      );
      setCompletedCount(
        data.filter((t: { completed: boolean }) => t.completed).length
      );
    }
  }, [user]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="type-meta">Dashboard</p>
        <h1 className="type-h1">Todo</h1>
        <p className="type-lead">
          A simple task manager. Data is stored in Supabase.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/tasks"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pending</h2>
            <span className="text-2xl font-bold text-slate-900">
              {pendingCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Tasks to complete</p>
        </Link>

        <Link
          href="/tasks"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Completed</h2>
            <span className="text-2xl font-bold text-emerald-600">
              {completedCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Tasks done</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Add Task
          </Link>
          <Link
            href="/settings"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
          >
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
