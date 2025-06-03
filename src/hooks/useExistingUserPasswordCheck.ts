
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePasswordRequirements } from './usePasswordRequirements';

interface PasswordCheckResult {
  needsUpdate: boolean;
  lastChecked: string | null;
  hasWeakPassword: boolean;
}

export function useExistingUserPasswordCheck() {
  const { user } = useAuth();
  const { requirements } = usePasswordRequirements();
  const [passwordCheck, setPasswordCheck] = useState<PasswordCheckResult>({
    needsUpdate: false,
    lastChecked: null,
    hasWeakPassword: false
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkPasswordPolicy = async () => {
      setIsChecking(true);
      
      try {
        // Check if user has been flagged for password update
        const { data: userFlags, error } = await supabase
          .from('profiles')
          .select('password_last_checked, needs_password_update')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Not found error is ok
          console.error('Error checking password policy:', error);
          return;
        }

        // If user hasn't been checked or needs update
        if (!userFlags?.password_last_checked || userFlags?.needs_password_update) {
          setPasswordCheck({
            needsUpdate: true,
            lastChecked: userFlags?.password_last_checked || null,
            hasWeakPassword: userFlags?.needs_password_update || false
          });
        }
      } catch (error) {
        console.error('Password policy check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkPasswordPolicy();
  }, [user?.id, requirements]);

  const markPasswordAsUpdated = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          password_last_checked: new Date().toISOString(),
          needs_password_update: false
        });

      if (error) {
        console.error('Error updating password check status:', error);
      } else {
        setPasswordCheck(prev => ({
          ...prev,
          needsUpdate: false,
          hasWeakPassword: false,
          lastChecked: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Failed to mark password as updated:', error);
    }
  };

  return {
    passwordCheck,
    isChecking,
    markPasswordAsUpdated
  };
}
