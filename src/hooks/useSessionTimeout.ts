
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SessionTimeoutSettings {
  session_timeout: number; // in seconds
}

const DEFAULT_SESSION_TIMEOUT = 3600; // 1 hour

export function useSessionTimeout() {
  const { user, signOut } = useAuth();
  const [sessionTimeout, setSessionTimeout] = useState(DEFAULT_SESSION_TIMEOUT);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Fetch session timeout from global settings
  useEffect(() => {
    const fetchSessionTimeout = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('global_settings')
          .select('setting_value')
          .eq('category', 'security')
          .eq('setting_key', 'session_timeout')
          .single();

        if (!error && settings?.setting_value) {
          setSessionTimeout(Number(settings.setting_value));
        }
      } catch (error) {
        console.error('Failed to fetch session timeout:', error);
      }
    };

    fetchSessionTimeout();
  }, []);

  // Reset activity tracker
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // Set warning timeout (5 minutes before logout)
    const warningTime = Math.max(sessionTimeout - 300, sessionTimeout * 0.8); // 5 min or 20% before timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(300); // 5 minutes remaining
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleSessionTimeout();
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }, warningTime * 1000);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, sessionTimeout * 1000);
  };

  const handleSessionTimeout = async () => {
    setShowWarning(false);
    setTimeRemaining(null);
    
    toast({
      title: 'Session Expired',
      description: 'Your session has expired due to inactivity. Please log in again.',
      variant: 'destructive',
    });

    try {
      await signOut();
    } catch (error) {
      console.error('Error during session timeout logout:', error);
    }
  };

  const extendSession = () => {
    resetActivity();
    setShowWarning(false);
    setTimeRemaining(null);
    
    toast({
      title: 'Session Extended',
      description: 'Your session has been extended.',
    });
  };

  // Set up activity listeners
  useEffect(() => {
    if (!user) return;

    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      // Only reset if it's been more than 1 minute since last activity
      if (Date.now() - lastActivityRef.current > 60000) {
        resetActivity();
      }
    };

    activities.forEach(activity => {
      document.addEventListener(activity, handleActivity, true);
    });

    // Initialize session timeout
    resetActivity();

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [user, sessionTimeout]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    sessionTimeout,
    timeRemaining,
    showWarning,
    extendSession,
    formatTime
  };
}
