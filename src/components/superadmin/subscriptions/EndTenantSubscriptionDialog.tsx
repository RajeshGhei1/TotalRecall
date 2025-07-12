
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TenantSubscription } from '@/types/subscription-types';

interface EndTenantSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: TenantSubscription | null;
}

const EndTenantSubscriptionDialog: React.FC<EndTenantSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  subscription
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const endTenantSubscriptionMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting mutation with subscription:', subscription);
      
      if (!subscription) {
        console.error('No subscription provided to mutation');
        throw new Error('No subscription selected to end');
      }

      if (!subscription.id) {
        console.error('Subscription missing ID:', subscription);
        throw new Error('Subscription ID is missing');
      }

      console.log('Ending subscription with ID:', subscription.id);

      const { error } = await (supabase as any)
        .from('tenant_subscriptions')
        .update({
          status: 'cancelled',
          ends_at: new Date().toISOString()
        })
        .eq('id', subscription.id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully ended subscription');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscriptions'] });
      toast({
        title: "Success",
        description: "Tenant subscription ended successfully"
      });
      onClose();
    },
    onError: (error: unknown) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to end tenant subscription",
        variant: "destructive"
      });
    }
  });

  const handleEnd = () => {
    console.log('Handle end called with subscription:', subscription);
    if (!subscription) {
      console.error('No subscription available when trying to end');
      toast({
        title: "Error",
        description: "No subscription selected",
        variant: "destructive"
      });
      return;
    }
    endTenantSubscriptionMutation.mutate();
  };

  if (!subscription) {
    console.log('No subscription provided, not rendering dialog');
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Tenant Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end the subscription for{' '}
            <strong>{(subscription as any).tenants?.name || 'this tenant'}</strong>?
            <br />
            <br />
            This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Set the subscription status to "cancelled"</li>
              <li>Set the end date to today</li>
              <li>Affect all users in this tenant who don't have individual subscriptions</li>
            </ul>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEnd}
            disabled={endTenantSubscriptionMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {endTenantSubscriptionMutation.isPending ? 'Ending...' : 'End Subscription'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndTenantSubscriptionDialog;
