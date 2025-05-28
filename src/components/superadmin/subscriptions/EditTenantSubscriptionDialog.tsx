
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TenantSubscription } from '@/types/subscription-types';

const editTenantSubscriptionSchema = z.object({
  plan_id: z.string().min(1, "Please select a plan"),
  billing_cycle: z.enum(['monthly', 'annually']),
  status: z.enum(['active', 'inactive', 'cancelled', 'expired']),
  starts_at: z.date(),
  ends_at: z.date().optional()
});

type EditTenantSubscriptionFormData = z.infer<typeof editTenantSubscriptionSchema>;

interface EditTenantSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: TenantSubscription | null;
}

const EditTenantSubscriptionDialog: React.FC<EditTenantSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  subscription
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditTenantSubscriptionFormData>({
    resolver: zodResolver(editTenantSubscriptionSchema),
    defaultValues: {
      plan_id: subscription?.plan_id || '',
      billing_cycle: subscription?.billing_cycle || 'monthly',
      status: subscription?.status || 'active',
      starts_at: subscription ? new Date(subscription.starts_at) : new Date(),
      ends_at: subscription?.ends_at ? new Date(subscription.ends_at) : undefined
    }
  });

  // Reset form when subscription changes
  React.useEffect(() => {
    if (subscription) {
      form.reset({
        plan_id: subscription.plan_id,
        billing_cycle: subscription.billing_cycle,
        status: subscription.status,
        starts_at: new Date(subscription.starts_at),
        ends_at: subscription.ends_at ? new Date(subscription.ends_at) : undefined
      });
    }
  }, [subscription, form]);

  // Fetch subscription plans
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('plan_type', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const updateTenantSubscriptionMutation = useMutation({
    mutationFn: async (data: EditTenantSubscriptionFormData) => {
      if (!subscription) throw new Error('No subscription to update');

      const { error } = await (supabase as any)
        .from('tenant_subscriptions')
        .update({
          plan_id: data.plan_id,
          billing_cycle: data.billing_cycle,
          status: data.status,
          starts_at: data.starts_at.toISOString(),
          ends_at: data.ends_at?.toISOString() || null
        })
        .eq('id', subscription.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscriptions'] });
      toast({
        title: "Success",
        description: "Tenant subscription updated successfully"
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tenant subscription",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: EditTenantSubscriptionFormData) => {
    updateTenantSubscriptionMutation.mutate(data);
  };

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Tenant Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <Controller
              name="plan_id"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans?.map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} ({plan.plan_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.plan_id && (
              <p className="text-sm text-red-500">{form.formState.errors.plan_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Controller
              name="billing_cycle"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Controller
              name="starts_at"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Controller
              name="ends_at"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "No end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateTenantSubscriptionMutation.isPending}
            >
              {updateTenantSubscriptionMutation.isPending ? 'Updating...' : 'Update Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenantSubscriptionDialog;
