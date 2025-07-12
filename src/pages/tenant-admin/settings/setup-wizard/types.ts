
export interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: any;
}

export interface WizardStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  tenantData: any;
  updateTenantData: (data: unknown) => void;
}
