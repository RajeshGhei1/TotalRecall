import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import SubscriptionAssignmentTypeSelector from './SubscriptionAssignmentTypeSelector';

const assignSubscriptionSchema = z.object({
  tenant_id: z.string().min(1, "Please select a tenant"),
  plan_id: z.string().min(1, "Please select a plan"),
  billing_cycle: z.enum(['monthly', 'annually']),
  starts_at: z.date(),
  ends_at: z.date().optional(),
  selected_users: z.array(z.string()).optional()
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
  const [step, setStep] = useState<'type' | 'tenant' | 'individual'>('type');
  const [assignmentType, setAssignmentType] = useState<'tenant' | 'individual'>('tenant');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const form = useForm<AssignSubscriptionFormData>({
    resolver: zodResolver(assignSubscriptionSchema),
    defaultValues: {
      billing_cycle: 'monthly',
      starts_at: new Date(),
      selected_users: []
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
      const { data, error } = await (supabase as any)
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('plan_type', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch users for selected tenant (when individual assignment is selected) - fix the relationship
  const { data: tenantUsers } = useQuery({
    queryKey: ['tenant-users', selectedTenant?.id],
    queryFn: async () => {
      if (!selectedTenant?.id || assignmentType !== 'individual') return [];
      
      const { data, error } = await (supabase as any)
        .from('user_tenants')
        .select(`
          user_id,
          profiles!user_tenants_user_id_fkey(id, email, full_name)
        `)
        .eq('tenant_id', selectedTenant.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedTenant?.id && assignmentType === 'individual'
  });

  const assignTenantSubscriptionMutation = useMutation({
    mutationFn: async (data: AssignSubscriptionFormData) => {
      const { error } = await (supabase as any)
        .from('tenant_subscriptions')
        .insert([{
          tenant_id: data.tenant_id,
          plan_id: data.plan_id,
          billing_cycle: data.billing_cycle,
          status: 'active',
          subscription_level: 'tenant',
          starts_at: data.starts_at.toISOString(),
          ends_at: data.ends_at?.toISOString() || null
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscriptions'] });
      toast({
        title: "Success",
        description: "Tenant subscription assigned successfully"
      });
      handleClose();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign tenant subscription",
        variant: "destructive"
      });
    }
  });

  const assignUserSubscriptionsMutation = useMutation({
    mutationFn: async (data: AssignSubscriptionFormData) => {
      if (!data.selected_users || data.selected_users.length === 0) {
        throw new Error('Please select at least one user');
      }

      const subscriptions = data.selected_users.map(userId => ({
        user_id: userId,
        tenant_id: data.tenant_id,
        plan_id: data.plan_id,
        billing_cycle: data.billing_cycle,
        status: 'active' as const,
        starts_at: data.starts_at.toISOString(),
        ends_at: data.ends_at?.toISOString() || null
      }));

      const promises = subscriptions.map(sub => 
        SubscriptionService.createUserSubscription(sub)
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscriptions'] });
      toast({
        title: "Success",
        description: "User subscriptions assigned successfully"
      });
      handleClose();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign user subscriptions",
        variant: "destructive"
      });
    }
  });

  const handleClose = () => {
    form.reset();
    setStep('type');
    setAssignmentType('tenant');
    setSelectedTenant(null);
    onClose();
  };

  const handleTypeSelection = (type: 'tenant' | 'individual') => {
    setAssignmentType(type);
    setStep(type);
  };

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants?.find(t => t.id === tenantId);
    setSelectedTenant(tenant);
    form.setValue('tenant_id', tenantId);
  };

  const handleSubmit = (data: AssignSubscriptionFormData) => {
    if (assignmentType === 'tenant') {
      assignTenantSubscriptionMutation.mutate(data);
    } else {
      assignUserSubscriptionsMutation.mutate(data);
    }
  };

  const renderTypeSelector = () => (
    <SubscriptionAssignmentTypeSelector
      onSelectType={handleTypeSelection}
      tenantName={selectedTenant?.name}
    />
  );

  const renderAssignmentForm = () => (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep('type')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <span className="text-sm text-muted-foreground">
          {assignmentType === 'tenant' ? 'Tenant-Wide Assignment' : 'Individual User Assignment'}
        </span>
      </div>

      <div className="space-y-2">
        <Label>Tenant</Label>
        <Controller
          name="tenant_id"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={handleTenantChange} value={field.value}>
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
        {form.formState.errors.tenant_id && (
          <p className="text-sm text-red-500">{form.formState.errors.tenant_id.message}</p>
        )}
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

      {assignmentType === 'individual' && tenantUsers && (
        <div className="space-y-2">
          <Label>Select Users</Label>
          <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
            {tenantUsers.map((userTenant: any) => (
              <div key={userTenant.user_id} className="flex items-center space-x-2">
                <Controller
                  name="selected_users"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value?.includes(userTenant.user_id) || false}
                      onCheckedChange={(checked) => {
                        const currentUsers = field.value || [];
                        if (checked) {
                          field.onChange([...currentUsers, userTenant.user_id]);
                        } else {
                          field.onChange(currentUsers.filter(id => id !== userTenant.user_id));
                        }
                      }}
                    />
                  )}
                />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{userTenant.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{userTenant.profiles?.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.selected_users && (
            <p className="text-sm text-red-500">Please select at least one user</p>
          )}
        </div>
      )}

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
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={assignTenantSubscriptionMutation.isPending || assignUserSubscriptionsMutation.isPending}
        >
          {assignTenantSubscriptionMutation.isPending || assignUserSubscriptionsMutation.isPending 
            ? 'Assigning...' 
            : `Assign ${assignmentType === 'tenant' ? 'Tenant' : 'User'} Subscription`
          }
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' ? 'Assign Subscription' : `Assign ${assignmentType === 'tenant' ? 'Tenant' : 'User'} Subscription`}
          </DialogTitle>
        </DialogHeader>

        {step === 'type' && renderTypeSelector()}
        {(step === 'tenant' || step === 'individual') && renderAssignmentForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AssignSubscriptionDialog;
