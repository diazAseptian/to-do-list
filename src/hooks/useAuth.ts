import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { performLogout } from '../utils/authUtils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          email_confirm: true
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Jika error karena email belum dikonfirmasi, coba konfirmasi otomatis
    if (error && error.message.includes('Email not confirmed')) {
      // Update user untuk bypass email confirmation
      const { error: updateError } = await supabase.rpc('confirm_user_email', {
        user_email: email
      });
      
      if (!updateError) {
        // Coba login lagi setelah konfirmasi
        return await supabase.auth.signInWithPassword({ email, password });
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    try {
      const result = await performLogout();
      
      // Force clear local state
      setUser(null);
      
      if (result.success) {
        return { error: null };
      } else {
        return { error: result.error };
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force clear local state even on error
      setUser(null);
      return { error };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}