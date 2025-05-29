
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTenants } from '@/hooks/useTenants';
import { Loader2 } from 'lucide-react';

interface TenantSelectorProps {
  value: string | null;
  onChange: (tenantId: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  const { tenants, isLoading } = useTenants();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading tenants...</span>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="tenant-select">
        Target Tenant {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(val || null)}
        disabled={disabled}
      >
        <SelectTrigger id="tenant-select">
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
      {tenants.length === 0 && (
        <p className="text-sm text-muted-foreground mt-1">
          No tenants available
        </p>
      )}
    </div>
  );
};

export default TenantSelector;
