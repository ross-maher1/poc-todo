/**
 * Database Types
 *
 * Shared types for the unified user model (profiles table)
 * plus app-specific tables.
 */

// ============================================================================
// PROFILES (shared across all mini-apps)
// ============================================================================

export type SubscriptionTier = "free" | "premium";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  subscription_tier: SubscriptionTier;
  onboarding_completed: boolean;
  preferences: Record<string, unknown> | null;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  subscription_tier?: SubscriptionTier;
  onboarding_completed?: boolean;
  preferences?: Record<string, unknown> | null;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string | null;
  subscription_tier?: SubscriptionTier;
  onboarding_completed?: boolean;
  preferences?: Record<string, unknown> | null;
}

// ============================================================================
// TASKS
// ============================================================================

export interface TaskRow {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  due_date: string | null;
  completed: boolean;
}

export interface TaskInsert {
  user_id: string;
  title: string;
  due_date?: string | null;
  completed?: boolean;
}

export interface TaskUpdate {
  title?: string;
  due_date?: string | null;
  completed?: boolean;
}

// ============================================================================
// DATABASE SCHEMA TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      tasks: {
        Row: TaskRow;
        Insert: TaskInsert;
        Update: TaskUpdate;
      };
    };
  };
}
