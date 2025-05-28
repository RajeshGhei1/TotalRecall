
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

const assignSubscriptionSchema = z.object({
  tenant_id: z.string().min(1, "Please select a tenant"),
  plan_id: z.string().min(1, "Please select a plan"),
  billing_cycle: z.enum(['monthly', 'annually']),
  starts_at: z.date(),
  ends_at: z.date().optional()
});

type AssignSubscriptionFormData = z.infer<typeof assignSubscriptionSchema>;

interface AssignSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignSubscriptionDialog: React.FC<AssignSubscriptionDialogProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AssignSubscriptionFormData>({
    resolver: zodResolver(assignSubscriptionSchema),
    defaultValues: {
      billing_cycle: 'monthly',
      starts_at: new Date()
    }
  });

  // Fetch tenants
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch subscription plans
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('plan_type', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const assignSubscriptionMutation = useMutation({
    mutationFn: async (data: AssignSubscriptionFormData) => {
      const { error } = await supabase
        .from('tenant_subscriptions')
        .insert([{
          tenant_id: data.tenant_id,
          plan_id: data.plan_id,
          billing_cycle: data.billing_cycle,
          status: 'active',
          starts_at: data.starts_at.toISOString(),
          ends_at: data.ends_at?.toISOString() || null
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscriptions'] });
      toast({
        title: "Success",
        description: "Subscription assigned successfully"
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign subscription",
        variant: "destructive"
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit((data) => assignSubscriptionMutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label>Tenant</Label>
            <Controller
              name="tenant_id"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants?.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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
                    {plans?.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} ({plan.plan_type})
                      </SelectItem>
                    ))}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={assignSubscriptionMutation.isPending}
            >
              {assignSubscriptionMutation.isPending ? 'Assigning...' : 'Assign Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSubscriptionDialog;
