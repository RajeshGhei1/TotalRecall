
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Calculator } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModulePricingToggleProps {
  useModulePricing: boolean;
  onToggle: (enabled: boolean) => void;
}

const ModulePricingToggle: React.FC<ModulePricingToggleProps> = ({
  useModulePricing,
  onToggle
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-blue-600" />
            <div>
              <Label className="text-sm font-medium">Module-Based Pricing</Label>
              <p className="text-xs text-muted-foreground">
                Dynamic pricing based on enabled modules
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    When enabled, the plan price will be calculated as base price + 
                    sum of enabled module prices. When disabled, uses fixed pricing.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Switch
              checked={useModulePricing}
              onCheckedChange={onToggle}
            />
          </div>
        </div>
        
        {useModulePricing && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Module pricing enabled:</strong> Plan price will be calculated dynamically 
              based on selected modules. Configure module prices in the Module Pricing tab.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModulePricingToggle;
