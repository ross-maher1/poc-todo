# Mini-App Architecture Guide

This document defines the foundational patterns, conventions, and structure for building mini-apps in this ecosystem. It serves as the starting point for any new application and provides guidance for both developers and AI tools.

---

## Overview

Our mini-apps are built with:

- **Next.js** (App Router) - React framework with file-based routing
- **TypeScript** - Type safety throughout
- **Tailwind CSS v4** - Utility-first styling with custom classes
- **React Hook Form + Zod** - Form handling and validation
- **localStorage** - Client-side persistence (Supabase optional for cloud sync)

Each app follows a consistent structure that prioritizes:

1. **Simplicity** - No unnecessary abstractions or over-engineering
2. **Type Safety** - Strict TypeScript with well-defined types
3. **Separation of Concerns** - Clear boundaries between UI, logic, and data
4. **Maintainability** - Small, focused files that are easy to understand

---

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (fonts, AppShell wrapper)
│   ├── page.tsx              # Home/dashboard page
│   ├── globals.css           # Tailwind imports + custom classes
│   ├── [feature]/            # Feature pages (e.g., /invoices, /songs)
│   │   ├── page.tsx          # List view
│   │   ├── new/page.tsx      # Create form
│   │   └── [id]/page.tsx     # Detail/edit view
│   └── settings/page.tsx     # App settings
├── components/
│   ├── layout/
│   │   └── AppShell.tsx      # Main layout wrapper (nav, content, bottom bar)
│   └── ui/
│       ├── BottomBar.tsx     # Mobile bottom navigation
│       └── [Feature]Row.tsx  # Reusable list item components
├── lib/
│   ├── types.ts              # Core type definitions
│   ├── constants.ts          # App constants and configuration
│   ├── utils.ts              # Shared utility functions
│   ├── [feature]/
│   │   ├── api.ts            # CRUD operations (Supabase or localStorage)
│   │   └── data.ts           # Initial/seed data (if applicable)
│   └── storage/
│       └── [feature]Storage.ts  # localStorage persistence layer
└── types/                    # Additional type definitions (if needed)
    └── [feature].ts
```

---

## Core Patterns

### 1. Type Definitions (`src/lib/types.ts`)

Define all core types in a central location. Use discriminated unions for items that can be multiple types.

```typescript
// Core entity types
export type Song = {
  id: string;
  title: string;
  artist: string;
  // ... other fields
};

// Discriminated unions for mixed collections
export type SetlistItem = Song | SetlistDivider;

export type SetlistDivider = {
  id: string;
  isDivider: true;  // Discriminant
  label: string;
};

// UI state types
export type Theme = "default" | "blue" | "pink" | "dark" | "contrast";
```

**Type guard functions** go in `utils.ts`:

```typescript
export const isDivider = (item: SetlistItem): item is SetlistDivider => {
  return "isDivider" in item && item.isDivider === true;
};
```

### 2. ID Generation (`src/lib/utils.ts`)

Use a consistent ID generation pattern:

```typescript
export const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
```

### 3. localStorage Persistence (`src/lib/storage/`)

Each feature has its own storage module with load/save functions:

```typescript
const STORAGE_KEY = "app_name_feature";

export function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("loadItems error", error);
    return [];
  }
}

export function saveItems(items: Item[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("saveItems error", error);
  }
}
```

### 4. Form Handling (React Hook Form + Zod)

All forms use this pattern:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  optional: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// In component:
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: "",
    email: "",
    optional: "",
  },
});
```

### 5. Page Component Pattern

All pages follow this structure:

```typescript
"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Types
import { Item } from "@/lib/types";

// Data operations
import { loadItems, saveItems } from "@/lib/storage/itemStorage";

// Components
import ListRow from "@/components/ui/ListRow";

// Schema
const itemSchema = z.object({
  // ...
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function ItemsPage() {
  // State
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { /* ... */ },
  });

  // Load data on mount
  useEffect(() => {
    const data = loadItems();
    setItems(data);
    setLoading(false);
  }, []);

  // Derived state
  const formTitle = useMemo(
    () => (editingId ? "Edit item" : "Add an item"),
    [editingId]
  );

  // Handlers
  const onSubmit = (values: ItemFormValues) => {
    // Create/update logic
    // Save to storage
    // Reset form
  };

  // Render
  return (
    <main className="space-y-10">
      {/* Header */}
      {/* Form */}
      {/* List */}
    </main>
  );
}
```

---

## Styling Conventions

### Global CSS Classes (`src/app/globals.css`)

Define reusable typography and layout classes:

```css
@import "tailwindcss";

:root {
  --background: #f7f1ea;
  --foreground: #111827;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
}

/* Layout */
.app-shell {
  @apply relative min-h-screen overflow-hidden bg-[var(--background)] text-slate-900;
}

.app-blob {
  @apply pointer-events-none absolute inset-x-0 top-[-18%] h-[320px] max-w-5xl -translate-x-1/2 left-1/2 rounded-full opacity-80 blur-3xl;
  background: radial-gradient(circle at 20% 40%, #fbbf24 0%, transparent 35%),
    radial-gradient(circle at 50% 30%, #fb7185 0%, transparent 45%),
    radial-gradient(circle at 75% 20%, #c084fc 0%, transparent 40%);
}

.app-content {
  @apply relative z-[1] mx-auto w-full max-w-6xl px-6 pb-28 pt-10;
}

/* Typography */
.type-meta {
  @apply text-xs uppercase tracking-[0.3rem] text-slate-500;
}

.type-h1 {
  @apply text-3xl font-semibold tracking-tight md:text-4xl;
}

.type-lead {
  @apply text-sm text-slate-600;
}

.type-item-title {
  @apply text-sm font-semibold italic text-slate-900;
}
```

### Component Styling Patterns

Use Tailwind utility classes with consistent patterns:

**Cards/Containers:**
```tsx
<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
```

**Buttons (Primary):**
```tsx
<button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
```

**Buttons (Secondary):**
```tsx
<button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400">
```

**Form Inputs:**
```tsx
<input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none" />
```

**Error Messages:**
```tsx
<p className="mt-1 text-xs text-rose-600">{error.message}</p>
```

---

## Layout Components

### AppShell (`src/components/layout/AppShell.tsx`)

The root layout wrapper that provides:
- Decorative background blob
- Top navigation bar
- Content container
- Bottom navigation bar

```typescript
import { ReactNode } from "react";
import BottomBar from "../ui/BottomBar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-blob" aria-hidden="true" />
      <nav className="relative z-[2] mx-auto w-full max-w-6xl px-6 pt-6">
        {/* Top navigation */}
      </nav>
      <div className="app-content">{children}</div>
      <BottomBar />
    </div>
  );
}
```

### BottomBar (`src/components/ui/BottomBar.tsx`)

Mobile-friendly bottom navigation:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Music, Settings } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/items", icon: List, label: "Items" },
  // ... app-specific navigation
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/70 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={/* active styles */}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App Name",
  description: "App description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

---

## Dependencies

Every mini-app requires these packages:

```bash
npm install react-hook-form @hookform/resolvers zod lucide-react
```

**Core dependencies:**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration for react-hook-form
- `zod` - Schema validation
- `lucide-react` - Icon library

**Optional dependencies:**
- `@supabase/supabase-js` - Cloud persistence
- `@react-pdf/renderer` - PDF generation (use dynamic import with `ssr: false`)

---

## Creating a New Mini-App

### Step 1: Initialize the Project

```bash
npx create-next-app@latest app-name --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
cd app-name
npm install react-hook-form @hookform/resolvers zod lucide-react
```

### Step 2: Create Directory Structure

```bash
mkdir -p src/{lib/{storage,feature},components/{layout,ui},types}
```

### Step 3: Copy Foundation Files

Copy these files from an existing app and customize:
- `src/app/globals.css` - Update CSS variables if needed
- `src/app/layout.tsx` - Update metadata
- `src/components/layout/AppShell.tsx` - Update navigation links
- `src/components/ui/BottomBar.tsx` - Update navigation items
- `src/lib/utils.ts` - Copy `createId` and other common utilities

### Step 4: Define Types

Create `src/lib/types.ts` with your app's core types.

### Step 5: Create Storage Layer

Create `src/lib/storage/[feature]Storage.ts` for each feature.

### Step 6: Build Pages

Follow the page component pattern for each route.

---

## Code Quality Checklist

Before considering a feature complete:

- [ ] All types are defined in `src/lib/types.ts`
- [ ] Forms use React Hook Form + Zod validation
- [ ] Data is persisted to localStorage (or Supabase)
- [ ] Loading and empty states are handled
- [ ] Error messages are displayed for form validation
- [ ] Components are small and focused (< 200 lines)
- [ ] No `any` types (use `unknown` if needed)
- [ ] No unused imports or variables
- [ ] Build passes without errors (`npm run build`)

---

## Anti-Patterns to Avoid

1. **Monolithic components** - Split files larger than 200 lines
2. **Inline styles** - Use Tailwind classes or CSS custom properties
3. **Untyped props** - Always define prop types
4. **Mixed concerns** - Keep UI, logic, and data separate
5. **Hardcoded strings** - Use constants for repeated values
6. **Implicit any** - Enable strict TypeScript
7. **No error handling** - Wrap localStorage/API calls in try-catch
8. **No loading states** - Always show loading feedback
9. **Template literal syntax errors** - Use backticks for interpolation
10. **Unused dependencies** - Remove imports you don't use

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `src/app/songs/page.tsx` |
| Components | PascalCase | `SongRow.tsx`, `AppShell.tsx` |
| Utilities | camelCase | `utils.ts`, `setlistStorage.ts` |
| Types | camelCase | `types.ts` |
| Constants | camelCase | `constants.ts` |
| Data/Seed | camelCase | `data.ts` |

---

## Summary

This architecture prioritizes:

1. **Consistency** - Same patterns across all mini-apps
2. **Simplicity** - Minimal abstractions, direct code paths
3. **Type Safety** - Full TypeScript coverage
4. **Maintainability** - Small files, clear separation of concerns
5. **Developer Experience** - Familiar patterns, easy to onboard

When in doubt, look at existing mini-apps for reference and follow established patterns rather than inventing new ones.
