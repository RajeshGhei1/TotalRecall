
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';
import { useExistingUserPasswordCheck } from '@/hooks/useExistingUserPasswordCheck';

export const WeakPasswordNotification = () => {
  const { passwordCheck, markPasswordAsUpdated } = useExistingUserPasswordCheck();
  const [dismissed, setDismissed] = useState(false);

  if (!passwordCheck.needsUpdate || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleUpdatePassword = () => {
    // This would typically open the user settings dialog to the security tab
    const event = new CustomEvent('openUserSettings', { detail: { tab: 'security' } });
    window.dispatchEvent(event);
  };

  return (
    <Alert className="mx-4 mt-4 border-orange-200 bg-orange-50">
      <Shield className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium text-orange-800">Password Update Required</span>
          <p className="text-sm text-orange-700 mt-1">
            Your current password doesn't meet the updated security requirements. 
            Please update your password to ensure account security.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdatePassword}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            Update Password
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-orange-600 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
