
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, X } from 'lucide-react';

interface AccessSourceIndicatorProps {
  source: 'subscription' | 'tenant_override' | 'none';
  planName?: string;
  assignedBy?: string;
  className?: string;
}

const AccessSourceIndicator: React.FC<AccessSourceIndicatorProps> = ({
  source,
  planName,
  assignedBy,
  className = ''
}) => {
  switch (source) {
    case 'subscription':
      return (
        <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-300 ${className}`}>
          <Shield className="h-3 w-3 mr-1" />
          Subscription
          {planName && <span className="ml-1">({planName})</span>}
        </Badge>
      );
    
    case 'tenant_override':
      return (
        <Badge variant="outline" className={`bg-amber-100 text-amber-800 border-amber-300 ${className}`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Override
          {assignedBy && <span className="ml-1">(by {assignedBy})</span>}
        </Badge>
      );
    
    case 'none':
    default:
      return (
        <Badge variant="outline" className={`bg-gray-100 text-gray-600 border-gray-300 ${className}`}>
          <X className="h-3 w-3 mr-1" />
          No Access
        </Badge>
      );
  }
};

export default AccessSourceIndicator;
