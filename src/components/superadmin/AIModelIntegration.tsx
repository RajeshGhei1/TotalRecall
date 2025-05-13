
import React, { useState } from 'react';
import AIModelList from './ai-models/AIModelList';
import TenantSelector from './ai-models/TenantSelector';
import ModelAssignmentForm from './ai-models/ModelAssignmentForm';
import { useAvailableModels, useTenants } from './ai-models/AIModelData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const AIModelIntegration = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  
  // Get available AI models
  const availableModels = useAvailableModels();
  
  // Get tenants
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenants();

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
  };

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
          <CardTitle>Assign Models to Tenants</CardTitle>
          <CardDescription>
            Select a tenant and assign an AI model that will be used for all AI features within that tenant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TenantSelector 
            tenants={tenants}
            selectedTenantId={selectedTenantId}
            onSelectTenant={handleSelectTenant}
            isLoading={isLoadingTenants}
          />
          
          {selectedTenantId && (
            <ModelAssignmentForm
              selectedTenantId={selectedTenantId}
              availableModels={availableModels}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelIntegration;
