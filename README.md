# Mini-App Template

A starter template for building mini-apps with Next.js, TypeScript, and Tailwind CSS. Includes full Supabase authentication integration.

## Quick Start

```bash
# Clone or copy this template
cp -r ~/mini-app-template ~/my-new-app
cd ~/my-new-app

# Install dependencies (already done in template)
npm install

# Copy environment file and add your Supabase credentials
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## What's Included

This template comes pre-configured with:

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **React Hook Form + Zod** (form validation)
- **Lucide React** (icons)
- **Supabase Auth** (authentication ready)
- **localStorage persistence** (for offline/local data)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout with AuthProvider + AppShell
│   ├── page.tsx              # Home/dashboard
│   ├── globals.css           # Tailwind + custom classes
│   ├── items/page.tsx        # Example CRUD page
│   ├── settings/page.tsx     # Settings page
│   └── auth/                 # Authentication pages
│       ├── login/page.tsx
│       ├── signup/page.tsx
│       ├── forgot-password/page.tsx
│       ├── reset-password/page.tsx
│       └── callback/route.ts
├── components/
│   ├── layout/AppShell.tsx   # Main layout wrapper
│   └── ui/
│       ├── BottomBar.tsx     # Mobile navigation
│       └── ListRow.tsx       # Reusable list item
├── contexts/
│   └── AuthContext.tsx       # Authentication state provider
├── hooks/
│   └── useAuth.ts            # Authentication hook
├── lib/
│   ├── types.ts              # Type definitions
│   ├── constants.ts          # App constants
│   ├── utils.ts              # Utility functions
│   ├── storage/
│   │   └── itemStorage.ts    # localStorage layer
│   └── supabase/
│       ├── client.ts         # Browser client
│       └── server.ts         # Server client
├── middleware.ts             # Auth session refresh + route protection
```

## Customizing for Your App

### 1. Update Metadata

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
};
```

### 2. Configure Supabase

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and anon key
3. Follow [docs/GIGS_PLATFORM_FOUNDATION.md](./docs/GIGS_PLATFORM_FOUNDATION.md) for full setup

### 3. Define Your Types

Edit `src/lib/types.ts` with your app's data types.

### 4. Update Navigation

Edit these files to add your routes:
- `src/components/layout/AppShell.tsx` (top nav)
- `src/components/ui/BottomBar.tsx` (bottom nav)

### 5. Update Protected Routes

Edit `src/middleware.ts` to specify which routes require authentication:

```typescript
const protectedPaths = ["/items", "/settings", "/your-feature"];
```

### 6. Update Constants

Edit `src/lib/constants.ts`:

```typescript
export const APP_NAME = "Your App Name";

export const STORAGE_KEYS = {
  items: "your_app_items",
  settings: "your_app_settings",
} as const;
```

### 7. Create Feature Pages

Use `src/app/items/page.tsx` as a template for your CRUD pages.

## Authentication

The template includes a complete authentication system:

- **Sign up** - `/auth/signup`
- **Sign in** - `/auth/login`
- **Forgot password** - `/auth/forgot-password`
- **Reset password** - `/auth/reset-password`
- **OAuth callback** - `/auth/callback`

### Using Auth in Components

```typescript
"use client";
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not signed in</p>;

  return (
    <div>
      <p>Welcome, {profile?.full_name || user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Documentation

### [ARCHITECTURE.md](./ARCHITECTURE.md)

Detailed documentation on code patterns and conventions:

- Component structure
- Form handling
- Storage patterns
- Styling guidelines

### [docs/GIGS_PLATFORM_FOUNDATION.md](./docs/GIGS_PLATFORM_FOUNDATION.md)

Complete setup guide for integrating with the Gigs platform:

- Supabase project setup
- Database schema and migrations
- Authentication integration
- Row Level Security policies
- Environment configuration

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Creating a New App from This Template

```bash
# Copy the template
cp -r ~/mini-app-template ~/my-new-app

# Navigate to new app
cd ~/my-new-app

# Remove git history (optional, start fresh)
rm -rf .git
git init

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Update package.json name
# Edit src/app/layout.tsx metadata
# Edit src/lib/constants.ts
# Edit src/middleware.ts protected routes

# Start building!
npm run dev
```
