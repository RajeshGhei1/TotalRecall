
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, CreditCard, Building, Users, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TenantSubscription } from '@/types/subscription-types';
import AssignSubscriptionDialog from './AssignSubscriptionDialog';
import UserSubscriptionManager from './UserSubscriptionManager';
import EditTenantSubscriptionDialog from './EditTenantSubscriptionDialog';
import EndTenantSubscriptionDialog from './EndTenantSubscriptionDialog';

const TenantSubscriptionManager = () => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<TenantSubscription | null>(null);
  const [endingSubscriptionId, setEndingSubscriptionId] = useState<string | null>(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['tenant-subscriptions'],
    queryFn: async (): Promise<TenantSubscription[]> => {
      const { data, error } = await (supabase as unknown)
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

  // Get unique tenants for user subscription management
  const { data: tenants } = useQuery({
    queryKey: ['tenants-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
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

  const handleEditSubscription = (subscription: TenantSubscription) => {
    console.log('Editing subscription:', subscription);
    setEditingSubscription(subscription);
  };

  const handleEndSubscription = (subscription: TenantSubscription) => {
    console.log('Ending subscription with ID:', subscription.id);
    setEndingSubscriptionId(subscription.id);
  };

  // Find the subscription being ended for the dialog
  const endingSubscription = endingSubscriptionId 
    ? subscriptions?.find(sub => sub.id === endingSubscriptionId) || null
    : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
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
      <Tabs defaultValue="tenant-subscriptions" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="tenant-subscriptions" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Tenant Subscriptions
            </TabsTrigger>
            <TabsTrigger value="user-subscriptions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Subscriptions
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Subscription
          </Button>
        </div>

        <TabsContent value="tenant-subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Tenant-Level Subscriptions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Subscriptions assigned to entire tenants (affects all users in the tenant)
              </p>
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
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {(subscription as unknown).tenants?.name || 'Unknown Tenant'}
                            </h4>
                            <Badge variant={getStatusColor(subscription.status)} className="mt-1">
                              {subscription.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                            {subscription.subscription_plans && formatPrice(
                              subscription.billing_cycle === 'monthly' 
                                ? subscription.subscription_plans.price_monthly
                                : subscription.subscription_plans.price_annually,
                              subscription.billing_cycle
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSubscription(subscription)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEndSubscription(subscription)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
        </TabsContent>

        <TabsContent value="user-subscriptions">
          <div className="space-y-4">
            {/* Tenant Selector for User Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Select Tenant</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose a tenant to manage individual user subscriptions
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tenants?.map((tenant) => (
                    <Button
                      key={tenant.id}
                      variant={selectedTenantId === tenant.id ? "default" : "outline"}
                      onClick={() => setSelectedTenantId(tenant.id)}
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{tenant.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Subscription Manager */}
            {selectedTenantId && (
              <UserSubscriptionManager
                tenantId={selectedTenantId}
                tenantName={tenants?.find(t => t.id === selectedTenantId)?.name || 'Unknown Tenant'}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AssignSubscriptionDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
      />

      <EditTenantSubscriptionDialog
        isOpen={!!editingSubscription}
        onClose={() => setEditingSubscription(null)}
        subscription={editingSubscription}
      />

      <EndTenantSubscriptionDialog
        isOpen={!!endingSubscriptionId}
        onClose={() => setEndingSubscriptionId(null)}
        subscription={endingSubscription}
      />
    </div>
  );
};

export default TenantSubscriptionManager;
