
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  bypassAuth: boolean;
}

// Create a mock user for development purposes
const mockUser = {
  id: '9374586c-f2fa-4503-8493-672c3e750345',
  aud: 'authenticated',
  email: 'dev@jobmojo.ai',
  phone: '',
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: '',
  user_metadata: {
    full_name: 'Development User'
  },
  app_metadata: {
    role: 'super_admin'
  }
} as unknown as User;

const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Date.now() + 3600,
} as Session;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false); // Set to false by default
  const navigate = useNavigate();

  useEffect(() => {
    if (bypassAuth) {
      console.log("Auth bypass is enabled - using mock user");
      setUser(mockUser);
      setSession(mockSession);
      setLoading(false);
      return;
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, determining redirect path...');
          
          // Check if user is super admin and redirect accordingly
          if (session.user) {
            // Check user role to determine redirect
            setTimeout(async () => {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', session.user.id)
                  .maybeSingle();
                
                console.log('User profile role:', profile?.role);
                
                if (profile?.role === 'super_admin') {
                  console.log('Redirecting super admin to superadmin dashboard');
                  navigate('/superadmin/dashboard');
                } else {
                  console.log('Redirecting regular user to tenant admin dashboard');
                  navigate('/tenant-admin/dashboard');
                }
              } catch (error) {
                console.error('Error checking user role:', error);
                // Default to tenant admin dashboard
                navigate('/tenant-admin/dashboard');
              }
            }, 100);
          }
          
          toast({
            title: "Signed in successfully",
            description: `Welcome, ${session.user.email}!`,
          });
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          toast({
            title: "Signed out successfully",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, bypassAuth]);

  const signIn = async (email: string, password: string) => {
    if (bypassAuth) {
      console.log("Auth bypass is enabled - redirecting without actual sign in");
      navigate('/superadmin/dashboard');
      return;
    }

    try {
      console.log('Attempting to sign in user:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Don't navigate here - let the auth state change handler do it
      console.log('Sign in successful, waiting for auth state change...');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (bypassAuth) {
      console.log("Auth bypass is enabled - pretending to sign up");
      toast({
        title: "Development mode",
        description: "Sign up bypassed in development mode",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification instructions.",
      });
      
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    if (bypassAuth) {
      console.log("Auth bypass is enabled - pretending to sign out");
      navigate('/auth');
      return;
    }

    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, bypassAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
