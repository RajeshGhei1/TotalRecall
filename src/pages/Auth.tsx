
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { makeUserSuperAdmin } from "@/utils/makeUserSuperAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { SignupForm, SignupFormValues } from "@/components/auth/SignupForm";
import { SuperAdminForm, SuperAdminEmailFormValues } from "@/components/auth/SuperAdminForm";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { signIn, signUp, bypassAuth } = useAuth();
  const navigate = useNavigate();
  const [superAdminPromoting, setSuperAdminPromoting] = useState(false);
  const [superAdminPromoted, setSuperAdminPromoted] = useState(false);

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, data.fullName);
      setActiveTab("login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const onMakeSuperAdminSubmit = async (data: SuperAdminEmailFormValues) => {
    setSuperAdminPromoting(true);
    try {
      const result = await makeUserSuperAdmin(data.email);
      setSuperAdminPromoted(result);
    } catch (error) {
      console.error("Error making super admin:", error);
    } finally {
      setSuperAdminPromoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <AuthHeader bypassAuth={bypassAuth} />

        {!bypassAuth && (
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
        )}

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
