
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, Crown } from 'lucide-react';

interface SubscriptionAssignmentTypeSelectorProps {
  onSelectType: (type: 'tenant' | 'individual') => void;
  tenantName?: string;
}

const SubscriptionAssignmentTypeSelector: React.FC<SubscriptionAssignmentTypeSelectorProps> = ({
  onSelectType,
  tenantName = 'Selected Tenant'
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">How would you like to assign the subscription?</h3>
        <p className="text-sm text-muted-foreground">
          Choose whether to assign to all users in {tenantName} or to specific individuals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-base">Tenant-Wide Assignment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Assign the same subscription plan to all users in the tenant. This is the traditional approach.
            </p>
            <ul className="text-xs space-y-1 mb-4 text-muted-foreground">
              <li>• All users get the same plan</li>
              <li>• Easier to manage</li>
              <li>• Single billing per tenant</li>
            </ul>
            <Button 
              onClick={() => onSelectType('tenant')}
              className="w-full"
              variant="outline"
            >
              Assign to Entire Tenant
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-base">Individual User Assignment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Assign different subscription plans to specific users within the tenant.
            </p>
            <ul className="text-xs space-y-1 mb-4 text-muted-foreground">
              <li>• Flexible per-user plans</li>
              <li>• Premium users get premium features</li>
              <li>• Individual billing tracking</li>
            </ul>
            <Button 
              onClick={() => onSelectType('individual')}
              className="w-full"
              variant="outline"
            >
              Assign to Individual Users
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Crown className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-1">Priority System</p>
            <p className="text-amber-700">
              Individual user subscriptions take priority over tenant-wide subscriptions. 
              Users without individual plans will fall back to the tenant plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAssignmentTypeSelector;
