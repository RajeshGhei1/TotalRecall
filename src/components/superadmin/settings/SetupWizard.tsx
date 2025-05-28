
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

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });

  const { data: selectedTenantData, isLoading: tenantDataLoading } = useQuery({
    queryKey: ['tenantDetails', wizardData.selectedTenantId],
    queryFn: async () => {
      if (!wizardData.selectedTenantId) return null;
      
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description')
        .eq('id', wizardData.selectedTenantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!wizardData.selectedTenantId,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setWizardData(prev => ({ ...prev, tenantData: data }));
        }
      }
    }
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
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
              <Select 
                value={wizardData.selectedTenantId || undefined} 
                onValueChange={(value) => updateWizardData({ selectedTenantId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tenant to configure" />
                </SelectTrigger>
                <SelectContent>
                  {tenantsLoading ? (
                    <SelectItem value="loading" disabled>Loading tenants...</SelectItem>
                  ) : tenants && tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No tenants found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Show wizard steps only after tenant is selected */}
        {wizardData.selectedTenantId && wizardData.tenantData && (
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
        
        {wizardData.selectedTenantId && tenantDataLoading && (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jobmojo-primary"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetupWizard;
