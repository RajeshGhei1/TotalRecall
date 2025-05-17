
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthHeaderProps {
  bypassAuth: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ bypassAuth }) => {
  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-jobmojo-primary tracking-tight">
          JobMojo.ai
        </h1>
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
