
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TenantSubscription } from '@/types/subscription-types';
import AssignSubscriptionDialog from './AssignSubscriptionDialog';

const TenantSubscriptionManager = () => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['tenant-subscriptions'],
    queryFn: async (): Promise<TenantSubscription[]> => {
      const { data, error } = await (supabase as any)
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*),
          tenants(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number, cycle: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
    return `${formattedPrice}/${cycle === 'monthly' ? 'mo' : 'yr'}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tenant Subscriptions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage tenant subscription assignments and status
            </p>
          </div>
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Subscription
          </Button>
        </CardHeader>
        <CardContent>
          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div 
                  key={subscription.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">
                        {(subscription as any).tenants?.name || 'Unknown Tenant'}
                      </h4>
                      <Badge variant={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      {subscription.subscription_plans && formatPrice(
                        subscription.billing_cycle === 'monthly' 
                          ? subscription.subscription_plans.price_monthly
                          : subscription.subscription_plans.price_annually,
                        subscription.billing_cycle
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Plan:</span>
                      <p className="font-medium">
                        {subscription.subscription_plans?.name || 'Unknown Plan'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Started:</span>
                      <span>{formatDate(subscription.starts_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {subscription.ends_at ? 'Ends:' : 'No end date'}
                      </span>
                      {subscription.ends_at && (
                        <span>{formatDate(subscription.ends_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tenant subscriptions found. Assign subscriptions to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <AssignSubscriptionDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
      />
    </div>
  );
};

export default TenantSubscriptionManager;
