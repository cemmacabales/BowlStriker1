import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error, status } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile query result - status:', status, 'data:', data, 'error:', error);

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116' || status === 406) {
          console.log('Profile not found, attempting to create one...');
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .upsert({
                id: currentUser.id,
                email: currentUser.email,
                is_admin: false,
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating profile:', createError);
              return null;
            }
            console.log('Profile created:', newProfile);
            return newProfile as UserProfile;
          }
        }
        return null;
      }

      if (!data) {
        // No profile exists - create one
        console.log('No profile found, attempting to create one...');
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .upsert({
              id: currentUser.id,
              email: currentUser.email,
              is_admin: false,
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }
          console.log('Profile created:', newProfile);
          return newProfile as UserProfile;
        }
        return null;
      }

      console.log('Profile fetched successfully:', data);
      console.log('Is admin?', data.is_admin);
      
      // Handle is_admin being stored as string or boolean
      const profile: UserProfile = {
        ...data,
        is_admin: data.is_admin === true || data.is_admin === 'true',
      };
      
      return profile;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const data = await fetchProfile(user.id);
      setProfile(data);
    }
  };

  // Clear all auth state
  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Step 1: Check if there's a local session
        const { data: { session: localSession } } = await supabase.auth.getSession();

        if (!localSession) {
          // No session at all - user is not logged in
          if (mounted) {
            clearAuthState();
            setLoading(false);
          }
          return;
        }

        // Step 2: Validate the session with the server using getUser()
        // getSession() only reads from localStorage and can return stale/expired sessions
        // getUser() actually validates the token with the Supabase server
        const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();

        if (userError || !validatedUser) {
          // Session is stale/expired - clear everything
          console.warn('Stale session detected, clearing auth state:', userError?.message);
          if (mounted) {
            clearAuthState();
            // Clear the stale session from localStorage
            try {
              await supabase.auth.signOut({ scope: 'local' });
            } catch (e) {
              // Ignore errors during cleanup
            }
            setLoading(false);
          }
          return;
        }

        // Step 3: Session is valid - set user and fetch profile
        if (mounted) {
          setUser(validatedUser);

          const userProfile = await fetchProfile(validatedUser.id);
          if (mounted) {
            setProfile(userProfile);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) {
          clearAuthState();
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        // Skip INITIAL_SESSION since we handle it in initAuth above
        if (event === 'INITIAL_SESSION') {
          return;
        }

        if (event === 'SIGNED_OUT') {
          clearAuthState();
          setLoading(false);
          return;
        }

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
          setUser(session.user);

          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    // Clear any stale state before signing in
    clearAuthState();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Immediately set user and fetch profile after successful sign in
    // Don't rely solely on onAuthStateChange which can race with navigation
    if (data.user) {
      setUser(data.user);
      const userProfile = await fetchProfile(data.user.id);
      setProfile(userProfile);
    }
  };

  const signOut = async () => {
    // Clear local state immediately so UI updates right away
    clearAuthState();

    try {
      // Sign out locally first (clears Supabase-managed localStorage)
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.error('Local sign out error:', err);
    }

    try {
      // Also try to revoke the session on the server
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore - local signout already cleared the session
      console.warn('Global signout failed (session may have been expired):', err);
    }

    // Safety net: clear any remaining Supabase auth keys from localStorage
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key === 'supabase.auth.token')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // Ignore localStorage errors
    }

    console.log('Successfully signed out');
  };

  const isAdmin = profile?.is_admin === true;

  // Debug logging for admin status
  useEffect(() => {
    console.log('=== ADMIN STATUS CHECK ===');
    console.log('User:', user?.email);
    console.log('Profile:', profile);
    console.log('is_admin value:', profile?.is_admin);
    console.log('isAdmin computed:', isAdmin);
    console.log('========================');
  }, [user, profile, isAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}