
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Sparkles } from "lucide-react";

interface AuthHeaderProps {
  bypassAuth: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ bypassAuth }) => {
  return (
    <>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-jobmojo-primary to-jobmojo-secondary rounded-lg flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-jobmojo-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-jobmojo-primary to-jobmojo-secondary bg-clip-text text-transparent">
              TOTAL RECALL
            </h1>
            <span className="text-lg text-jobmojo-accent font-semibold -mt-1">.ai</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access the dashboard
        </p>
      </div>

      {bypassAuth && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Authentication bypass is enabled. You will be automatically redirected to the superadmin dashboard.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
