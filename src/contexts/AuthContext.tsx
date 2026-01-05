import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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

  useEffect(() => {
    logger.debug('AuthProvider: Initializing auth state');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug('Auth state changed:', event, 'Session:', !!session, 'User:', !!session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          logger.error('Error getting session:', error);
        } else {
          logger.debug('Initial session check:', !!session, 'User:', !!session?.user);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        logger.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string): Promise<string> => {
    try {
      logger.debug('Checking user role for:', userId);
      // Check if user is super admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        logger.error('Error checking user role:', error);
        return '/tenant-admin/dashboard'; // Default to tenant admin
      }

      logger.debug('User profile:', profile);
      if (profile?.role === 'super_admin') {
        logger.debug('User is super admin, redirecting to superadmin dashboard');
        return '/superadmin/dashboard';
      }

      // Default to tenant admin for authenticated users
      logger.debug('User is tenant admin, redirecting to tenant admin dashboard');
      return '/tenant-admin/dashboard';
    } catch (error) {
      logger.error('Error determining user role:', error);
      return '/tenant-admin/dashboard';
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔵 AuthContext.signIn: Starting', { email });
    logger.debug('Attempting to sign in with:', email);
    logger.debug('Supabase client initialized:', !!supabase);
    setLoading(true);
    
    try {
      // First, test if Supabase is reachable
      logger.debug('Testing Supabase connection...');
      logger.debug('Supabase URL:', supabase.supabaseUrl || 'Not available');
      
      try {
        // Test with a simple query that should work even without auth
        const { data: healthCheck, error: healthError } = await supabase
          .from('system_modules')
          .select('id')
          .limit(1);
        
        if (healthError) {
          logger.error('Supabase connection test failed with error:', healthError);
          logger.error('Error details:', {
            message: healthError.message,
            code: (healthError as unknown as { code?: string }).code,
            details: healthError.details,
            hint: healthError.hint
          });
          
          // Don't throw if it's just a permission error - that means Supabase is reachable
          if (healthError.message?.includes('permission denied') || healthError.message?.includes('JWT')) {
            logger.debug('Supabase is reachable (permission error is expected without auth)');
          } else {
            throw new Error(`Cannot connect to Supabase: ${healthError.message}`);
          }
        } else {
          logger.debug('Supabase connection test successful');
        }
      } catch (healthError) {
        logger.error('Supabase connection test exception:', healthError);
        const errorMessage = healthError instanceof Error ? healthError.message : 'Unknown connection error';
        throw new Error(`Cannot connect to Supabase: ${errorMessage}. Please check your connection and ensure Supabase is active.`);
      }
      
      // Log the request attempt with full details
      console.log('🔵 AuthContext: Calling supabase.auth.signInWithPassword...', { email: email.trim() });
      logger.debug('Calling supabase.auth.signInWithPassword...', { email });
      
      const signInPromise = supabase.auth.signInWithPassword({ 
        email: email.trim(), // Trim whitespace
        password 
      });
      
      console.log('🔵 AuthContext: Sign in promise created, waiting for response...');
      
      // Add timeout to detect if request is hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login request timed out after 10 seconds. Supabase may be unreachable or slow.')), 10000)
      );
      
      console.log('🔵 AuthContext: Waiting for authentication response...');
      logger.debug('Waiting for authentication response...');
      const result = await Promise.race([signInPromise, timeoutPromise]) as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
      const { data, error } = result;
      
      console.log('🔵 AuthContext: Response received', { 
        hasData: !!data, 
        hasError: !!error,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        errorMessage: error?.message,
        errorStatus: error?.status
      });
      
      logger.debug('Sign in response received:', { 
        hasData: !!data, 
        hasError: !!error,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        errorMessage: error?.message,
        errorStatus: error?.status
      });
      
      if (error) {
        logger.error('Sign in error received from Supabase:', error);
        logger.error('Full error details:', { 
          message: error.message, 
          status: error.status, 
          name: error.name,
          code: (error as unknown as { code?: string }).code
        });
        
        // Provide user-friendly error messages
        let userMessage = 'Invalid email or password';
        if (error.message) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
            userMessage = 'Invalid email or password. Please check your credentials.';
          } else if (error.message.includes('Email not confirmed')) {
            userMessage = 'Please confirm your email address before signing in.';
          } else if (error.message.includes('Too many requests')) {
            userMessage = 'Too many login attempts. Please try again later.';
          } else {
            userMessage = error.message;
          }
        }
        
        // Ensure error has a message property for better error handling
        const authError = new Error(userMessage);
        (authError as unknown as { status?: number; code?: string }).status = error.status;
        (authError as unknown as { status?: number; code?: string }).code = error.name;
        throw authError;
      }
      
      if (!data.user) {
        logger.error('Sign in succeeded but no user data returned');
        throw new Error('Login failed: No user data received');
      }
      
      logger.debug('Sign in successful:', !!data.user, 'User ID:', data.user?.id);
      
      // Wait a moment for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Determine redirect path based on user role
      let redirectPath = '/tenant-admin/dashboard';
      try {
        redirectPath = await checkUserRole(data.user.id);
        logger.debug('Determined redirect path:', redirectPath);
      } catch (roleError) {
        logger.error('Error checking user role, using default path:', roleError);
        // Continue with default path even if role check fails
      }
      
      logger.debug('Sign in complete, returning user and redirect path');
      return { user: data.user, redirectPath };
    } catch (error) {
      logger.error('Sign in exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    logger.debug('Attempting to sign up with:', email);
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
        logger.error('Sign up error:', error);
        throw error;
      }
      
      logger.debug('Sign up successful:', !!data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    logger.debug('Attempting to sign out');
    setLoading(true);
    
    try {
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out error:', error);
        // Don't throw the error, just log it since we already cleared local state
      } else {
        logger.debug('Sign out successful');
      }
    } catch (error) {
      logger.error('Sign out error:', error);
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
