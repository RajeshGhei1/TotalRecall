import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// import { useSessionLogger } from '@/hooks/useSessionLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  bypassAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; redirectPath: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [bypassAuth] = useState(false); // Set to false to use real authentication

  // Add session logging
  // useSessionLogger();

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'Session:', !!session, 'User:', !!session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', !!session, 'User:', !!session?.user);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string): Promise<string> => {
    try {
      console.log('Checking user role for:', userId);
      // Check if user is super admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking user role:', error);
        return '/tenant-admin/dashboard'; // Default to tenant admin
      }

      console.log('User profile:', profile);
      if (profile?.role === 'super_admin') {
        console.log('User is super admin, redirecting to superadmin dashboard');
        return '/superadmin/dashboard';
      }

      // Default to tenant admin for authenticated users
      console.log('User is tenant admin, redirecting to tenant admin dashboard');
      return '/tenant-admin/dashboard';
    } catch (error) {
      console.error('Error determining user role:', error);
      return '/tenant-admin/dashboard';
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', !!data.user, 'User ID:', data.user?.id);
      
      // Determine redirect path based on user role
      let redirectPath = '/tenant-admin/dashboard';
      if (data.user) {
        redirectPath = await checkUserRole(data.user.id);
        console.log('Determined redirect path:', redirectPath);
      }
      
      return { user: data.user, redirectPath };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Attempting to sign up with:', email);
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Sign up successful:', !!data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Attempting to sign out');
    setLoading(true);
    
    try {
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Don't throw the error, just log it since we already cleared local state
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Don't throw the error, the local state is already cleared
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, bypassAuth, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
