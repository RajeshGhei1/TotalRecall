
import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTenantContext } from '@/contexts/TenantContext';

interface TenantContextIndicatorProps {
  showInHeader?: boolean;
  className?: string;
}

const TenantContextIndicator: React.FC<TenantContextIndicatorProps> = ({ 
  showInHeader = false, 
  className = "" 
}) => {
  const { selectedTenantId, selectedTenantName } = useTenantContext();

  if (!selectedTenantId) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm text-muted-foreground">
          No tenant selected
        </span>
      </div>
    );
  }

  if (showInHeader) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Building2 className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-blue-900">{selectedTenantName}</span>
        <Badge variant="outline" className="text-xs">
          {selectedTenantId.slice(0, 8)}...
        </Badge>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md ${className}`}>
      <Building2 className="h-3 w-3 text-blue-600" />
      <span className="text-sm font-medium text-blue-900">{selectedTenantName}</span>
    </div>
  );
};

export default TenantContextIndicator;
