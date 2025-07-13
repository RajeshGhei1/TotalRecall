
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Globe } from 'lucide-react';

interface TenantData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface BasicInfoStepProps {
  tenantData: TenantData;
  onUpdate: (data: unknown) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ tenantData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Tenant Information</h3>
        <p className="text-sm text-muted-foreground">
          Review the selected tenant details before proceeding with module assignment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {tenantData.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tenantData.description && (
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm text-gray-600 mt-1">{tenantData.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">ID: {tenantData.id}</span>
            </div>
            {tenantData.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Created: {new Date(tenantData.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Badge variant="default">Ready for Configuration</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select and configure modules for this tenant</li>
          <li>• Set up integrations and external connections</li>
          <li>• Configure custom fields and settings</li>
          <li>• Enable outreach and communication tools</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicInfoStep;
