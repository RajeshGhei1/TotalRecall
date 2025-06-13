
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import { useTenants } from '@/hooks/useTenants';
import { cn } from '@/lib/utils';

interface TenantContextIndicatorProps {
  showInHeader?: boolean;
  className?: string;
}

const TenantContextIndicator: React.FC<TenantContextIndicatorProps> = ({ 
  showInHeader = false, 
  className 
}) => {
  const { selectedTenantId } = useTenantContext();
  const { tenants } = useTenants();
  
  const selectedTenant = tenants?.find(t => t.id === selectedTenantId);

  if (!selectedTenantId || !selectedTenant) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="outline" className="text-muted-foreground">
          <Building2 className="h-3 w-3 mr-1" />
          No tenant selected
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant="default" className="bg-primary text-primary-foreground">
        <Building2 className="h-3 w-3 mr-1" />
        {selectedTenant.name}
      </Badge>
    </div>
  );
};

export default TenantContextIndicator;
