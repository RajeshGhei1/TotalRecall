
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSuperAdminUsers = () => {
  const queryClient = useQueryClient();

  // Reset user password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string, newPassword: string }) => {
      const { data, error } = await supabase.functions.invoke('reset-user-password', {
        body: {
          userId,
          tenantId: null, // Super admin can reset any user's password
          newPassword,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Password reset failed');
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password reset",
        description: "User password has been reset successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to reset password: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleResetPassword = (userId: string, newPassword: string) => {
    resetPasswordMutation.mutate({ userId, newPassword });
  };

  return {
    resetPasswordPending: resetPasswordMutation.isPending,
    handleResetPassword,
  };
};
