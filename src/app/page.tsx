"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadItems } from "@/lib/storage/itemStorage";

/**
 * Home/Dashboard page.
 *
 * This is a template - customize it for your app.
 */
export default function HomePage() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const items = loadItems();
    setItemCount(items.length);
  }, []);

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="type-meta">Dashboard</p>
        <h1 className="type-h1">Mini App</h1>
        <p className="type-lead">
          A template for building mini-apps. Data is stored locally in your
          browser.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/items"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items</h2>
            <span className="text-2xl font-bold text-slate-900">
              {itemCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            View and manage your items
          </p>
        </Link>

        <Link
          href="/settings"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Configure app preferences
          </p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/items"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Add Item
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
