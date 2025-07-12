
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import the enhanced wizard steps
import WizardStepIndicator from "./setup-wizard/WizardStepIndicator";
import BasicInfoStep from "./setup-wizard/BasicInfoStep";
import ModuleSelectionStep from "./setup-wizard/ModuleSelectionStep";
import IntegrationSetupStep from "./setup-wizard/IntegrationSetupStep";
import CustomConfigurationStep from "./setup-wizard/CustomConfigurationStep";
import OutreachStep from "./setup-wizard/OutreachStep";
import ReviewStep from "./setup-wizard/ReviewStep";

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WizardData {
  selectedTenantId: string | null;
  tenantData: any;
  selectedModules: string[];
  moduleConfigs: Record<string, any>;
  integrationSettings: Record<string, any>;
  customConfig: Record<string, any>;
  outreachSettings: Record<string, any>;
}

const SetupWizard = ({ open, onOpenChange }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedTenantId: null,
    tenantData: null,
    selectedModules: [],
    moduleConfigs: {},
    integrationSettings: {},
    customConfig: {},
    outreachSettings: {}
  });

  // Fetch tenants with proper error handling
  const { data: tenants, isLoading: tenantsLoading, error: tenantsError } = useQuery({
    queryKey: ['tenants-for-wizard'],
    queryFn: async () => {
      console.log("Fetching tenants for wizard...");
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description, created_at')
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Error fetching tenants:", error);
        throw error;
      }
      
      console.log("Tenants fetched successfully:", data);
      return data || [];
    },
    enabled: open // Only fetch when dialog is open
  });

  // Fetch selected tenant details
  const { data: selectedTenantData, isLoading: tenantDataLoading } = useQuery({
    queryKey: ['tenantDetails', wizardData.selectedTenantId],
    queryFn: async () => {
      if (!wizardData.selectedTenantId) return null;
      
      console.log("Fetching tenant details for:", wizardData.selectedTenantId);
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description, created_at')
        .eq('id', wizardData.selectedTenantId)
        .single();

      if (error) {
        console.error("Error fetching tenant details:", error);
        throw error;
      }
      
      console.log("Tenant details fetched:", data);
      return data;
    },
    enabled: !!wizardData.selectedTenantId,
    meta: {
      onSuccess: (data: unknown) => {
        if (data) {
          console.log("Setting tenant data:", data);
          setWizardData(prev => ({ ...prev, tenantData: data }));
        }
      }
    }
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleTenantSelection = (tenantId: string) => {
    console.log("Tenant selected:", tenantId);
    updateWizardData({ 
      selectedTenantId: tenantId,
      tenantData: null // Reset tenant data while loading
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the setup
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Here we would save all the wizard data
      // For now, just show success message
      onOpenChange(false);
      toast({
        title: "Setup Complete!",
        description: `Tenant "${wizardData.tenantData?.name}" has been configured successfully with ${wizardData.selectedModules.length} modules.`,
      });
      
      // Reset wizard
      setCurrentStep(1);
      setWizardData({
        selectedTenantId: null,
        tenantData: null,
        selectedModules: [],
        moduleConfigs: {},
        integrationSettings: {},
        customConfig: {},
        outreachSettings: {}
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error completing the setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Basic Information",
      "Module Selection",
      "Integration Setup", 
      "Custom Configuration",
      "Outreach & Communication",
      "Review & Activate"
    ];
    return titles[currentStep - 1] || "";
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.selectedTenantId && wizardData.tenantData;
      case 2:
        return wizardData.selectedModules.length > 0;
      default:
        return true;
    }
  };

  // Show error state if tenants failed to load
  if (tenantsError) {
    console.error("Tenants loading error:", tenantsError);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enhanced Tenant Setup Wizard</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </DialogDescription>
        </DialogHeader>
        
        {/* Tenant Selection - Always show if no tenant selected */}
        {!wizardData.selectedTenantId && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Tenant</Label>
              {tenantsLoading ? (
                <div className="border rounded p-3 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading tenants...
                </div>
              ) : tenantsError ? (
                <div className="border rounded p-3 text-center text-red-600">
                  Error loading tenants. Please try again.
                </div>
              ) : !tenants || tenants.length === 0 ? (
                <div className="border rounded p-3 text-center text-muted-foreground">
                  No tenants found. Please create a tenant first.
                </div>
              ) : (
                <Select 
                  value={wizardData.selectedTenantId || undefined} 
                  onValueChange={handleTenantSelection}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tenant to configure" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{tenant.name}</span>
                          {tenant.description && (
                            <span className="text-sm text-muted-foreground">{tenant.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Show tenant count for debugging */}
            {tenants && (
              <div className="text-xs text-muted-foreground">
                {tenants.length} tenant(s) available
              </div>
            )}
          </div>
        )}
        
        {/* Show wizard steps only after tenant is selected */}
        {wizardData.selectedTenantId && (
          <>
            {/* Show loading state while fetching tenant details */}
            {tenantDataLoading && (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Show wizard content when tenant data is loaded */}
            {wizardData.tenantData && (
              <>
                <WizardStepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                
                <div className="py-4 min-h-[400px]">
                  {currentStep === 1 && (
                    <BasicInfoStep 
                      tenantData={wizardData.tenantData}
                      onUpdate={(data) => updateWizardData({ tenantData: { ...wizardData.tenantData, ...data } })}
                    />
                  )}
                  {currentStep === 2 && (
                    <ModuleSelectionStep
                      selectedModules={wizardData.selectedModules}
                      moduleConfigs={wizardData.moduleConfigs}
                      onUpdate={(modules, configs) => updateWizardData({ 
                        selectedModules: modules, 
                        moduleConfigs: configs 
                      })}
                    />
                  )}
                  {currentStep === 3 && (
                    <IntegrationSetupStep
                      settings={wizardData.integrationSettings}
                      onUpdate={(settings) => updateWizardData({ integrationSettings: settings })}
                    />
                  )}
                  {currentStep === 4 && (
                    <CustomConfigurationStep
                      config={wizardData.customConfig}
                      onUpdate={(config) => updateWizardData({ customConfig: config })}
                    />
                  )}
                  {currentStep === 5 && (
                    <OutreachStep
                      settings={wizardData.outreachSettings}
                      onUpdate={(settings) => updateWizardData({ outreachSettings: settings })}
                    />
                  )}
                  {currentStep === 6 && (
                    <ReviewStep wizardData={wizardData} />
                  )}
                </div>
                
                <DialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    {currentStep === totalSteps ? "Complete Setup" : (
                      <span className="flex items-center">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetupWizard;
