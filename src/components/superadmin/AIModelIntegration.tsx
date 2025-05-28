
import React from 'react';
import AIModelList from './ai-models/AIModelList';
import ModelAssignmentForm from './ai-models/ModelAssignmentForm';
import { useAvailableModels } from './ai-models/AIModelData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import TenantContextIndicator from './settings/shared/TenantContextIndicator';

const AIModelIntegration = () => {
  const { selectedTenantId } = useTenantContext();
  
  // Get available AI models
  const availableModels = useAvailableModels();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Available AI Models
          </CardTitle>
          <CardDescription>
            These are the AI models that can be assigned to tenants for use in the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIModelList models={availableModels} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Assign Models to Selected Tenant</CardTitle>
              <CardDescription>
                Assign an AI model that will be used for all AI features within the selected tenant.
              </CardDescription>
            </div>
            <TenantContextIndicator />
          </div>
        </CardHeader>
        <CardContent>
          {selectedTenantId ? (
            <ModelAssignmentForm
              selectedTenantId={selectedTenantId}
              availableModels={availableModels}
            />
          ) : (
            <div className="flex items-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">No Tenant Selected</p>
                <p className="text-sm text-gray-600">
                  Please select a tenant from the global context above to assign AI models.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelIntegration;
