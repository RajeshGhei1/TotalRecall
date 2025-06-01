
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AgentCapabilitiesListProps {
  capabilities: string[];
}

export const AgentCapabilitiesList = ({ capabilities }: AgentCapabilitiesListProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        <span className="font-medium">Capabilities:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability} variant="outline" className="text-xs">
              {capability}
            </Badge>
          ))}
          {capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{capabilities.length - 3} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
