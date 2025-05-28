
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useToast } from '@/hooks/use-toast';

interface EnableModulePricingActionProps {
  planId: string;
  planName: string;
  currentlyEnabled: boolean;
}

const EnableModulePricingAction: React.FC<EnableModulePricingActionProps> = ({
  planId,
  planName,
  currentlyEnabled
}) => {
  const { updatePlan } = useSubscriptionPlans();
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      await updatePlan.mutateAsync({
        id: planId,
        updates: {
          use_module_pricing: !currentlyEnabled,
          // If enabling module pricing, set base prices to current prices
          base_price_monthly: !currentlyEnabled ? 29 : undefined,
          base_price_annually: !currentlyEnabled ? 290 : undefined
        }
      });

      toast({
        title: "Success",
        description: `Module pricing ${!currentlyEnabled ? 'enabled' : 'disabled'} for ${planName}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan pricing settings",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant={currentlyEnabled ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={updatePlan.isPending}
    >
      <Calculator className="h-4 w-4 mr-2" />
      {currentlyEnabled ? 'Disable' : 'Enable'} Module Pricing
    </Button>
  );
};

export default EnableModulePricingAction;
