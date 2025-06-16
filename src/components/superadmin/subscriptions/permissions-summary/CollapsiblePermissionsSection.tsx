
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

interface ModuleDetail {
  name: string;
  label: string;
  isEnabled: boolean;
  limits: Record<string, any>;
}

interface CollapsiblePermissionsSectionProps {
  moduleDetails: ModuleDetail[];
  expandByDefault?: boolean;
}

const CollapsiblePermissionsSection: React.FC<CollapsiblePermissionsSectionProps> = ({
  moduleDetails,
  expandByDefault = false
}) => {
  const [isOpen, setIsOpen] = React.useState(expandByDefault);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span>View all module details</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {moduleDetails.map((module) => (
          <div key={module.name} className="flex items-center justify-between py-1">
            <span className="text-sm">{module.label}</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={module.isEnabled ? 'default' : 'outline'}
                className={`text-xs ${
                  module.isEnabled 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {module.isEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              {module.isEnabled && Object.keys(module.limits).length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {Object.entries(module.limits).map(([key, value]) => 
                    `${value} ${key.replace(/_/g, ' ')}`
                  ).join(', ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsiblePermissionsSection;
