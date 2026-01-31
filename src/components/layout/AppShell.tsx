import Link from "next/link";
import { ReactNode } from "react";
import BottomBar from "../ui/BottomBar";

/**
 * Main layout wrapper that provides:
 * - Decorative background blob
 * - Top navigation bar
 * - Content container
 * - Bottom navigation bar
 *
 * Update the navigation links to match your app's routes.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-blob" aria-hidden="true" />
      <nav className="relative z-[2] mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
          <span className="text-xs uppercase tracking-[0.3rem] text-slate-500">
            Navigate
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:border-slate-300"
            >
              Home
            </Link>
            <Link
              href="/items"
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:border-slate-300"
            >
              Items
            </Link>
            <Link
              href="/settings"
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:border-slate-300"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>
      <div className="app-content">{children}</div>
      <BottomBar />
    </div>
  );
}
