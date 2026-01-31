"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Session,
  User,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: "free" | "premium";
  onboarding_completed: boolean;
  preferences: Record<string, unknown> | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!supabase) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data as Profile | null;
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        const userProfile = await fetchProfile(currentSession.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    };
    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!supabase)
        return { error: new Error("Not initialized") as AuthError };
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase]
  );

  const signUp = useCallback(
    async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName?: string;
    }) => {
      if (!supabase)
        return { error: new Error("Not initialized") as AuthError };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return { error };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!supabase)
        return { error: new Error("Not initialized") as AuthError };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    },
    [supabase]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
