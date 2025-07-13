
export interface TenantData {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  settings?: Record<string, unknown>;
}

export interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: TenantData;
}

export interface WizardStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  tenantData: TenantData;
  updateTenantData: (data: unknown) => void;
}
