
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock } from 'lucide-react';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

export const SessionTimeoutWarning = () => {
  const { showWarning, timeRemaining, extendSession, formatTime } = useSessionTimeout();

  if (!showWarning || !timeRemaining) return null;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in <strong>{formatTime(timeRemaining)}</strong> due to inactivity.
            You will be automatically logged out when the timer reaches zero.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => window.location.reload()}>
            Logout Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={extendSession}>
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
