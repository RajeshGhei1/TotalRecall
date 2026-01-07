
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { makeUserSuperAdmin } from "@/utils/makeUserSuperAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { SignupForm, SignupFormValues } from "@/components/auth/SignupForm";
import { SuperAdminForm, SuperAdminEmailFormValues } from "@/components/auth/SuperAdminForm";
import LinkedInOAuthCallback from "@/components/auth/LinkedInOAuthCallback";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/utils/logger";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { signIn, signUp, bypassAuth, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [superAdminPromoting, setSuperAdminPromoting] = useState(false);
  const [superAdminPromoted, setSuperAdminPromoted] = useState(false);
  const { toast } = useToast();
  
  // Get app context and next action from URL params
  const appName = searchParams.get('app');
  const nextAction = searchParams.get('next'); // 'subscribe' or other actions

  // Check if this is a LinkedIn OAuth callback
  const isLinkedInCallback = searchParams.get('code') && searchParams.get('state');

  // Handle bypass auth redirect
  useEffect(() => {
    if (bypassAuth && !loading) {
      logger.debug('Bypass auth enabled, redirecting to superadmin dashboard');
      navigate("/superadmin/dashboard");
    }
  }, [bypassAuth, loading, navigate]);

  // If this is a LinkedIn callback, show the callback component
  if (isLinkedInCallback) {
    return (
      <LinkedInOAuthCallback 
        onSuccess={(tenantId) => {
          logger.debug('LinkedIn OAuth successful for tenant:', tenantId);
        }}
        onError={(error) => {
          logger.error('LinkedIn OAuth error:', error);
          toast({
            title: "OAuth Error",
            description: "Failed to authenticate with LinkedIn",
            variant: "destructive",
          });
        }}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if bypass auth is enabled (will redirect)
  if (bypassAuth) {
    return null;
  }

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      logger.debug("Auth page: Starting login for:", data.email);
      const result = await signIn(data.email, data.password);
      logger.debug("Auth page: Login successful, user:", result.user?.id);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      // Redirect based on context
      if (nextAction === 'subscribe' && appName) {
        navigate(`/subscribe?app=${encodeURIComponent(appName)}`, { replace: true });
      } else if (appName) {
        navigate(`/subscribe?app=${encodeURIComponent(appName)}`, { replace: true });
      } else {
        // Default redirect handled by LoginForm
      }
      
      return result;
    } catch (error: unknown) {
      logger.error("Auth page: Login error:", error);
      // Extract error message for better user feedback
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by LoginForm
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, data.fullName);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
      // If app context exists, switch to login tab so user can sign in
      // After login, they'll be redirected to subscription page
      if (appName) {
        setActiveTab("login");
        toast({
          title: "Next Step",
          description: "Please sign in to continue to subscription selection.",
        });
      } else {
        setActiveTab("login");
      }
    } catch (error: unknown) {
      logger.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again.";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onMakeSuperAdminSubmit = async (data: SuperAdminEmailFormValues) => {
    setSuperAdminPromoting(true);
    try {
      const result = await makeUserSuperAdmin(data.email);
      setSuperAdminPromoted(result);
      if (result) {
        toast({
          title: "Super Admin Created",
          description: "User has been granted super admin privileges.",
        });
      }
    } catch (error) {
      logger.error("Error making super admin:", error);
      toast({
        title: "Error",
        description: "Failed to create super admin.",
        variant: "destructive",
      });
    } finally {
      setSuperAdminPromoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <AuthHeader bypassAuth={bypassAuth} />
        {appName && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-900">
              <strong>Getting access to:</strong> {appName}
            </p>
            <p className="text-xs text-indigo-700 mt-1">
              Sign in or create an account to view subscription plans for this app.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <LoginForm onSubmit={onLoginSubmit} />
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <SignupForm onSubmit={onSignupSubmit} />
          </TabsContent>
        </Tabs>

        <SuperAdminForm 
          onSubmit={onMakeSuperAdminSubmit} 
          isPromoting={superAdminPromoting} 
          isPromoted={superAdminPromoted} 
        />
        
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
