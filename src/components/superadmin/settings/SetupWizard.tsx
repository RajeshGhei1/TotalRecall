
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import the steps from tenant admin
import WizardStepIndicator from "../../../pages/tenant-admin/settings/setup-wizard/WizardStepIndicator";
import BasicInfoStep from "../../../pages/tenant-admin/settings/setup-wizard/steps/BasicInfoStep";
import SocialMediaStep from "../../../pages/tenant-admin/settings/setup-wizard/steps/SocialMediaStep";
import CommunicationStep from "../../../pages/tenant-admin/settings/setup-wizard/steps/CommunicationStep";
import OutreachStep from "../../../pages/tenant-admin/settings/setup-wizard/steps/OutreachStep";

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SetupWizard = ({ open, onOpenChange }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const totalSteps = 4;

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
    queryKey: ['tenantDetails', selectedTenantId],
    queryFn: async () => {
      if (!selectedTenantId) return null;
      
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description')
        .eq('id', selectedTenantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTenantId,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setTenantData(data);
        }
      }
    }
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      toast({
        title: "Setup Complete!",
        description: `Tenant "${tenantData?.name}" has been configured successfully.`,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTenantData = (data: any) => {
    setTenantData(prev => ({ ...prev, ...data }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tenant Setup Wizard</DialogTitle>
          <DialogDescription>
            Configure tenants step by step. As a super admin, you can set up any tenant.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Select Tenant to Configure</Label>
            <Select value={selectedTenantId || undefined} onValueChange={setSelectedTenantId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tenant" />
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
        
        {selectedTenantId && tenantData && (
          <>
            <WizardStepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="py-4">
              {currentStep === 1 && (
                <BasicInfoStep 
                  tenantData={tenantData} 
                  updateTenantData={updateTenantData} 
                />
              )}
              {currentStep === 2 && <SocialMediaStep />}
              {currentStep === 3 && <CommunicationStep />}
              {currentStep === 4 && <OutreachStep />}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? "Finish" : (
                  <span className="flex items-center">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {selectedTenantId && tenantDataLoading && (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jobmojo-primary"></div>
          </div>
        )}
        
        {selectedTenantId === null && (
          <div className="py-8 text-center text-muted-foreground">
            Please select a tenant to continue with the setup wizard
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetupWizard;
