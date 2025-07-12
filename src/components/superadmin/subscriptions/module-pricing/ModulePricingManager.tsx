
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, DollarSign } from 'lucide-react';
import { useModulePricing } from '@/hooks/subscriptions/usePricingEngine';
import { useSystemModules } from '@/hooks/useSystemModules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ModulePricingManager: React.FC = () => {
  const { data: modulePricing, isLoading: pricingLoading } = useModulePricing();
  const { data: systemModules, isLoading: modulesLoading } = useSystemModules();
  const [pricing, setPricing] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (modulePricing) {
      const pricingMap: Record<string, any> = {};
      modulePricing.forEach(mp => {
        pricingMap[mp.module_name] = {
          base_price_monthly: mp.base_price_monthly,
          base_price_annually: mp.base_price_annually,
          is_active: mp.is_active
        };
      });
      setPricing(pricingMap);
    }
  }, [modulePricing]);

  const savePricingMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(pricing).map(([moduleName, config]) => ({
        module_name: moduleName,
        base_price_monthly: config.base_price_monthly || 0,
        base_price_annually: config.base_price_annually || 0,
        is_active: config.is_active !== false
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('module_pricing')
          .upsert(update, { onConflict: 'module_name' });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-pricing'] });
      toast({
        title: "Success",
        description: "Module pricing updated successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update module pricing",
        variant: "destructive"
      });
    }
  });

  const updateModulePricing = (moduleName: string, field: string, value: any) => {
    setPricing(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [field]: value
      }
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Transform system modules for display
  const availableModules = React.useMemo(() => {
    if (!systemModules) return [];
    
    return systemModules
      .filter(module => module.is_active)
      .map(module => ({
        name: module.name,
        label: module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: module.description || `${module.category} module`
      }));
  }, [systemModules]);

  const isLoading = pricingLoading || modulesLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Module Pricing Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Module Pricing Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure individual module pricing for dynamic plan costs
          </p>
        </div>
        <Button 
          onClick={() => savePricingMutation.mutate()}
          disabled={savePricingMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {savePricingMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableModules.map((module) => {
          const moduleConfig = pricing[module.name] || {};
          const monthlyPrice = moduleConfig.base_price_monthly || 0;
          const annualPrice = moduleConfig.base_price_annually || 0;
          const isActive = moduleConfig.is_active !== false;

          return (
            <div key={module.name} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{module.label}</h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => 
                    updateModulePricing(module.name, 'is_active', checked)
                  }
                />
              </div>

              {isActive && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Monthly Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={monthlyPrice}
                        onChange={(e) => 
                          updateModulePricing(module.name, 'base_price_monthly', parseFloat(e.target.value) || 0)
                        }
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: {formatPrice(monthlyPrice)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Annual Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={annualPrice}
                        onChange={(e) => 
                          updateModulePricing(module.name, 'base_price_annually', parseFloat(e.target.value) || 0)
                        }
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: {formatPrice(annualPrice)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {availableModules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active modules found. Create modules in the Module Registry to configure pricing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModulePricingManager;
