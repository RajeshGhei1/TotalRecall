
import React, { useState } from 'react';
import AIModelList from './ai-models/AIModelList';
import TenantSelector from './ai-models/TenantSelector';
import ModelAssignmentForm from './ai-models/ModelAssignmentForm';
import { useAvailableModels, getTenantModel, useTenants } from './ai-models/AIModelData';

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
      <AIModelList models={availableModels} />
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Assign AI Models to Tenants</h3>
        
        <div className="space-y-6">
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
              defaultModelId={getTenantModel(selectedTenantId, availableModels)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModelIntegration;
