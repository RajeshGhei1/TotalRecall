
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';

const GlobalTenantSelector: React.FC = () => {
  const { selectedTenantId, selectedTenantName, setSelectedTenant, clearSelectedTenant } = useTenantContext();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants-global-selector'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description, created_at')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants?.find(t => t.id === tenantId);
    setSelectedTenant(tenantId, tenant?.name);
  };

  const handleClearSelection = () => {
    clearSelectedTenant();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Global Tenant Context</Label>
        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Global Tenant Context
        </Label>
        {selectedTenantId && (
          <button
            onClick={handleClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </button>
        )}
      </div>
      
      {selectedTenantId ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Building2 className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">{selectedTenantName}</div>
              <div className="text-xs text-blue-600">ID: {selectedTenantId.slice(0, 8)}...</div>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <Select value={selectedTenantId} onValueChange={handleTenantChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Switch to different tenant..." />
            </SelectTrigger>
            <SelectContent>
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{tenant.name}</span>
                    {tenant.description && (
                      <span className="text-sm text-muted-foreground">{tenant.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Select value={selectedTenantId || undefined} onValueChange={handleTenantChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tenant to configure..." />
            </SelectTrigger>
            <SelectContent>
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{tenant.name}</span>
                    {tenant.description && (
                      <span className="text-sm text-muted-foreground">{tenant.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {tenants?.length || 0} tenant(s) available • Select one to manage configurations
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalTenantSelector;
