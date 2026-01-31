"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Settings } from "lucide-react";

/**
 * Navigation items for the bottom bar.
 * Update this array with your app's routes.
 */
const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/items", icon: List, label: "Items" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/70 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
