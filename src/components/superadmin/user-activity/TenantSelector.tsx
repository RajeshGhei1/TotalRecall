
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TenantSelectorProps {
  selectedTenantId?: string;
  onTenantChange: (tenantId: string | undefined) => void;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ 
  selectedTenantId, 
  onTenantChange 
}) => {
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants-for-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onTenantChange(undefined);
    } else {
      onTenantChange(value);
    }
  };

  return (
    <Select 
      value={selectedTenantId || 'all'} 
      onValueChange={handleValueChange}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Tenants" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tenants</SelectItem>
        {tenants?.map((tenant) => (
          <SelectItem key={tenant.id} value={tenant.id}>
            {tenant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TenantSelector;
