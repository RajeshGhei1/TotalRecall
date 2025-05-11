
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SetupWizardProps } from "./types";
import WizardStepIndicator from "./WizardStepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import SocialMediaStep from "./steps/SocialMediaStep";
import CommunicationStep from "./steps/CommunicationStep";
import OutreachStep from "./steps/OutreachStep";

const SetupWizard = ({ open, onOpenChange, tenantData }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      toast({
        title: "Setup Complete!",
        description: "Your tenant has been configured successfully.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tenant Setup Wizard</DialogTitle>
          <DialogDescription>
            Configure your tenant step by step. This will help you get started quickly.
          </DialogDescription>
        </DialogHeader>
        
        <WizardStepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="py-4">
          {currentStep === 1 && <BasicInfoStep tenantData={tenantData} />}
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
      </DialogContent>
    </Dialog>
  );
};

export default SetupWizard;
