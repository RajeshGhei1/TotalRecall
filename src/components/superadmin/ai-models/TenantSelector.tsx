
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TenantSelectorProps {
  tenants: Array<{ id: string; name: string }>;
  selectedTenantId: string | null;
  onSelectTenant: (tenantId: string) => void;
  isLoading: boolean;
}

const TenantSelector = ({ 
  tenants, 
  selectedTenantId, 
  onSelectTenant,
  isLoading 
}: TenantSelectorProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Tenant</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <Button
            key={tenant.id}
            variant={tenant.id === selectedTenantId ? "default" : "outline"}
            className="h-auto py-3 justify-start"
            onClick={() => onSelectTenant(tenant.id)}
          >
            {tenant.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TenantSelector;
