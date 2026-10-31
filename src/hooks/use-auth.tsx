import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  display_name: string;
  home_district: string | null;
  current_city: string;
};

type AuthState = {
  /** False when the app has no Supabase project configured. */
  configured: boolean;
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  reloadProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Supabase advises against awaiting other calls inside this callback.
      setTimeout(() => loadProfile(next?.user.id), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [loadProfile]);

  const reloadProfile = useCallback(() => loadProfile(session?.user.id), [loadProfile, session]);
  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ configured: supabase !== null, loading, session, profile, reloadProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
