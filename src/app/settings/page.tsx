"use client";

import { useState } from "react";
import { saveItems } from "@/lib/storage/itemStorage";
import { APP_NAME } from "@/lib/constants";

/**
 * Settings page.
 *
 * This is a template - customize it for your app.
 */
export default function SettingsPage() {
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleResetData = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    saveItems([]);
    setResetConfirm(false);
    window.location.href = "/";
  };

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="type-meta">Preferences</p>
        <h1 className="type-h1">Settings</h1>
        <p className="type-lead">Manage your app preferences and data.</p>
      </div>

      {/* Data Management */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-lg">
        <h2 className="text-lg font-semibold">Data Management</h2>
        <p className="mt-2 text-sm text-slate-600">
          All data is stored locally in your browser. Use these options to
          manage your data.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium text-slate-900">Reset Data</h3>
            <p className="mt-1 text-sm text-slate-600">
              This will delete all your saved items. This action cannot be
              undone.
            </p>
            <button
              onClick={handleResetData}
              className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold shadow ${
                resetConfirm
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {resetConfirm ? "Click again to confirm" : "Reset Data"}
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-lg">
        <h2 className="text-lg font-semibold">About</h2>
        <p className="mt-2 text-sm text-slate-600">
          {APP_NAME} is built with Next.js, TypeScript, and Tailwind CSS.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Data is stored locally in your browser using localStorage.
        </p>
      </div>
    </main>
  );
}
