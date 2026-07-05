import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  init: () => () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  init: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      set({ user: session?.user ?? null, loading: false });
    });
    return () => subscription.unsubscribe();
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
