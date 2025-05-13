
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface TenantSelectorProps {
  selectedTenantId: string | null;
  onTenantChange: (tenantId: string) => void;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ selectedTenantId, onTenantChange }) => {
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Select Tenant</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Select Tenant</Label>
        <div className="border rounded p-3 text-muted-foreground text-sm">
          No tenants available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Tenant</Label>
      <Select value={selectedTenantId || undefined} onValueChange={onTenantChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a tenant" />
        </SelectTrigger>
        <SelectContent>
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSelector;
