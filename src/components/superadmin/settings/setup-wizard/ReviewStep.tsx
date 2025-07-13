
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Building2, Blocks, Settings, Globe, Send } from 'lucide-react';

interface TenantData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface ReviewStepProps {
  wizardData: {
    tenantData: TenantData | null;
    selectedModules: string[];
    moduleConfigs: Record<string, unknown>;
    integrationSettings: Record<string, unknown>;
    customConfig: Record<string, unknown>;
    outreachSettings: Record<string, unknown>;
  };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ wizardData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Review & Finalize</h3>
        <p className="text-sm text-muted-foreground">
          Review your configuration before completing the setup
        </p>
      </div>

      <div className="space-y-4">
        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{wizardData.tenantData?.name}</span>
              </div>
              {wizardData.tenantData?.description && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Description:</span>
                  <span className="text-sm">{wizardData.tenantData.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Blocks className="h-4 w-4" />
              Module Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wizardData.selectedModules.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {wizardData.selectedModules.length} module{wizardData.selectedModules.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Modules will be assigned with custom configurations as specified
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No modules selected</p>
            )}
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-3 w-3" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">Ready to configure</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="h-3 w-3" />
                Custom Config
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">Ready to configure</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Send className="h-3 w-3" />
                Outreach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">Ready to configure</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">Ready to Complete</h4>
              <p className="text-sm text-green-700">
                All configurations are ready. Click "Complete Setup" to finalize the tenant configuration.
                You can make further adjustments in the Module Management section after setup.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
