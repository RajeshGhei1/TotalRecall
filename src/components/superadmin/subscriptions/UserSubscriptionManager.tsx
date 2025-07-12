
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, User, Crown, Building, Calendar, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserSubscriptionManagerProps {
  tenantId: string;
  tenantName: string;
}

const UserSubscriptionManager: React.FC<UserSubscriptionManagerProps> = ({
  tenantId,
  tenantName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tenant subscription overview
  const { data: overview, isLoading } = useQuery({
    queryKey: ['tenant-subscription-overview', tenantId],
    queryFn: () => SubscriptionService.getTenantSubscriptionOverview(tenantId)
  });

  // Fetch available subscription plans
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown)
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('plan_type');
      
      if (error) throw error;
      return data;
    }
  });

  const deleteUserSubscriptionMutation = useMutation({
    mutationFn: SubscriptionService.deleteUserSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-subscription-overview', tenantId] });
      toast({
        title: "Success",
        description: "User subscription removed successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove user subscription",
        variant: "destructive"
      });
    }
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredUserSubscriptions = overview?.userSubscriptions.filter(sub => {
    const matchesSearch = searchTerm === '' || 
      (sub as unknown).profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub as unknown).profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Subscription Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!overview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Subscription Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Error loading subscription data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {tenantName} - User Subscriptions
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage individual user subscriptions within this tenant
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Individual Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Tenant Plan</span>
              </div>
              <p className="text-lg font-semibold text-blue-900">
                {overview.tenantSubscription?.subscription_plans?.name || 'No tenant plan'}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Total Users</span>
              </div>
              <p className="text-lg font-semibold text-green-900">{overview.totalUsers}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Individual Plans</span>
              </div>
              <p className="text-lg font-semibold text-purple-900">{overview.usersWithIndividualPlans}</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">On Tenant Plan</span>
              </div>
              <p className="text-lg font-semibold text-amber-900">
                {overview.totalUsers - overview.usersWithIndividualPlans}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Subscriptions List */}
          {filteredUserSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {filteredUserSubscriptions.map((userSub) => (
                <div key={userSub.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {(userSub as unknown).profiles?.full_name || 'Unknown User'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {(userSub as unknown).profiles?.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{userSub.subscription_plans?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {userSub.subscription_plans && formatPrice(
                            userSub.billing_cycle === 'monthly' 
                              ? userSub.subscription_plans.price_monthly
                              : userSub.subscription_plans.price_annually,
                            userSub.billing_cycle
                          )}
                        </p>
                      </div>

                      <Badge variant={getStatusColor(userSub.status)}>
                        {userSub.status}
                      </Badge>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteUserSubscriptionMutation.mutate(userSub.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Started: {formatDate(userSub.starts_at)}</span>
                    </div>
                    {userSub.ends_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Ends: {formatDate(userSub.ends_at)}</span>
                      </div>
                    )}
                    <div>
                      <span className="capitalize">{userSub.billing_cycle} billing</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No users match the current filters' 
                : 'No individual user subscriptions found. All users are using the tenant plan.'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSubscriptionManager;
