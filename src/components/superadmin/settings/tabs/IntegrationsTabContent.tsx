
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings,
  Building2,
  Users
} from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import { useTenants } from '@/hooks/useTenants';

const IntegrationsTabContent = () => {
  const { selectedTenantId } = useTenantContext();
  const { tenants } = useTenants();
  const selectedTenant = tenants?.find(t => t.id === selectedTenantId);

  if (!selectedTenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Please select a tenant to manage integrations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration Management</h2>
        <p className="text-gray-600">
          Integration modules are now managed through subscription plans. 
          Configure module access by assigning subscription plans to tenants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Tenant Subscription</CardTitle>
            </div>
            <CardDescription>
              Manage the subscription plan for {selectedTenant?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Module access is now controlled through subscription plans. 
              Visit the Subscription Management section to assign plans and configure module access.
            </p>
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Subscriptions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <CardTitle>Module Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure integration settings for enabled modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integration configurations are managed within each module's settings. 
              Access is automatically granted based on the tenant's subscription plan.
            </p>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Module Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Migration Notice</CardTitle>
          <CardDescription>
            Module access has been simplified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What Changed?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Manual module overrides have been removed</li>
              <li>• All module access is now controlled through subscription plans</li>
              <li>• This provides a more consistent and scalable approach</li>
              <li>• Contact support if you need help configuring subscriptions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTabContent;
